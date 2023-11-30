using Domain.Models;
using Infrastructure;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    /// <summary>
    /// The users handler class.
    /// </summary>
    public class UsersHandler : IUsersHandler
    {
        private readonly UserManager<AppUser> userManager;
        private readonly DataContext context;

        /// <summary>Initializes a new instance of the <see cref="UsersHandler" /> class.</summary>
        /// <param name="userManager">The user manager.</param>
        /// <param name="context">The context.</param>
        public UsersHandler(UserManager<AppUser> userManager, DataContext context)
        {
            this.userManager = userManager;
            this.context = context;
        }

        /// <summary>
        /// Deletes the user and associated data asynchronous.
        /// </summary>
        /// <param name="username">The username.</param>
        public async Task<bool> DeleteUserAndAssociatedDataAsync(string username)
        {
            var user = await this.userManager.Users.SingleOrDefaultAsync(u => u.UserName == username);
            if (user == null)
                throw new ArgumentException("User not found.");
            if (user.IsModerator)
                throw new ArgumentException("Cannot delete moderator.");

            using (var transaction = await this.context.Database.BeginTransactionAsync())
            {
                try
                {
                    // Removing related entities first
                    var comments = await this.context.Comments.Where(c => c.AuthorId == user.Id).ToListAsync();
                    this.context.Comments.RemoveRange(comments);

                    var photos = await this.context.Photos.Where(p => p.AppUserId == user.Id).ToListAsync();
                    this.context.Photos.RemoveRange(photos);

                    var eventAttendees = await this.context.EventAttendees
                        .Where(ea => ea.AppUserId == user.Id && ea.IsHost).ToListAsync();
                    var eventIds = eventAttendees.Select(ea => ea.EventId).Distinct().ToList();

                    this.context.EventAttendees.RemoveRange(eventAttendees);

                    var events = await this.context.Events.Where(e => eventIds.Contains(e.Id)).ToListAsync();
                    this.context.Events.RemoveRange(events);

                    var userFollows = await this.context.UserFollowings
                        .Where(uf => uf.ObserverId == user.Id || uf.TargetId == user.Id).ToListAsync();
                    this.context.UserFollowings.RemoveRange(userFollows);

                    var refreshTokens = await this.context.RefreshToken.Where(rt => rt.AppUser.Id == user.Id).ToListAsync();
                    this.context.RefreshToken.RemoveRange(refreshTokens);

                    this.context.Users.Remove(user);

                    await this.context.SaveChangesAsync();
                    await transaction.CommitAsync();
                }
                catch
                {
                    throw new Exception("Something went wrong during the deletion process.");
                }
            }
            return true;
        }
    }
}

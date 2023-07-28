using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Infrastructure.Security
{
    /// <summary>
    /// Is host requirement class.
    /// </summary>
    public class IsHostRequirement : IAuthorizationRequirement
    {
    }

    /// <summary>
    /// Is host requirement handler.
    /// </summary>
    public class IsHostRequirementHandler : AuthorizationHandler<IsHostRequirement>
    {
        private readonly DataContext dbContext;
        private readonly IHttpContextAccessor accessor;

        /// <summary>
        /// Initializes a new instance of the <see cref="IsHostRequirementHandler" /> class.
        /// </summary>
        /// <param name="dbContext">The database context.</param>
        /// <param name="accessor">The accessor.</param>
        public IsHostRequirementHandler(DataContext dbContext, IHttpContextAccessor accessor)
        {
            this.dbContext = dbContext;
            this.accessor = accessor;
        }

        /// <summary>
        /// Makes a decision if authorization is allowed based on a specific requirement.
        /// </summary>
        /// <param name="context">The authorization context.</param>
        /// <param name="requirement">The requirement to evaluate.</param>
        /// <returns>
        /// Task.
        /// </returns>
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsHostRequirement requirement)
        {
            var userId = context.User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (userId == null) return Task.CompletedTask;

            var eventId = 
                Guid.Parse(this.accessor.HttpContext?.Request.RouteValues
                .SingleOrDefault(x => x.Key == "id").Value?
                .ToString());

            var attendee = this.dbContext.EventAttendees
                .AsNoTracking()
                .SingleOrDefaultAsync(x => x.AppUserId == userId && x.EventId == eventId).Result;

            if (attendee == null) return Task.CompletedTask;

            if (attendee.IsHost) context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}

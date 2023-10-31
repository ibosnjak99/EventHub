using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles.Commands
{
    /// <summary>
    /// Profiles handler class.
    /// </summary>
    public class ProfilesHandler : IRequestHandler<Edit, Result<Unit>>, IRequestHandler<Details, Result<Profile>>, IRequestHandler<EventsList, Result<List<UserEventDto>>>
    {
        private readonly DataContext context;
        private readonly IUserAccessor accessor;
        private readonly IMapper mapper;

        /// <summary>Initializes a new instance of the <see cref="ProfilesHandler" /> class.</summary>
        /// <param name="context">The context.</param>
        /// <param name="accessor">The accessor.</param>
        /// <param name="mapper">The mapper.</param>
        public ProfilesHandler(DataContext context, IUserAccessor accessor, IMapper mapper)
        {
            this.context = context;
            this.accessor = accessor;
            this.mapper = mapper;
        }

        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        public async Task<Result<Unit>> Handle(Edit request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == this.accessor.GetUsername());

            user!.DisplayName = request.DisplayName ?? user.DisplayName;
            user.Bio = request.Bio ?? user.Bio;

            var success = await context.SaveChangesAsync() > 0;

            if (success) return Result<Unit>.Success(Unit.Value);

            return Result<Unit>.Failure("Problem updating profile");
        }

        /// <summary>
        /// Handles a request.
        /// </summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>
        /// Response from the request.
        /// </returns>
        public async Task<Result<Profile>> Handle(Details request, CancellationToken cancellationToken)
        {
            var currentUser = await this.context.Users.FirstOrDefaultAsync(x => x.UserName == this.accessor.GetUsername());

            var requestedUser = await this.context.Users.FirstOrDefaultAsync(x => x.UserName == request.Username);

            if (requestedUser == null || (!currentUser!.IsModerator && requestedUser!.IsModerator))
            {
                return Result<Profile>.Failure("Requested user not found.");
            }

            var profile = await this.context.Users
                .Where(u => u.Id == requestedUser.Id)
                .ProjectTo<Profile>(this.mapper.ConfigurationProvider, new { currentUsername = this.accessor.GetUsername() })
                .SingleOrDefaultAsync();

            return Result<Profile>.Success(profile!);
        }


        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        /// <returns>
        /// Response from the request.
        /// </returns>
        public async Task<Result<List<UserEventDto>>> Handle(EventsList request, CancellationToken cancellationToken)
        {
            var query = this.context.EventAttendees
                .Where(u => u.AppUser.UserName == request.Username)
                .OrderBy(e => e.@event.Date)
                .ProjectTo<UserEventDto>(this.mapper.ConfigurationProvider)
                .AsQueryable();

            query = request.Predicate switch
            {
                "past" => query.Where(e => e.Date <= DateTime.Now),
                "hosting" => query.Where(e => e.HostUsername == request.Username),
                _ => query.Where(e => e.Date >= DateTime.Now),
            };

            var events = await query.ToListAsync();

            return Result<List<UserEventDto>>.Success(events);
        }
    }
}
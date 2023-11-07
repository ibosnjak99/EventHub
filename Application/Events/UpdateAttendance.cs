using Application.Core;
using Application.Interfaces;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Domain.Models;

namespace Application.Events
{
    /// <summary>
    /// Update attendance class.
    /// </summary>
    public class UpdateAttendance
    {
        /// <summary>
        /// Command class.
        /// </summary>
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        /// <summary>
        /// Handler class.
        /// <seealso cref="IRequestHandler{TRequest}"/>
        /// </summary>
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            /// <summary>
            /// Initializes a new instance of the <see cref="Handler" /> class.
            /// </summary>
            /// <param name="context">The context.</param>
            /// <param name="userAccessor">The user accessor.</param>
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            /// <summary>
            /// Handles a request.
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            /// <returns>Response from the request</returns>
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var @event = await this.context.Events
                    .Include(a => a.Attendees).ThenInclude(u => u.AppUser)
                    .SingleOrDefaultAsync(x => x.Id == request.Id);

                if (@event == null) return null;
                if (@event.Date < DateTime.UtcNow) return Result<Unit>.Failure("Cannot attend or cancel events in the past.");

                var user = await this.context.Users
                    .FirstOrDefaultAsync(x => x.UserName == this.userAccessor.GetUsername());

                if (user == null) return null;
                if (user.IsModerator) return Result<Unit>.Failure("Cannot attend or cancel as moderator.");

                var hostUsername = @event.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;

                var attendant = @event.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);

                if ((attendant != null && hostUsername == user.UserName) || user.IsModerator)
                    @event.IsCancelled = !@event.IsCancelled;

                if (attendant != null && hostUsername != user.UserName)
                    @event.Attendees.Remove(attendant);

                if (attendant == null)
                {
                    attendant = new EventAttendee
                    {
                        AppUser = user,
                        @event = @event,
                        IsHost = false
                    };

                    @event.Attendees.Add(attendant);
                }

                var result = await this.context.SaveChangesAsync() > 0;

                return result ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance.");
            }
        }
    }
}

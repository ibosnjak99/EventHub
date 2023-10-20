using Application.Core;
using Application.Interfaces;
using Domain.Models;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    /// <summary>
    /// The follow toggle class.
    /// </summary>
    public class FollowToggle
    {
        /// <summary>
        /// The command class.
        /// </summary>
        public class Command : IRequest<Result<Unit>>
        {
            /// <summary>
            /// Gets or sets the target username.
            /// </summary>
            /// <value>
            /// The target username.
            /// </value>
            public string TargetUsername { get; set; } = string.Empty;
        }

        /// <summary>
        /// The handler class.
        /// </summary>
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor accessor;

            /// <summary>Initializes a new instance of the <see cref="Handler" /> class.</summary>
            /// <param name="context">The context.</param>
            /// <param name="accessor">The accessor.</param>
            public Handler(DataContext context, IUserAccessor accessor)
            {
                this.context = context;
                this.accessor = accessor;
            }

            /// <summary>Handles a request</summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            /// <returns>Response from the request</returns>
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await this.context.Users.FirstOrDefaultAsync(x => x.UserName == this.accessor.GetUsername());
                var target = await this.context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return Result<Unit>.Failure("Target not found.");
                if (target.IsModerator) return Result<Unit>.Failure("Cannot follow moderator.");
                if (observer!.IsModerator) return Result<Unit>.Failure("Cannot follow as moderator.");

                var following = await this.context.UserFollowings.FindAsync(observer!.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing
                    {
                        Observer = observer,
                        Target = target
                    };

                    this.context.UserFollowings.Add(following);
                }
                else
                {
                    this.context.UserFollowings.Remove(following);
                }

                var success = await this.context.SaveChangesAsync(cancellationToken) > 0;

                if (success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update following.");
            }
        }
    }
}

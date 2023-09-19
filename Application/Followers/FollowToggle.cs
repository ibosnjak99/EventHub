using Application.Core;
using Application.Interfaces;
using Domain.Models;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUsername { get; set; } = string.Empty;
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor accessor;

            public Handler(DataContext context, IUserAccessor accessor)
            {
                this.context = context;
                this.accessor = accessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer = await this.context.Users.FirstOrDefaultAsync(x => x.UserName == this.accessor.GetUsername());
                var target = await this.context.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUsername);

                if (target == null) return null;

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

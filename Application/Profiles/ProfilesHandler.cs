using Application.Core;
using Application.Interfaces;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles.Commands
{
    /// <summary>
    /// Profiles handler class.
    /// </summary>
    public class ProfilesHandler : IRequestHandler<Edit, Result<Unit>>
    {
        private readonly DataContext context;
        private readonly IUserAccessor accessor;

        /// <summary>Initializes a new instance of the <see cref="ProfilesHandler" /> class.</summary>
        /// <param name="context">The context.</param>
        /// <param name="accessor">The accessor.</param>
        public ProfilesHandler(DataContext context, IUserAccessor accessor)
        {
            this.context = context;
            this.accessor = accessor;
        }

        /// <summary>
        /// Handles the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="cancellationToken">The cancellation token.</param>
        public async Task<Result<Unit>> Handle(Edit request, CancellationToken cancellationToken)
        {
            var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == accessor.GetUsername());

            user.DisplayName = request.DisplayName ?? user.DisplayName;
            user.Bio = request.Bio ?? user.Bio;

            var success = await context.SaveChangesAsync() > 0;

            if (success) return Result<Unit>.Success(Unit.Value);

            return Result<Unit>.Failure("Problem updating profile");
        }
    }
}

using Application.Core;
using Application.Interfaces;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
    /// <summary>
    /// Set profile image class.
    /// </summary>
    public class SetProfile
    {
        /// <summary>
        /// The command class.
        /// </summary>
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; } = string.Empty;
        }

        /// <summary>
        /// The request handler class.
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
            /// Handles a request
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            /// <returns>
            /// Response from the request
            /// </returns>
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await this.context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == this.userAccessor.GetUsername());
                if (user == null) return null;

                var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photo == null) return null;

                var currentProfile = user.Photos.FirstOrDefault(x => x.IsProfile);
                if (currentProfile != null) currentProfile.IsProfile = false;
                photo.IsProfile = true;

                var success = await this.context.SaveChangesAsync() > 0;
                if (success) return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Problem setting profile photo");

            }
        }
    }
}

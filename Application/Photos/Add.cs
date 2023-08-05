using Application.Core;
using Application.Interfaces;
using Domain.Models;
using Infrastructure;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Photos
{
    /// <summary>
    /// Add profile class.
    /// </summary>
    public class Add
    {
        /// <summary>
        /// the command class.
        /// </summary>
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile? File { get; set; }
        }

        /// <summary>
        /// The request handler class.
        /// </summary>
        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccessor userAccessor;

            /// <summary>
            /// Initializes a new instance of the <see cref="Handler" /> class.
            /// </summary>
            /// <param name="context">The context.</param>
            /// <param name="photoAccessor">The photo accessor.</param>
            /// <param name="userAccessor">The user accessor.</param>
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                this.context = context;
                this.photoAccessor = photoAccessor;
                this.userAccessor = userAccessor;
            }

            /// <summary>
            /// Handles a request.
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            /// <returns>
            /// Response from the request
            /// </returns>
            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(p => p.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == this.userAccessor.GetUsername());

                if (user == null) return null;

                var photoUploadResult = await this.photoAccessor.AddPhoto(request.File);

                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };

                if (!user.Photos.Any(x => x.IsProfile)) photo.IsProfile = true;

                user.Photos.Add(photo);

                var result = await this.context.SaveChangesAsync() > 0;

                if (result) return Result<Photo>.Success(photo);

                return Result<Photo>.Failure("Problem adding photo.");
            }
        }
    }
}

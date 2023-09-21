using Application.Core;
using Application.Interfaces;
using AutoMapper.QueryableExtensions;
using AutoMapper;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Application.Profiles.Commands
{
    /// <summary>
    /// Profiles handler class.
    /// </summary>
    public class ProfilesHandler : IRequestHandler<Edit, Result<Unit>>, IRequestHandler<Details, Result<Profile>>
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
            var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == accessor.GetUsername());

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
            var user = await this.context.Users
                .ProjectTo<Profile>(this.mapper.ConfigurationProvider, new {currentUsername = this.accessor.GetUsername()})
                .SingleOrDefaultAsync(x => x.UserName == request.Username);

            return Result<Profile>.Success(user!);
        }
    }
}
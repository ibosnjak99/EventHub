using Application.Core;
using Application.Followers.Queries;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Followers
{
    /// <summary>
    /// The followers handler class.
    /// </summary>
    public class FollowersHandler : IRequestHandler<List, Result<List<Profiles.Profile>>>
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        private readonly IUserAccessor accessor;

        /// <summary>Initializes a new instance of the <see cref="FollowersHandler" /> class.</summary>
        /// <param name="context">The context.</param>
        /// <param name="mapper">The mapper.</param>
        /// <param name="accessor">The accessor.</param>
        public FollowersHandler(DataContext context, IMapper mapper, IUserAccessor accessor)
        {
            this.context = context;
            this.mapper = mapper;
            this.accessor = accessor;
        }

        /// <summary>Handles a request</summary>
        /// <param name="request">The request</param>
        /// <param name="cancellationToken">Cancellation token</param>
        /// <returns>Response from the request</returns>
        public async Task<Result<List<Profiles.Profile>>> Handle(List request, CancellationToken cancellationToken)
        {
            var profiles = new List<Profiles.Profile>();

            switch (request.Predicate)
            {
                case "followers":
                    profiles = await this.context.UserFollowings.Where(x => x.Target.UserName == request.Username)
                        .Select(u => u.Observer)
                        .ProjectTo<Profiles.Profile>(this.mapper.ConfigurationProvider, new { currentUsername = this.accessor.GetUsername() })
                        .ToListAsync();
                    break;

                case "following":
                    profiles = await this.context.UserFollowings.Where(x => x.Observer.UserName == request.Username)
                        .Select(u => u.Target)
                        .ProjectTo<Profiles.Profile>(this.mapper.ConfigurationProvider, new { currentUsername = this.accessor.GetUsername() })
                        .ToListAsync();
                    break;
            }

            return Result<List<Profiles.Profile>>.Success(profiles);
        }
    }
}

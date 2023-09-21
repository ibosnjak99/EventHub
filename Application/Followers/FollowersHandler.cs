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
    public class FollowersHandler : IRequestHandler<List, Result<List<Profiles.Profile>>>
    {
        private readonly DataContext context;
        private readonly IMapper mapper;
        private readonly IUserAccessor accessor;

        public FollowersHandler(DataContext context, IMapper mapper, IUserAccessor accessor)
        {
            this.context = context;
            this.mapper = mapper;
            this.accessor = accessor;
        }

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

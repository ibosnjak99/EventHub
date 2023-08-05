using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Infrastructure;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Profiles
{
    /// <summary>
    ///  The profile details class.
    /// </summary>
    public class Details
    {
        /// <summary>
        ///  The query class.
        /// </summary>
        public class Query : IRequest<Result<Profile>>
        {
            public string Username { get; set; } = string.Empty;
        }

        /// <summary>
        ///  The request handler class.
        /// </summary>
        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            /// <summary>
            /// Initializes a new instance of the <see cref="Handler" /> class.
            /// </summary>
            /// <param name="context">The context.</param>
            /// <param name="mapper">The mapper.</param>
            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            /// <summary>
            /// Handles a request.
            /// </summary>
            /// <param name="request">The request</param>
            /// <param name="cancellationToken">Cancellation token</param>
            /// <returns>
            /// Response from the request.
            /// </returns>
            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await this.context.Users
                    .ProjectTo<Profile>(this.mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x => x.UserName == request.Username);

                return Result<Profile>.Success(user);
            }
        }
    }
}

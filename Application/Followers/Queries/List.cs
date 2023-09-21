using Application.Core;
using Application.Profiles;
using MediatR;

namespace Application.Followers.Queries
{
    public class List : IRequest<Result<List<Profile>>>
    {
        public string Predicate { get; set; } = string.Empty;

        public string Username { get; set; } = string.Empty;
    }
}

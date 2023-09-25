using Application.Core;
using MediatR;

namespace Application.Profiles.Commands
{
    public class EventsList : IRequest<Result<List<UserEventDto>>>
    {
        public string Username { get; set; } = string.Empty;

        public string Predicate { get; set; } = string.Empty;
    }
}

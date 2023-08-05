using Application.Core;
using MediatR;

namespace Application.Events.Queries
{
    /// <summary>
    /// Get all events class.
    /// </summary>
    /// <seealso cref="IRequest{TResponse}"/>
    public class GetAll : IRequest<Result<List<EventDto>>> { }
}

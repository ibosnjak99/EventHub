using Application.Core;
using Domain;
using MediatR;

namespace Application.Events.Queries
{
    /// <summary>
    /// Get all events class.
    /// </summary>
    /// <seealso cref="IRequest{TResponse}"/>
    public class GetAll : IRequest<Result<List<Event>>> { }
}

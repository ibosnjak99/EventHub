using Application.Core;
using Domain;
using MediatR;

namespace Application.Events.Queries
{
    /// <summary>
    /// Get event class.
    /// </summary>
    /// <seealso cref="IRequest{TResponse}"/>
    public class GetById : IRequest<Result<Event>>
    {
        public GetById(Guid id)
        {
            Id = id;
        }

        public Guid Id { get; set; }
    }
}

using Application.Core;
using MediatR;

namespace Application.Events.Queries
{
    /// <summary>
    /// Get all events class.
    /// </summary>
    /// <seealso cref="IRequest{TResponse}"/>
    public class GetAll : IRequest<Result<PagedList<EventDto>>>
    {
        /// <summary>
        /// Gets or sets the paging parameters.
        /// </summary>
        /// <value>
        /// The paging parameters.
        /// </value>
        public EventParams? PagingParams { get; set; }
    }
}

using Application.Core;
using MediatR;

namespace Application.Events.Commands
{
    /// <summary>
    /// Delete event class.
    /// </summary>
    /// <seealso cref="IRequest"/>
    public class Delete : IRequest<Result<Unit>>
    {
        public Delete(Guid id)
        {
            this.Id = id;
        }

        public Guid Id;
    }
}

using Application.Core;
using Domain;
using FluentValidation;
using MediatR;

namespace Application.Events.Commands
{
    /// <summary>
    /// Create event class.
    /// </summary>
    public class Create : IRequest<Result<Unit>>
    {
        public Create(Event @event)
        {
            Event = @event;
        }

        public Event Event { get; set; }
    }

    /// <summary>
    /// Create event validator class.
    /// </summary>
    public class CreateEventValidator : AbstractValidator<Create>
    {
        public CreateEventValidator()
        {
            RuleFor(e => e.Event).SetValidator(new EventValidator());
        }
    }
}

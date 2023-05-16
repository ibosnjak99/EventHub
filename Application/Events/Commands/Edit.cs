using Application.Core;
using Domain;
using FluentValidation;
using MediatR;

namespace Application.Events.Commands
{
    /// <summary>
    /// Edit event class.
    /// </summary>
    /// <seealso cref="IRequest"/>
    public class Edit : IRequest<Result<Unit>>
    {
        public Edit(Event @event)
        {
            this.Event = @event;
        }

        public Event Event { get; set; }
    }

    /// <summary>
    /// The edit event validator class.
    /// </summary>
    /// <seealso cref="AbstractValidator{EditEvent}"/>
    public class EditEventValidator : AbstractValidator<Edit>
    {
        public EditEventValidator()
        {
            RuleFor(e => e.Event).SetValidator(new EventValidator());
        }
    }
}

using Domain;
using FluentValidation;

namespace Application.Events
{
    /// <summary>
    /// The event validator class.
    /// </summary>
    public class EventValidator : AbstractValidator<Event>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="EventValidator" /> class.
        /// </summary>
        public EventValidator()
        {
            RuleFor(e => e.Title).NotEmpty();
            RuleFor(e => e.Description).NotEmpty();
            RuleFor(e => e.Date).NotEmpty();
            RuleFor(e => e.Category).NotEmpty();
            RuleFor(e => e.City).NotEmpty();
            RuleFor(e => e.Venue).NotEmpty();
        }
    }
}

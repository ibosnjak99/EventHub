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

            RuleFor(e => e.Date)
                .NotEmpty()
                .Must(IsDateInFuture)
                .WithMessage("Event date must not be in the past.");

            RuleFor(e => e.Category).NotEmpty();
            RuleFor(e => e.City).NotEmpty();
            RuleFor(e => e.Venue).NotEmpty();
        }

        /// <summary>
        /// Validates that the date is not in the past.
        /// </summary>
        /// <param name="date">The date to validate.</param>
        /// <returns>true if the date is today or in the future; otherwise, false.</returns>
        private bool IsDateInFuture(DateTime date)
        {
            return date >= DateTime.Today;
        }
    }
}

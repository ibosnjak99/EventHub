using Application.Core;
using FluentValidation;
using MediatR;

namespace Application.Comments.Commands
{
    /// <summary>
    /// The create class.
    /// </summary>
    public class Create : IRequest<Result<CommentDto>>
    {
        /// <summary>Gets or sets the body.</summary>
        /// <value>The body.</value>
        public string Body { get; set; } = string.Empty;

        /// <summary>Gets or sets the event identifier.</summary>
        /// <value>The event identifier.</value>
        public Guid EventId { get; set; }
    }

    /// <summary>
    /// The command validator.
    /// </summary>
    public class CommandValidator : AbstractValidator<Create>
    {
        /// <summary>Initializes a new instance of the <see cref="CommandValidator" /> class.</summary>
        public CommandValidator() 
        {
            RuleFor(x => x.Body).NotEmpty();
        }
    }
}

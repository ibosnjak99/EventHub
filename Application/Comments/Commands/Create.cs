using Application.Core;
using FluentValidation;
using MediatR;

namespace Application.Comments.Commands
{
    public class Create : IRequest<Result<CommentDto>>
    {
        public string Body { get; set; } = string.Empty;

        public Guid EventId { get; set; }
    }

    public class CommandValidator : AbstractValidator<Create>
    {
        public CommandValidator() 
        {
            RuleFor(x => x.Body).NotEmpty();
        }
    }
}

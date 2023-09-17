using Application.Core;
using FluentValidation;
using MediatR;

namespace Application.Profiles.Commands
{
    /// <summary>
    /// Edit profile class.
    /// </summary>
    /// <seealso cref="IRequest"/>
    public class Edit : IRequest<Result<Unit>>
    {
        public Edit(string displayName, string bio)
        {
            this.DisplayName = displayName;
            this.Bio = bio;
        }

        public string DisplayName { get; set; }
        public string Bio { get; set; }
    }

    public class EditProfileValidator : AbstractValidator<Edit>
    {
        public EditProfileValidator()
        {
            RuleFor(p => p.DisplayName).NotEmpty();
        }
    }
}

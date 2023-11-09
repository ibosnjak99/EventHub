using Application.Core;
using MediatR;

namespace Application.Profiles.Commands
{
    /// <summary>
    /// The events list.
    /// </summary>
    public class ProfileEventsList : IRequest<Result<List<UserEventDto>>>
    {
        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the predicate.
        /// </summary>
        /// <value>
        /// The predicate.
        /// </value>
        public string Predicate { get; set; } = string.Empty;
    }
}

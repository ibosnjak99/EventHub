using Application.Core;
using Application.Profiles;
using MediatR;

namespace Application.Followers.Queries
{
    /// <summary>
    /// The list class.
    /// </summary>
    public class List : IRequest<Result<List<Profile>>>
    {
        /// <summary>
        /// Gets or sets the predicate.
        /// </summary>
        /// <value>
        /// The predicate.
        /// </value>
        public string Predicate { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        public string Username { get; set; } = string.Empty;
    }
}

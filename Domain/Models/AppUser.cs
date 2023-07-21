using Microsoft.AspNetCore.Identity;

namespace Domain.Models
{
    /// <summary>
    /// App user class.
    /// </summary>
    /// <seealso cref="IdentityUser" />

    public class AppUser : IdentityUser
    {
        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; }

        /// <summary>
        /// Gets or sets the bio.
        /// </summary>
        /// <value>
        /// The bio.
        /// </value>
        public string Bio { get; set; }

        /// <summary>
        /// Gets or sets the events.
        /// </summary>
        /// <value>
        /// The events.
        /// </value>
        public ICollection<EventAttendee> Events { get; set; }
    }
}

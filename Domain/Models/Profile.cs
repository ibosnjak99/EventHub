using Domain.Models;

namespace Application.Profiles
{
    /// <summary>
    /// Profile class.
    /// </summary>
    public class Profile
    {
        /// <summary>
        /// Gets or sets the application user identifier.
        /// </summary>
        /// <value>
        /// The application user identifier.
        /// </value>
        public string AppUserId { get; set; }

        /// <summary>
        /// Gets or sets the name of the user.
        /// </summary>
        /// <value>
        /// The name of the user.
        /// </value>
        public string UserName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the display name.
        /// </summary>
        /// <value>
        /// The display name.
        /// </value>
        public string DisplayName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the bio.
        /// </summary>
        /// <value>
        /// The bio.
        /// </value>
        public string Bio { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the image.
        /// </summary>
        /// <value>
        /// The image.
        /// </value>
        public string Image { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the photos.
        /// </summary>
        /// <value>
        /// The photos.
        /// </value>
        public ICollection<Photo> Photos { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="Profile" /> is following.
        /// </summary>
        /// <value>
        /// True if following; otherwise, false.
        /// </value>
        public bool Following { get; set; }

        /// <summary>
        /// Gets or sets the followers count.
        /// </summary>
        /// <value>
        /// The followers count.
        /// </value>
        public int FollowersCount { get; set; }

        /// <summary>
        /// Gets or sets the following count.
        /// </summary>
        /// <value>
        /// The following count.
        /// </value>
        public int FollowingCount { get;set; }
    }
}

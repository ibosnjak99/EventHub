using Domain.Models;

namespace Application.Profiles
{
    /// <summary>
    /// Profile class.
    /// </summary>
    public class Profile
    {
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
        public ICollection<Photo>? Photos { get; set; }

        public bool Following { get; set; }

        public int FollowersCount { get; set; }

        public int FollowingCount { get;set; }
    }
}

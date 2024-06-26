﻿using Microsoft.AspNetCore.Identity;

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

        /// <summary>
        /// Gets or sets the photos.
        /// </summary>
        /// <value>
        /// The photos.
        /// </value>
        public ICollection<Photo> Photos { get; set; }

        /// <summary>
        /// Gets or sets the followings.
        /// </summary>
        /// <value>
        /// The followings.
        /// </value>
        public ICollection<UserFollowing> Followings { get; set; }

        /// <summary>
        /// Gets or sets the followers.
        /// </summary>
        /// <value>
        /// The followers.
        /// </value>
        public ICollection<UserFollowing> Followers { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public ICollection<Comment> Comments { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is moderator.
        /// </summary>
        /// <value>
        /// True if this instance is moderator; otherwise, false.
        /// </value>
        public bool IsModerator { get; set; }

        /// <summary>
        /// Gets or sets the refresh tokens.
        /// </summary>
        /// <value>
        /// The refresh tokens.
        /// </value>
        public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
    }
}

namespace Domain.Models
{
    /// <summary>
    /// The refresh token class.
    /// </summary>
    public class RefreshToken
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public int Id { get; set; }

        /// <summary>
        /// Gets or sets the app user.
        /// </summary>
        /// <value>
        /// The app user.
        /// </value>
        public AppUser AppUser { get; set; }

        /// <summary>
        /// Gets or sets the token.
        /// </summary>
        /// <value>
        /// The token.
        /// </value>
        public string Token { get; set; }

        /// <summary>
        /// Gets or sets the expires.
        /// </summary>
        /// <value>
        /// The expires.
        /// </value>
        public DateTime Expires { get; set; } = DateTime.UtcNow.AddDays(1);

        /// <summary>
        /// Gets a value indicating whether this instance is expired.
        /// </summary>
        /// <value>
        /// True if this instance is expired; otherwise, false.
        /// </value>
        public bool IsExpired => DateTime.UtcNow >= Expires;

        /// <summary>
        /// Gets or sets the revoked.
        /// </summary>
        /// <value>
        /// The revoked.
        /// </value>
        public DateTime? Revoked { get; set; }

        /// <summary>
        /// Gets a value indicating whether this instance is active.
        /// </summary>
        /// <value>
        /// True if this instance is active; otherwise, false.</value>
        public bool IsActive => Revoked == null && !IsExpired;
    }
}

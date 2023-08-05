namespace Domain.Models
{
    /// <summary>
    /// The photo class.
    /// </summary>
    public class Photo
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether this instance is profile.
        /// </summary>
        /// <value>
        /// True if this instance is profile; otherwise, false.
        /// </value>
        public bool IsProfile { get; set; }
    }
}

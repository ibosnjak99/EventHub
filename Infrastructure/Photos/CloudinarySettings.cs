namespace Infrastructure.Photos
{
    /// <summary>
    /// The cloudinary settings class.
    /// </summary>
    public class CloudinarySettings
    {
        /// <summary>
        /// Gets or sets the name of the cloud.
        /// </summary>
        /// <value>
        /// The name of the cloud.
        /// </value>
        public string CloudName { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the API key.
        /// </summary>
        /// <value>
        /// The API key.
        /// </value>
        public string ApiKey { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the API secret.
        /// </summary>
        /// <value>
        /// The API secret.
        /// </value>
        public string ApiSecret { get; set; } = string.Empty;
    }
}

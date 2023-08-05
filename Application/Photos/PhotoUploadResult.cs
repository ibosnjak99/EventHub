namespace Application.Photos
{
    /// <summary>
    /// Photo upload result class.
    /// </summary>
    public class PhotoUploadResult
    {
        /// <summary>
        /// Gets or sets the public identifier.
        /// </summary>
        /// <value>
        /// The public identifier.
        /// </value>
        public string PublicId { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the URL.
        /// </summary>
        /// <value>
        /// The URL.
        /// </value>
        public string Url { get; set; } = string.Empty;
    }
}

namespace Infrastructure.Payment
{
    /// <summary>
    /// The stripe settings class.
    /// </summary>
    public class StripeSettings
    {
        /// <summary>
        /// Gets or sets the publishable key.
        /// </summary>
        /// <value>
        /// The publishable key.
        /// </value>
        public string PublishableKey { get; set; }

        /// <summary>
        /// Gets or sets the secret key.
        /// </summary>
        /// <value>
        /// The secret key.
        /// </value>
        public string SecretKey { get; set; }
    }
}

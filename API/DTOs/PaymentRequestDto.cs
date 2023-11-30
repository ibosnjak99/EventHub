namespace API.DTOs
{
    /// <summary>
    /// The payment request dto.
    /// </summary>
    public class PaymentRequestDto
    {
        /// <summary>
        /// Gets or sets the amount.
        /// </summary>
        /// <value>
        /// The amount.
        /// </value>
        public int Amount { get; set; }

        /// <summary>
        /// Gets or sets the username.
        /// </summary>
        /// <value>
        /// The username.
        /// </value>
        public string Username { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public string EventId { get; set; } = string.Empty;
    }

}
namespace Application.Core
{
    /// <summary>
    /// App exception class.
    /// </summary>
    public class AppException
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="AppException" /> class.
        /// </summary>
        /// <param name="statusCode">The status code.</param>
        /// <param name="message">The message.</param>
        /// <param name="details">The details.</param>
        public AppException(int statusCode, string message, string details)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
    }
}

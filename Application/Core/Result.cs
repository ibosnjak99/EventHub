namespace Application.Core
{
    /// <summary>
    /// The result class.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    public class Result<T>
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is success.
        /// </summary>
        /// <value>
        /// True if this instance is success; otherwise, false.
        /// </value>
        public bool IsSuccess { get; set; }

        /// <summary>
        /// Gets or sets the value.
        /// </summary>
        /// <value>
        /// The value.
        /// </value>
        public T? Value { get; set; }

        /// <summary>
        /// Gets or sets the error.
        /// </summary>
        /// <value>
        /// The error.
        /// </value>
        public string Error { get; set; } = string.Empty;

        /// <summary>
        /// Successes the specified value.
        /// </summary>
        /// <param name="value">
        /// The value.
        /// </param>
        public static Result<T> Success(T value) => new Result<T> { IsSuccess = true, Value = value };

        /// <summary>
        /// Failures the specified error.
        /// </summary>
        /// <param name="error">
        /// The error.
        /// </param>
        public static Result<T> Failure(string error) => new Result<T> { IsSuccess = false, Error = error };
    }
}

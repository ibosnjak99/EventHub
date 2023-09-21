namespace Domain.Models
{
    /// <summary>
    /// The user following class.
    /// </summary>
    public class UserFollowing
    {
        /// <summary>
        /// Gets or sets the observer identifier.
        /// </summary>
        /// <value>
        /// The observer identifier.
        /// </value>
        public string ObserverId { get; set; }

        /// <summary>
        /// Gets or sets the observer.
        /// </summary>
        /// <value>
        /// The observer.
        /// </value>
        public AppUser Observer { get; set; }

        /// <summary>
        /// Gets or sets the target identifier.
        /// </summary>
        /// <value>
        /// The target identifier.
        /// </value>
        public string TargetId { get; set; }

        /// <summary>
        /// Gets or sets the target.
        /// </summary>
        /// <value>
        /// The target.
        /// </value>
        public AppUser Target { get; set; }  
    }
}

namespace Domain.Models
{
    /// <summary>
    /// Event attendee class.
    /// </summary>
    public class EventAttendee
    {
        /// <summary>
        /// Gets or sets the application user identifier.
        /// </summary>
        /// <value>
        /// The application user identifier.
        /// </value>
        public string AppUserId { get; set; }

        /// <summary>
        /// Gets or sets the application user.
        /// </summary>
        /// <value>
        /// The application user.
        /// </value>
        public AppUser AppUser { get; set; }

        /// <summary>
        /// Gets or sets the event identifier.
        /// </summary>
        /// <value>
        /// The event identifier.
        /// </value>
        public Guid EventId { get; set; }

        /// <summary>
        /// Gets or sets the event.
        /// </summary>
        /// <value>
        /// The event.
        /// </value>
        public Event @event { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is host.
        /// </summary>
        /// <value>
        /// True if this instance is host; otherwise, false
        /// </value>
        public bool IsHost { get; set; }
    }
}

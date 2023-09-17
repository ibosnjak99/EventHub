using Domain.Models;

namespace Domain
{
    /// <summary>
    /// The event class.
    /// </summary>
    public class Event
    {
        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public Guid Id { get; set; }

        /// <summary>
        /// Gets or sets the title.
        /// </summary>
        /// <value>
        /// The title.
        /// </value>
        public string Title { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public DateTime Date { get; set; }

        /// <summary>
        /// Gets or sets the description.
        /// </summary>
        /// <value>
        /// The description.
        /// </value>
        public string Description { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public string Category { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the city.
        /// </summary>
        /// <value>
        /// The city.
        /// </value>
        public string City { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the venue.
        /// </summary>
        /// <value>
        /// The venue.
        /// </value>
        public string Venue { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets a value indicating whether this instance is cancelled.
        /// </summary>
        /// <value>
        /// True if this instance is cancelled; otherwise, false.
        /// </value>
        public bool IsCancelled { get; set; }

        /// <summary>
        /// Gets or sets the attendees.
        /// </summary>
        /// <value>
        /// The attendees.
        /// </value>
        public ICollection<EventAttendee> Attendees { get; set; } = new List<EventAttendee>();

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
    }
}

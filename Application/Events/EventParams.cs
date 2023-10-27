using Application.Core;

namespace Application.Events
{
    /// <summary>
    /// The event params.
    /// </summary>
    public class EventParams : PagingParams
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is going.
        /// </summary>
        /// <value>
        /// True if this instance is going; otherwise, false.
        /// </value>
        public bool IsGoing { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is host.
        /// </summary>
        /// <value>
        /// True if this instance is host; otherwise, false.
        /// </value>
        public bool IsHost { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is following.
        /// </summary>
        /// <value>
        /// True if this instance is following; otherwise, false.
        /// </value>
        public bool IsFollowing { get; set; }

        /// <summary>
        /// Gets or sets the start date.
        /// </summary>
        /// <value>
        /// The start date.
        /// </value>
        public DateTime StartDate { get; set; } = DateTime.UtcNow;

        /// <summary>
        /// Gets or sets the search term.
        /// </summary>
        /// <value>
        /// The search term.
        /// </value>
        public string SearchTerm { get; set; } = string.Empty;
    }
}

using System.Text.Json.Serialization;

namespace Application.Profiles
{
    /// <summary>
    /// The user event dto class.
    /// </summary>
    public class UserEventDto
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
        /// Gets or sets the category.
        /// </summary>
        /// <value>
        /// The category.
        /// </value>
        public string Category { get; set; } = string.Empty;

        /// <summary>
        /// Gets or sets the date.
        /// </summary>
        /// <value>
        /// The date.
        /// </value>
        public DateTime Date {  get; set; }

        /// <summary>
        /// Gets or sets the host username.
        /// </summary>
        /// <value>
        /// The host username.
        /// </value>
        [JsonIgnore]
        public string HostUsername { get; set; } = string.Empty;
    }
}

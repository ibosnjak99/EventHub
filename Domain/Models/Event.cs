using Domain.Models.Interfaces;

namespace Domain
{
    /// <summary>
    /// The event class.
    /// </summary>
    /// <seealso cref="IEvent" />
    public class Event : IEvent
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;  
        public string Venue { get; set; } = string.Empty; 
    }
}

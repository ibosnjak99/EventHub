namespace Domain.Models.Interfaces
{
    /// <summary>
    /// The event interface.
    /// </summary>
    public interface IEvent
    {
        Guid Id { get; set; }
        string Title { get; set; }
        DateTime Date { get; set; }
        string Description { get; set; }
        string Category { get; set; }
        string City { get; set; }
        string Venue { get; set; }
    }
}

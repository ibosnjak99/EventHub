using Domain;
using Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    /// <summary>
    /// The data context class.
    /// </summary>
    /// <seealso cref="DbContext" />
    public class DataContext : IdentityDbContext<AppUser>
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="DataContext" /> class.
        /// </summary>
        /// <param name="options">The options for this context.</param>
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        /// <summary>
        /// Gets or sets the events.
        /// </summary>
        /// <value>
        /// The events.
        /// </value>
        public DbSet<Event> Events { get; set; }

        /// <summary>
        /// Gets or sets the event attendees.
        /// </summary>
        /// <value>
        /// The event attendees.
        /// </value>
        public DbSet<EventAttendee> EventAttendees { get; set; }

        /// <summary>
        /// Configures the schema needed for the identity framework.
        /// </summary>
        /// <param name="builder">
        /// The builder being used to construct the model for this context.
        /// </param>
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<EventAttendee>(x => x.HasKey(aa => new { aa.AppUserId, aa.EventId }));

            builder.Entity<EventAttendee>()
                .HasOne(u => u.AppUser)
                .WithMany(u => u.Events)
                .HasForeignKey(u => u.AppUserId);

            builder.Entity<EventAttendee>()
                .HasOne(u => u.@event)
                .WithMany(u => u.Attendees)
                .HasForeignKey(u => u.EventId);
        }
    }
}

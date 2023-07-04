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
        /// <value>The events.</value>
        public DbSet<Event> Events { get; set; }
    }
}

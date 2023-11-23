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
        /// Gets or sets the photos.
        /// </summary>
        /// <value>
        /// The photos.
        /// </value>
        public DbSet<Photo> Photos { get; set; }

        /// <summary>
        /// Gets or sets the comments.
        /// </summary>
        /// <value>
        /// The comments.
        /// </value>
        public DbSet<Comment> Comments { get; set; }

        /// <summary>
        /// Gets or sets the user followings.
        /// </summary>
        /// <value>
        /// The user followings.
        /// </value>
        public DbSet<UserFollowing> UserFollowings { get; set; }

        /// <summary>
        /// Gets or sets the refresh tokens.
        /// </summary>
        /// <value>
        /// The refresh tokens.
        /// </value>
        public DbSet<RefreshToken> RefreshToken { get; set; }

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

            builder.Entity<Comment>()
                .HasOne(c => c.Event)
                .WithMany(e => e.Comments)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Photo>()
                .HasOne<AppUser>()
                .WithMany(u => u.Photos)
                .HasForeignKey(p => p.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Comment>()
                .HasOne(c => c.Author)
                .WithMany(u => u.Comments)
                .HasForeignKey(c => c.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<EventAttendee>()
                .HasOne(ea => ea.AppUser)
                .WithMany(u => u.Events)
                .HasForeignKey(ea => ea.AppUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>()
                .HasOne(uf => uf.Observer)
                .WithMany(u => u.Followings)
                .HasForeignKey(uf => uf.ObserverId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>()
                .HasOne(uf => uf.Target)
                .WithMany(u => u.Followers)
                .HasForeignKey(uf => uf.TargetId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<UserFollowing>(b =>
            {
                b.HasKey(k => new { k.ObserverId, k.TargetId });

                b.HasOne(o => o.Observer)
                    .WithMany(f => f.Followings)
                    .HasForeignKey(o => o.ObserverId)
                    .OnDelete(DeleteBehavior.Cascade);

                b.HasOne(t => t.Target)
                    .WithMany(f => f.Followers)
                    .HasForeignKey(t => t.TargetId)
                    .OnDelete(DeleteBehavior.NoAction);
            });
        }
    }
}

using Domain;
using Domain.Models;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure
{
    /// <summary>
    /// The seed class
    /// </summary>
    public class Seed
    {
        /// <summary>
        /// Seeds the data.
        /// </summary>
        /// <param name="context">The context.</param>
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var users = new List<AppUser>
                {
                    new AppUser
                    {
                        DisplayName = "Bob",
                        UserName = "bob",
                        Email = "bob@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Jane",
                        UserName = "jane",
                        Email = "jane@test.com"
                    },
                    new AppUser
                    {
                        DisplayName = "Tom",
                        UserName = "tom",
                        Email = "tom@test.com"
                    },
                };

                foreach (var user in users)
                {
                    await userManager.CreateAsync(user, "Pa$$w0rd");
                }
            }

            if (context.Events.Any()) return;

            var events = new List<Event>
            {
                new Event
                {
                    Title = "Past Event 1",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Old event",
                    Category = "drinks",
                    City = "London",
                    Venue = "Pub"
                },
                new Event
                {
                    Title = "Past Event 2",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    Description = "Old event",
                    Category = "food",
                    City = "Paris",
                    Venue = "Cafe"
                },
                new Event
                {
                    Title = "Past Event 3",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Old event",
                    Category = "drinks",
                    City = "Berlin",
                    Venue = "Pub"
                },
                new Event
                {
                    Title = "Past Event 4",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    Description = "Old event",
                    Category = "drinks",
                    City = "Stockholm",
                    Venue = "Pub"
                },
                new Event
                {
                    Title = "Past Event 5",
                    Date = DateTime.UtcNow.AddMonths(-2),
                    Description = "Old event",
                    Category = "drinks",
                    City = "Amsterdam",
                    Venue = "Pub"
                },
                new Event
                {
                    Title = "Past Event 6",
                    Date = DateTime.UtcNow.AddMonths(-1),
                    Description = "Old event",
                    Category = "drinks",
                    City = "Madrid",
                    Venue = "Pub"
                },
            };
            await context.Events.AddRangeAsync(events);
            await context.SaveChangesAsync();
        }
    }
}

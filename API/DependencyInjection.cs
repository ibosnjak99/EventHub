using Domain.Models.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace Domain
{
    /// <summary>
    /// The dependency injection class.
    /// </summary>
    public static class DependencyInjection
    {
        /// <summary>
        /// Registers the dependencies.
        /// </summary>
        /// <param name="services">The services.</param>
        public static IServiceCollection RegisterDependencies(this IServiceCollection services)
        {
            services.AddTransient<IEvent, Event>();

            return services;
        }
    }
}

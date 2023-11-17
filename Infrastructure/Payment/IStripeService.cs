using Stripe.Checkout;

namespace Infrastructure.Payments
{
    /// <summary>
    /// The stripe service interface.
    /// </summary>
    public interface IStripeService
    {
        /// <summary>Creates the checkout session asynchronous.</summary>
        /// <param name="amount">The amount.</param>
        /// <param name="username">The username.</param>
        /// <param name="eventId">The event identifier.</param>
        Task<Session> CreateCheckoutSessionAsync(int amount, string username, string eventId);
    }
}

using MediatR;
using Microsoft.Extensions.Logging;
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

        /// <summary>Handles the webhook asynchronous.</summary>
        /// <param name="json">The json.</param>
        /// <param name="stripeSignature">The stripe signature.</param>
        /// <param name="mediator">The mediator.</param>
        /// <param name="logger">The logger.</param>
        Task<bool> HandleWebhookAsync(string json, string stripeSignature, IMediator mediator, ILogger<StripeService> logger);
    }
}

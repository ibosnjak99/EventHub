using Infrastructure.Payment;
using Microsoft.Extensions.Options;
using Stripe;
using Stripe.Checkout;

namespace Infrastructure.Payments
{
    /// <summary>
    /// The stripe service class.
    /// </summary>
    public class StripeService : IStripeService
    {
        private readonly StripeSettings stripeSettings;

        /// <summary>Initializes a new instance of the <see cref="StripeService" /> class.</summary>
        /// <param name="options">The options.</param>
        public StripeService(IOptions<StripeSettings> options)
        {
            this.stripeSettings = options.Value;
            StripeConfiguration.ApiKey = stripeSettings.SecretKey;
        }

        /// <summary>Creates the checkout session asynchronous.</summary>
        /// <param name="amount">The amount.</param>
        public async Task<Session> CreateCheckoutSessionAsync(int amount)
        {
            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string> { "card" },
                LineItems = new List<SessionLineItemOptions>
            {
                new SessionLineItemOptions
                {
                    PriceData = new SessionLineItemPriceDataOptions
                    {
                        UnitAmount = (long)amount*100, 
                        Currency = "eur",
                        ProductData = new SessionLineItemPriceDataProductDataOptions
                        {
                            Name = "Event Ticket",
                        },
                    },
                    Quantity = 1,
                },
            },
                Mode = "payment",
                SuccessUrl = "http://localhost:3000/events",
                CancelUrl = "http://localhost:3000/events"
            };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return session;
        }
    }
}

using Application.Events;
using Infrastructure.Payment;
using MediatR;
using Microsoft.Extensions.Logging;
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
        /// <param name="username">The username.</param>
        /// <param name="eventId">The event id.</param>
        public async Task<Session> CreateCheckoutSessionAsync(int amount, string username, string eventId)
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
                            UnitAmount = (long)amount * 100,
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
                CancelUrl = "http://localhost:3000/events",
                Metadata = new Dictionary<string, string>
                    {
                        { "username", username },
                        { "eventId", eventId }
                    }
                };

            var service = new SessionService();
            Session session = await service.CreateAsync(options);

            return session;
        }

        /// <summary>Handles the webhook asynchronous.</summary>
        /// <param name="json">The json.</param>
        /// <param name="stripeSignature">The stripe signature.</param>
        /// <param name="mediator">The mediator.</param>
        /// <param name="logger">The logger.</param>
        public async Task<bool> HandleWebhookAsync(string json, string stripeSignature, IMediator mediator, ILogger<StripeService> logger)
        {
            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    stripeSignature,
                    this.stripeSettings.WebhookSecret
                );

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;
                    if (session == null)
                    {
                        logger.LogError("Session data is null in Stripe webhook event");
                        return false;
                    }

                    var eventId = session.Metadata["eventId"];
                    var username = session.Metadata["username"];

                    if (Guid.TryParse(eventId, out Guid eventGuid))
                    {
                        var command = new UpdateAttendance.Command { Id = eventGuid, Username = username };
                        var result = await mediator.Send(command);

                        if (result.IsSuccess)
                        {
                            logger.LogInformation("Attendance updated for event {EventId}", eventId);
                        }
                        else
                        {
                            logger.LogError("Error updating attendance: {Error}", result.Error);
                        }
                    }
                    else
                    {
                        logger.LogError("Invalid event ID: {EventId}", eventId);
                        return false;
                    }

                    logger.LogInformation("Checkout session completed: {SessionId}", session.Id);
                }

                return true;
            }
            catch (Exception e)
            {
                logger.LogError("Error occurred processing Stripe webhook: {Message}", e.Message);
                return false;
            }
        }
    }
}

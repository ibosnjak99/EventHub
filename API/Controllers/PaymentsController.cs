using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Stripe;
using API.DTOs;
using Infrastructure.Payments;
using Infrastructure.Payment;
using Stripe.Checkout;
using Microsoft.AspNetCore.Authorization;
using Application.Events;
using MediatR;

namespace API.Controllers
{
    /// <summary>
    /// The payments controller class.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IStripeService stripeService;
        private readonly StripeSettings stripeSettings;
        private readonly ILogger<PaymentsController> logger;

        /// <summary>Initializes a new instance of the <see cref="PaymentsController" /> class.</summary>
        /// <param name="stripeService">The stripe service.</param>
        /// <param name="stripeSettings">The stripe settings.</param>
        /// <param name="logger">The logger.</param>
        public PaymentsController(
            IStripeService stripeService,
            IOptions<StripeSettings> stripeSettings,
            ILogger<PaymentsController> logger)
        {
            this.stripeService = stripeService;
            this.stripeSettings = stripeSettings.Value;
            this.logger = logger;
        }

        /// <summary>Creates the checkout session.</summary>
        /// <param name="amount">The amount.</param>
        /// <param name="username">The username.</param>
        /// <param name="eventId">The event id.</param>
        [HttpPost("create-checkout-session")]
        public async Task<ActionResult> CreateCheckoutSession([FromBody] PaymentRequestDto dto)
        {
            var session = await this.stripeService.CreateCheckoutSessionAsync(dto.Amount, dto.Username, dto.EventId);
            return Ok(new { sessionId = session.Id });
        }

        /// <summary>Handles the stripe webhook.</summary>
        [HttpPost("webhook")]
        [AllowAnonymous]
        public async Task<IActionResult> HandleStripeWebhook([FromServices] IMediator mediator)
        {
            var json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            try
            {
                var stripeEvent = EventUtility.ConstructEvent(
                    json,
                    Request.Headers["Stripe-Signature"],
                    this.stripeSettings.WebhookSecret
                );

                if (stripeEvent.Type == Events.CheckoutSessionCompleted)
                {
                    var session = stripeEvent.Data.Object as Session;
                    var eventId = session!.Metadata["eventId"];
                    var username = session!.Metadata["username"];

                    if (Guid.TryParse(eventId, out Guid eventGuid))
                    {
                        var command = new UpdateAttendance.Command { Id = eventGuid, Username = username };
                        var result = await mediator.Send(command);

                        if (result.IsSuccess)
                        {
                            this.logger.LogInformation("Attendance updated for event {EventId}", eventId);
                        }
                        else
                        {
                            this.logger.LogError("Error updating attendance: {Error}", result.Error);
                        }
                    }
                    else
                    {
                        this.logger.LogError("Invalid event ID: {EventId}", eventId);
                    }

                    this.logger.LogInformation("Checkout session completed: {SessionId}", session.Id);
                }

                return Ok();
            }
            catch (Exception e)
            {
                this.logger.LogError("Error occurred processing Stripe webhook: {Message}", e.Message);
                return BadRequest();
            }
        }

    }
}

using API.DTOs;
using Infrastructure.Payment;
using Infrastructure.Payments;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

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
        private readonly ILogger<StripeService> stripeLogger;

        /// <summary>Initializes a new instance of the <see cref="PaymentsController" /> class.</summary>
        /// <param name="stripeService">The stripe service.</param>
        /// <param name="stripeSettings">The stripe settings.</param>
        /// <param name="logger">The logger.</param>
        public PaymentsController(
            IStripeService stripeService,
            IOptions<StripeSettings> stripeSettings,
            ILogger<PaymentsController> logger,
            ILogger<StripeService> stripeLogger)
        {
            this.stripeService = stripeService;
            this.stripeSettings = stripeSettings.Value;
            this.logger = logger;
            this.stripeLogger = stripeLogger;
        }

        /// <summary>Creates the checkout session.</summary>
        /// <param name="dto"></param>
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
            var stripeSignature = Request.Headers["Stripe-Signature"];

            var success = await this.stripeService.HandleWebhookAsync(json, stripeSignature, mediator, this.stripeLogger);
            if (success)
            {
                return Ok();
            }
            else
            {
                return BadRequest();
            }
        }
    }
}

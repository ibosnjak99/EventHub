using API.DTOs;
using Infrastructure.Payments;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    /// <summary>
    /// The payments controller class.
    /// </summary>
    public class PaymentsController : BaseApiController
    {
        private readonly IStripeService stripeService;

        /// <summary>Initializes a new instance of the <see cref="PaymentsController" /> class.</summary>
        /// <param name="stripeService">The stripe service.</param>
        public PaymentsController(IStripeService stripeService)
        {
            this.stripeService = stripeService;
        }

        /// <summary>Creates the checkout session.</summary>
        /// <param name="dto">The dto.</param>
        [HttpPost("create-checkout-session")]
        public async Task<ActionResult> CreateCheckoutSession([FromBody] PaymentRequestDto dto)
        {
            var session = await this.stripeService.CreateCheckoutSessionAsync(dto.Amount);
            return Ok(new { sessionId = session.Id });
        }
    }
}

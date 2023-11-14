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

        public PaymentsController(IStripeService stripeService)
        {
            this.stripeService = stripeService;
        }

        [HttpPost("create-checkout-session")]
        public async Task<ActionResult> CreateCheckoutSession([FromBody] PaymentRequestDto dto)
        {
            var session = await this.stripeService.CreateCheckoutSessionAsync(dto.Amount);
            return Ok(new { sessionId = session.Id });
        }
    }

    public class PaymentRequestDto
    {
        public int Amount { get; set; }
    }
}

using Stripe.Checkout;

namespace Infrastructure.Payments
{
    public interface IStripeService
    {
        Task<Session> CreateCheckoutSessionAsync(int amount);
    }
}

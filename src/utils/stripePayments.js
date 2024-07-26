const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripePaymentHandler {
  async createPaymentIntent(amount, currency = 'usd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Stripe expects amount in cents
        currency: currency,
      });
      return paymentIntent.client_secret;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent.status === 'succeeded';
    } catch (error) {
      console.error('Error confirming payment:', error);
      throw error;
    }
  }

  async createRefund(paymentIntentId, amount) {
    try {
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount * 100, // Stripe expects amount in cents
      });
      return refund.status === 'succeeded';
    } catch (error) {
      console.error('Error creating refund:', error);
      throw error;
    }
  }
}

module.exports = new StripePaymentHandler();
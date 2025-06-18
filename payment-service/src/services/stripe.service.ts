import Stripe from 'stripe';

export class StripeService {
  private stripe: Stripe;

  constructor() {
    const apiKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key';
    this.stripe = new Stripe(apiKey, { apiVersion: '2023-08-16' } as any);
  }

  async createPayout(amount: number, currency: string, destination: string, metadata?: Record<string, string>) {
    // In a real implementation, handle errors and account verification.
    return this.stripe.payouts.create({
      amount,
      currency,
      destination,
      metadata,
    });
  }
}


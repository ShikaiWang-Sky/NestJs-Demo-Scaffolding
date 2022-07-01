import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StripeCheckUrlDto } from './dtos/stripe-check-url.dto';

@Injectable()
export class StripeService {
  constructor(private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  stripe = require('stripe')(this.configService.get('STRIPE_SECRET_KEY'));

  async createStripeSession(priceId: string) {
    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          // For metered billing, do not pass quantity
          quantity: 1,
        },
      ],
      // {CHECKOUT_SESSION_ID} is a string literal; do not change it!
      // the actual Session ID is returned in the query parameter when your customer
      // is redirected to the success page.
      // success_url:
      //   'http://localhost:8080/order/success?session_id={CHECKOUT_SESSION_ID}',
      success_url: 'http://localhost:3000/?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://example.com/canceled.html',
    });
    const checkout: StripeCheckUrlDto = new StripeCheckUrlDto();
    checkout.url = session.url;
    return checkout;
    // Redirect to the URL returned on the Checkout Session.
    // With express, you can redirect with:
    //   res.redirect(303, session.url);
  }

  async stripeWebhook(request: Request) {
    const signature = request.headers['stripe-signature'];
    let event;
    try {
      event = this.stripe.webhooks.constructEvent(
        request.body,
        signature,
        this.configService.get('STRIPE_WEBHOOK_SECRET_KEY'),
      );
    } catch (err) {
      throw new BadRequestException('Webhook Error: ' + err.message);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent ${paymentIntent.id} succeeded.`);
        break;
      default:
        console.log(`Unhandled Webhook event received: ${event.type}`);
    }

    return { status: 'success' };
  }

  async orderSuccess(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    const customer = await this.stripe.customers.retrieve(session.customer);
    return { customer };
  }

  async createCustomerPortal(customerId: string) {
    const portalSession = await this.stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: 'http://localhost:3000/',
    });
    return portalSession;
  }
}

import { Injectable } from '@nestjs/common';
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
      success_url: 'https://google.com',
      cancel_url: 'https://example.com/canceled.html',
    });
    const checkout: StripeCheckUrlDto = new StripeCheckUrlDto();
    checkout.url = session.url;
    return checkout;
    // Redirect to the URL returned on the Checkout Session.
    // With express, you can redirect with:
    //   res.redirect(303, session.url);
  }
}

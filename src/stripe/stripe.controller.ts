import { Body, Controller, Post } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { StripeCheckoutDto } from './dtos/stripe-checkout.dto';
import { StripeCheckUrlDto } from './dtos/stripe-check-url.dto';

@Controller('stripe')
@ApiTags('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Return check result url' })
  @ApiResponse({ status: 200, type: StripeCheckUrlDto })
  @Public()
  /**
   * Return check result url
   * @param stripeCheckout Dto for stripe checkout
   */
  checkout(@Body() stripeCheckout: StripeCheckoutDto) {
    return this.stripeService.createStripeSession(stripeCheckout.priceId);
  }
}

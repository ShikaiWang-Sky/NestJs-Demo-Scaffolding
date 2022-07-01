import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
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

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Stripe webhook' })
  webhook(@Request() request: Request) {
    return this.stripeService.stripeWebhook(request);
  }

  @Get('order/success')
  @Public()
  @ApiOperation({ summary: 'Stripe order success' })
  orderSuccess(@Query('session_id') sessionId: string) {
    return this.stripeService.orderSuccess(sessionId);
  }

  @Post('customer-portal')
  @Public()
  @ApiOperation({ summary: 'Create Stripe customer portal by customer id' })
  createCustomerPortal(@Body() customer: any) {
    console.log(customer);
    return this.stripeService.createCustomerPortal(customer.id);
  }
}

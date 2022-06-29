import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StripeCheckoutDto {
  @IsString()
  @ApiProperty()
  priceId: string;
}

import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StripeCheckUrlDto {
  @IsString()
  @ApiProperty()
  url: string;
}

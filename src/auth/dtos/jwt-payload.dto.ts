import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class JwtPayloadDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  userId: string;

  @IsBoolean()
  @ApiProperty()
  admin: boolean;
}

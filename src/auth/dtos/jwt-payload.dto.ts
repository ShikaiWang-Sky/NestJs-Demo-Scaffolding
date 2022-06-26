import { IsBoolean, IsEmail, IsString } from 'class-validator';

export class JwtPayloadDto {
  @IsEmail()
  email: string;

  @IsString()
  userId: string;

  @IsBoolean()
  admin: boolean;
}

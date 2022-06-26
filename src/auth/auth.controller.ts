import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from '../decorators/public.decorator';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { User } from '../users/entities/user.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtPayloadDto } from './dtos/jwt-payload.dto';
import { JwtModule } from '@nestjs/jwt';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Serialize(UserDto)
  @UseGuards(LocalAuthGuard)
  @Post('localStrategy/login')
  @ApiOperation({ summary: 'User login with LocalStrategy' })
  @ApiResponse({ status: 200, type: UserDto })
  @Public()
  async LocalStrategyLogin(@Body() body: LoginAuthDto) {
    return this.usersService.findUserByEmail(body.email);
  }

  @Post('localStrategy/signup')
  @ApiOperation({ summary: 'User registration with LocalStrategy' })
  @ApiResponse({ status: 200, type: UserDto })
  @Public()
  async createUser(@Body() body: CreateUserDto) {
    const user = await this.authService.create(body.email, body.password);
    return user;
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login and return Jwt' })
  @Public()
  async login(@Body() body: LoginAuthDto) {
    const user = await this.usersService.findUserByEmail(body.email);
    return this.authService.login(user);
  }

  @Get('profile')
  getProfile(@Request() req) {
    const profile: JwtPayloadDto = req.user;
    return profile.email;
  }
}

import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from '../decorators/public.decorator';
import { LoginAuthDto } from './dtos/login-auth.dto';
import { UserDto } from '../users/dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Serialize(UserDto)
  @UseGuards(AuthGuard('local'))
  @Post('localStrategy/login')
  @ApiOperation({ summary: 'User login with LocalStrategy' })
  @ApiResponse({ status: 200, type: UserDto })
  @Public()
  async login(@Body() body: LoginAuthDto) {
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
}

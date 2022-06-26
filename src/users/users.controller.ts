import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { Public } from '../decorators/public.decorator';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
@ApiTags('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiOperation({ summary: 'UserEntity registration' })
  @ApiResponse({ status: 200, type: UserDto })
  @Public()
  @Post('signup')
  async signup(@Body() body: CreateUserDto) {
    const user = await this.usersService.create(body.email, body.password);
    return user;
  }
}

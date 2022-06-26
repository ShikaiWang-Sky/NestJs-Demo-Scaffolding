import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDto } from './dtos/user.dto';
import { Serialize } from '../interceptors/serialize.interceptor';

@Controller('users')
@ApiTags('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}
}

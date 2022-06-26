import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { passwordDecoder } from '../utils/password/password-decoder';
import { passwordEncoder } from '../utils/password/password-encoder';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findUserByEmail(email);
    if (user) {
      if (await passwordDecoder(password, user.password)) {
        return user;
      }
    }
    return null;
  }

  async create(email: string, password: string) {
    const existedUser = await this.usersService.findUserByEmail(email);
    if (existedUser) {
      throw new BadRequestException('User already exists');
    }
    const encodedPassword = await passwordEncoder(password);
    const user = this.usersService.create(email, encodedPassword);
    return user;
  }

  /**
   * login using Jwt
   * @param user login user
   * @returns Jwt token
   */
  async login(user: User) {
    const payload = { email: user.email, userId: user.id, admin: user.admin };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

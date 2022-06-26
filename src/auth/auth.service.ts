import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { passwordDecoder } from '../utils/password/password-decoder';
import { passwordEncoder } from '../utils/password/password-encoder';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

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
    const encodedPassword = await passwordEncoder(password);
    const user = this.usersService.create(email, encodedPassword);
    return user;
  }
}

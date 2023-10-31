import { Injectable } from '@nestjs/common';
import { SemUserService } from '../entities/sem_user.service';

@Injectable()
export class AuthService {
  constructor(private userService: SemUserService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}

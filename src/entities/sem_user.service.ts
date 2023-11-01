import { Injectable } from '@nestjs/common';
import { SemUser } from './sem_user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SemUserService {
  private readonly users: SemUser[];

  constructor() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        password: bcrypt.hashSync('test1234', 10),
        role: 'admin',
      },
    ];
  }

  async findOne(username: string): Promise<SemUser | undefined> {
    return this.users.find((user) => user.username === username);
  }
}

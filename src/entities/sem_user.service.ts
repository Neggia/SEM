import { Injectable } from '@nestjs/common';
import { SemUser } from './sem_user.entity';

@Injectable()
export class SemUserService {
  private readonly users: SemUser[];

  constructor() {
    this.users = [
      {
        id: 1,
        username: 'admin',
        password: 'test',
      },
    ];
  }

  async findOne(username: string): Promise<SemUser | undefined> {
    return this.users.find((user) => user.username === username);
  }
}

import { Fixture } from './fixtures.service';
import { SemProcess } from '../entities/sem_process.entity';

export const SemProcessFixtures: Fixture = {
  entityType: SemProcess,
  data: [
    {
      id: 1,
      name: 'process0',
      server: 'server0',
      interval: 24,
      last_run: 0,
      last_duration: 0,
      status: 0,
      websites: [1, 2],
    },
    {
      id: 2,
      name: 'process1',
      server: 'server1',
      interval: 48,
      last_run: 0,
      last_duration: 0,
      status: 0,
      websites: [3],
    },
  ],
  relations: ['websites'],
};

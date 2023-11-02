import { Fixture } from './fixtures.service';
import { SemProcess } from '../entities/sem_process.entity';

export const SemProcessFixtures: Fixture = {
  entityType: SemProcess,
  data: [
    {
      id: 0,
      name: 'process0',
      server: 'server0',
      interval: 24,
      last_run: 0,
      last_duration: 0,
      status: 0,
      websites: [0, 1],
    },
    {
      id: 1,
      name: 'process1',
      server: 'server1',
      interval: 48,
      last_run: 0,
      last_duration: 0,
      status: 0,
      websites: [2],
    },
  ],
  relations: ['websites'],
};

import { Fixture } from './fixtures.service';
import { SemProcess } from '../entities/sem_process.entity';

export const SemProcessFixtures: Fixture = {
  entityType: SemProcess,
  data: [
    {
      id: 1,
      name: 'process0',
      server: 'localhost',
      interval: 24,
      last_start: 0,
      last_end: 0,
      status: 0,
      websites: null, //[1, 2],
    },
    /*     {
      id: 2,
      name: 'process1',
      server: 'server1',
      interval: 48,
      last_start: 1701726565106,
      last_end: 1701726589954,
      status: 0,
      websites: [3],
    }, */
  ],
  relations: ['websites'],
};

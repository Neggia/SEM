import { Fixture } from './fixtures.service';
import { SemProcess } from '../entities/sem_process.entity';
const {
  // PROCESS_STATUS_RUNNING,
  // PROCESS_STATUS_PAUSED,
  PROCESS_STATUS_STOPPED,
  // PROCESS_STATUS_ERROR,
} = require('../../client/src/utils/globals');

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
      status: PROCESS_STATUS_STOPPED,
      meessage: '',
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

import { Fixture } from './fixtures.service';
import { SemWebsite } from '../entities/sem_website.entity';

export const SemWebsiteFixtures: Fixture = {
  entityType: SemWebsite,
  data: [
    {
      id: 0,
      name: 'pagineazzurre',
      url: 'https://www.pagineazzurre.net/',
      process: 0,
      last_run: 1698624314,
      last_page: 4,
      num_pages: 10,
      status: 0,
      htmlElements: [0, 1],
    },
    {
      id: 1,
      name: 'giuna',
      url: 'https://online.sinerville.com/mod/data/view.php?id=49',
      process: 0,
      last_run: 1698624314,
      last_page: 8,
      num_pages: 10,
      status: 0,
      htmlElements: [2],
    },
    /*     {
      id: 2,
      name: 'website2',
      url: 'wwww.website2.com/products',
      process: 1,
      last_run: 1698624314,
      last_page: 0,
      num_pages: 10,
      status: 0,
      htmlElements: [3],
    }, */
  ],
  relations: ['process', 'htmlElements'],
};

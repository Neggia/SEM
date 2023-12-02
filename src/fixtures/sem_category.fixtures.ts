import { Fixture } from './fixtures.service';
import { SemCategory } from '../entities/sem_category.entity';

export const SemCategoryFixtures: Fixture = {
  entityType: SemCategory,
  data: [
    {
      id: 1,
      parent_id: 0,
      name: 'Food',
    },
    {
      id: 2,
      parent_id: 0,
      name: 'Transportation',
    },
    {
      id: 3,
      parent_id: 0,
      name: 'Electronics',
    },
    {
      id: 4,
      parent_id: 0,
      name: 'Education',
    },
    {
      id: 5,
      parent_id: 0,
      name: 'Clothing',
    },
    {
      id: 6,
      parent_id: 0,
      name: 'Healthcare',
    },
    {
      id: 7,
      parent_id: 0,
      name: 'Tools',
    },
    {
      id: 8,
      parent_id: 0,
      name: 'Sports',
    },
    {
      id: 9,
      parent_id: 0,
      name: 'Arts',
    },
    {
      id: 10,
      parent_id: 0,
      name: 'Security',
    },
  ],
};

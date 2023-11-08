import { Test } from '@nestjs/testing';
import { CrawlQueueModule } from '../../src/crawl_queue/crawl_queue.module';
import { RedisMockProvider } from '../../src/common/mocks/redis_mock.provider';
import { CrawlQueueService } from '../../src/crawl_queue/crawl_queue.service';

describe('CrawlQueueService', () => {
  let service: CrawlQueueService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [CrawlQueueModule],
      providers: [RedisMockProvider],
    }).compile();

    service = moduleRef.get<CrawlQueueService>(CrawlQueueService);
  });

  // ... tests
});

import { Test, TestingModule } from '@nestjs/testing';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { CrawlProcessor } from '../../src/crawl_queue/crawl_processor'; // replace with your actual processor class
import { CrawlQueueService } from '../../src/crawl_queue/crawl_queue.service';

describe('CrawlProcessor', () => {
  let queue: Queue;
  let onActiveSpy: jest.SpyInstance;
  let processSpy: jest.SpyInstance;
  let service: CrawlQueueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'crawlQueue',
        }),
        // ... other necessary modules
      ],
      providers: [CrawlQueueService, CrawlProcessor],
    }).compile();

    service = module.get<CrawlQueueService>(CrawlQueueService);
    queue = module.get<Queue>(getQueueToken('crawlQueue'));

    // Spy on the `onActive` method of the processor
    onActiveSpy = jest.spyOn(CrawlProcessor.prototype, 'onActive');
    // Spy on the `crawl` method of the processor
    processSpy = jest.spyOn(CrawlProcessor.prototype, 'crawl');
  });

  it('should call the crawl process method', async () => {
    // Add a job to the queue
    await service.addCrawlJob('http://example.com');

    // Wait for the job to be processed
    await new Promise((resolve) => queue.on('completed', resolve));

    // Assert that the crawl method has been called
    expect(processSpy).toHaveBeenCalled();
  });

  it('should call the onActive method when the job starts processing', async () => {
    // Add a job to the queue
    await queue.add('crawl', { url: 'http://example.com' });

    // Wait for the job to become active
    await new Promise((resolve) => queue.on('active', resolve));

    // Assert that the onActive method has been called
    expect(onActiveSpy).toHaveBeenCalled();
  });

  afterEach(async () => {
    // Clear the mock
    onActiveSpy.mockRestore();
    // Clear the mock
    processSpy.mockRestore();

    // Clean up the queue
    await queue.close();
  });
});

import { Test, TestingModule } from '@nestjs/testing';
import { BullModule, getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { CrawlProcessor } from '../../src/crawl_queue/crawl_processor'; // replace with your actual processor class

describe('CrawlProcessor', () => {
  let queue: Queue;
  let onActiveSpy: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        BullModule.registerQueue({
          name: 'crawlQueue',
        }),
        // ... other necessary modules
      ],
      providers: [CrawlProcessor],
    }).compile();

    queue = module.get<Queue>(getQueueToken('crawlQueue'));

    // Spy on the `onActive` method of the processor
    onActiveSpy = jest.spyOn(CrawlProcessor.prototype, 'onActive');
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

    // Clean up the queue
    await queue.close();
  });
});

import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class CrawlQueueService {
  constructor(@InjectQueue('crawlQueue') private readonly crawlQueue: Queue) {
    this.crawlQueue.on('error', (error) => {
      console.error('Error in the queue:', error);
    });

    this.crawlQueue.on('waiting', (jobId) => {
      console.log(`Job with id ${jobId} is waiting`);
    });

    // Other one-time event listeners setup...
  }
  async addCrawlJob(url: string, options?: any) {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.hostname}`; // `${urlObj.protocol}//${urlObj.hostname}`;
    const crawlDelay = 5; // TODO await this.getCrawlDelay(url);

    try {
      await this.crawlQueue.add({
        baseUrl,
        crawlDelay,
        url,
        // ... other crawl task data
      });
    } catch (error) {
      console.error('Failed to add job to the queue:', error);
    }
  }

  // You can add other methods related to the crawling process
  // For example, a method to handle job completion, or to stop jobs, etc.
}

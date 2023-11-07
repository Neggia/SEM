import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('crawlQueue')
export class CrawlProcessor {
  private crawlDelays = new Map<string, number>(); // Stores crawl delay per base URL

  @Process()
  async crawl(job: Job<any>) {
    const baseUrl = job.data.baseUrl;
    const currentTimestamp = Date.now();
    const lastCrawled = this.crawlDelays.get(baseUrl) || 0;
    const crawlDelay = job.data.crawlDelay;

    if (lastCrawled + crawlDelay > currentTimestamp) {
      // Requeue with delay
      await job.queue.add(job.data, {
        delay: lastCrawled + crawlDelay - currentTimestamp,
      });
    } else {
      // Perform the crawl task
      await this.handleCrawl(job.data);
      // Update the last crawled timestamp
      this.crawlDelays.set(baseUrl, currentTimestamp);
    }
  }

  private async handleCrawl(data: any) {
    // Your crawl logic here
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name}. Data: ${job.data}`,
    );
  }
}

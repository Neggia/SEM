import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as puppeteer from 'puppeteer';
import * as robotsParser from 'robots-txt-parser';
import { SemProcessService } from '../entities/sem_process.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { CrawlProcessor } from './crawl_processor';

@Injectable()
export class CronCrawlerService {
  private readonly logger = new Logger(CronCrawlerService.name);
  private robotsAgent = robotsParser({
    userAgent: 'SEMCrawler', // The name of your crawler
    allowOnNeutral: false, // If true, will allow access to undefined paths
  });

  constructor(
    private readonly semProcessService: SemProcessService,
    @InjectQueue('crawlQueue') private readonly crawlQueue: Queue,
  ) {}

  async addCrawlTask(url: string) {
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.hostname}`; // `${urlObj.protocol}//${urlObj.hostname}`;
    const crawlDelay = await this.getCrawlDelay(url);

    await this.crawlQueue.add({
      baseUrl,
      crawlDelay,
      // url,
      // ... other crawl task data
    });
  }

  @Cron(CronExpression.EVERY_HOUR) // Runs every hour, adjust as needed
  async handleCron() {
    this.logger.debug('Starting crawler job');
    try {
      // Your crawler logic here
      const processArray = await this.semProcessService.findAll();
      for (const process of processArray) {
        console.log('process:', process);
        for (const website of process.websites) {
          console.log('website.url:', website.url);

          await this.addCrawlTask(website.url);
        }
      }

      this.logger.debug('Crawler job completed successfully');
    } catch (error) {
      this.logger.error('Error running crawler job', error.stack);
    }
  }

  async shouldCrawl(url: string): Promise<boolean> {
    const robotsUrl = new URL('/robots.txt', url).href;
    await this.robotsAgent.useRobotsFor(robotsUrl);
    return this.robotsAgent.canCrawl(url);
  }

  async getCrawlDelay(url: string): Promise<number> {
    if (process.env.NODE_ENV === 'test') {
      return 5;
    }

    // TODO check if crawDelay already extracted and don't fetch again
    const robotsUrl = new URL('/robots.txt', url).href;
    await this.robotsAgent.useRobotsFor(robotsUrl);
    return this.robotsAgent.getCrawlDelay();
  }

  async crawl(url: string) {
    const canCrawl = await this.shouldCrawl(url);
    if (!canCrawl) {
      console.warn(`Crawling is disallowed by robots.txt: ${url}`);
      return;
    }

    const browser = await puppeteer.launch();
    try {
      const page = await browser.newPage();
      await page.goto(url);
      // ... Perform your scraping actions here
    } catch (error) {
      console.error(`Failed to crawl: ${url}`, error);
    } finally {
      await browser.close();
    }
  }
}

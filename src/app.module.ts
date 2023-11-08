import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { SemProcessController } from './entities/sem_process.controller';
import { ServiceOpenaiService } from './service_openai/service_openai.service';
import { ServiceOpenaiController } from './service_openai/service_openai.controller';
import { FixturesService } from './fixtures/fixtures.service';
import { AuthModule } from './auth/auth.module';
import { SemOpenaiCompletionsController } from './entities/sem_openai_completions.controller';
import { CronCrawlerService } from './cron_crawler/cron_crawler.service';
import { CrawlQueueModule } from './crawl_queue/crawl_queue.module'; // Import the CrawlQueueModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot(),
    CrawlQueueModule, // Include the CrawlQueueModule here
  ],
  controllers: [
    AppController,
    ServiceOpenaiController,
    SemProcessController,
    SemOpenaiCompletionsController,
  ],
  providers: [
    AppService,
    ServiceOpenaiService,
    FixturesService,
    CronCrawlerService, // Ensure that the CronCrawlerService is properly provided
  ],
})
export class AppModule {}

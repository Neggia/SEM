import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CrawlQueueService } from './crawl_queue.service';
import { CrawlProcessor } from './crawl_processor';
import IORedis from 'ioredis';
import RedisMock from 'ioredis-mock';

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // Use RedisMock if in test environment, else use real Redis configuration
        const redisClient =
          process.env.NODE_ENV === 'test'
            ? new RedisMock()
            : new IORedis({
                host: configService.get<string>('REDIS_HOST'),
                port: configService.get<number>('REDIS_PORT'),
              });

        return {
          createClient: () => redisClient, //redis: redisClient,
        };
      },
    }),
    BullModule.registerQueue({
      name: 'crawlQueue',
    }),
    // ... other modules if needed
  ],
  providers: [
    CrawlQueueService,
    CrawlProcessor,
    // ... other providers if needed
  ],
  exports: [CrawlQueueService], // Export the service if it needs to be used outside this module
})
export class CrawlQueueModule {}

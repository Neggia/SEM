import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
// import { SemProcessService } from './entities/sem_process.service';
import { SemProcessController } from './entities/sem_process.controller';
import { ServiceOpenaiService } from './service_openai/service_openai.service';
import { ServiceOpenaiController } from './service_openai/service_openai.controller';
import { FixturesService } from './fixtures/fixtures.service';
import { AuthModule } from './auth/auth.module';
import { SemOpenaiCompletionsController } from './entities/sem_openai_completions.controller';
import { CronCrawlerService } from './cron_crawler/cron_crawler.service';
import { BullModule } from '@nestjs/bull';
import IORedis from 'ioredis';
import * as RedisMock from 'ioredis-mock';

// Assume RedisMock is imported correctly if it's compatible
// import RedisMock from 'ioredis-mock';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'crawlQueue', // The name must match the one used in your service
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        if (process.env.NODE_ENV === 'test') {
          // Provide a mock Redis URL or a way to instantiate the mock that Bull accepts
          // The mock URL can be any string since it won't be used to make actual connections
          return {
            redis: 'redis://mock-redis-url:6379',
          };
        } else {
          return {
            redis: {
              host: configService.get<string>('REDIS_HOST'),
              port: configService.get<number>('REDIS_PORT'),
              // include other Redis options as needed
            },
          };
        }
      },
    }),
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
    CronCrawlerService,
  ],
})
export class AppModule {}

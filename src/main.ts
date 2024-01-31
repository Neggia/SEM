import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FixturesService } from './fixtures/fixtures.service';
import { CronCrawlerService } from './cron_crawler/cron_crawler.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const fixturesService = app.get(FixturesService);
    await fixturesService.loadFixtures();

    const cronCrawlerService = app.get(CronCrawlerService);
    await cronCrawlerService.handleCron();

    // Enable CORS for all origins in development
    // Never use this in production
    // app.enableCors();
    // Alternatively, enable CORS for specific origins
    app.enableCors({
      origin: process.env.CORS_ORIGIN,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    await app.listen(process.env.SERVER_PORT);
  } catch (error) {
    console.error('Error during Nest application startup', error);
  }
}
bootstrap();

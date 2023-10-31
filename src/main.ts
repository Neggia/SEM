import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FixturesService } from './fixtures/fixtures.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const fixturesService = app.get(FixturesService);
    await fixturesService.loadFixtures();

    // Enable CORS for all origins in development
    // Never use this in production
    // app.enableCors();
    // Alternatively, enable CORS for specific origins
    app.enableCors({
      origin: 'http://localhost:3001',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    });

    await app.listen(3000);
  } catch (error) {
    console.error('Error during Nest application startup', error);
  }
}
bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FixturesService } from './fixtures/fixtures.service';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const fixturesService = app.get(FixturesService);
    await fixturesService.loadFixtures();
    await app.listen(3000);
  } catch (error) {
    console.error('Error during Nest application startup', error);
  }
}
bootstrap();

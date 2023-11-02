import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
// import { SemProcessService } from './entities/sem_process.service';
import { SemProcessController } from './entities/sem_process.controller';
import { ServiceOpenaiService } from './service_openai/service_openai.service';
import { ServiceOpenaiController } from './service_openai/service_openai.controller';
import { FixturesService } from './fixtures/fixtures.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    AuthModule,
  ],
  controllers: [AppController, ServiceOpenaiController, SemProcessController],
  providers: [AppService, ServiceOpenaiService, FixturesService],
})
export class AppModule {}

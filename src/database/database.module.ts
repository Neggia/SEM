import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SemCurrency } from '../entities/sem_currency.entity';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemProcess } from '../entities/sem_process.entity';
import { SemProductJSON } from '../entities/sem_product_json.entity';
import { SemProduct } from '../entities/sem_product.entity';
import { SemWebsite } from '../entities/sem_website.entity';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsService } from '../entities/sem_openai_completions.service';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         type: 'mysql',
//         host: configService.get('DB_HOST'),
//         port: +configService.get('DB_PORT'),
//         username: configService.get('DB_USERNAME'),
//         password: configService.get('DB_PASSWORD'),
//         database: configService.get('DB_NAME'),
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         synchronize: true,
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {}

import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbName = configService.get<string>('DB_NAME');
        console.log('DB_NAME:', dbName);
        const databasePath = join(__dirname, '..', 'database', dbName)
        console.log('databasePath:', databasePath);

        if (!dbName) {
          throw new Error('DB_NAME is not defined in the environment variables');
        }
        return {
          type: 'sqlite',
          database: databasePath,
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
          synchronize: true,
          logging: true,
        };
      },      
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SemCurrency, SemHtmlElement, SemProcess, SemProductJSON, SemProduct, SemWebsite, SemOpenaiCompletions]),
  ],
  providers: [SemHtmlElementService, SemOpenaiCompletionsService],
  exports: [TypeOrmModule, SemHtmlElementService, SemOpenaiCompletionsService],
})
export class DatabaseModule {}


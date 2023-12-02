import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SemCategory } from '../entities/sem_category.entity';
import { SemCategoryService } from '../entities/sem_category.service';
import { SemCurrency } from '../entities/sem_currency.entity';
import { SemCurrencyService } from '../entities/sem_currency.service';
import { SemHtmlElement } from '../entities/sem_html_element.entity';
import { SemHtmlElementService } from '../entities/sem_html_element.service';
import { SemOpenaiCompletions } from '../entities/sem_openai_completions.entity';
import { SemOpenaiCompletionsService } from '../entities/sem_openai_completions.service';
import { SemOpenaiCompletionsRequest } from '../entities/sem_openai_completions_request.entity';
import { SemOpenaiCompletionsRequestService } from '../entities/sem_openai_completions_request.service';
import { SemProcess } from '../entities/sem_process.entity';
import { SemProcessService } from '../entities/sem_process.service';
import { SemHtmlElementStructure } from '../entities/sem_html_element_structure.entity';
import { SemHtmlElementStructureService } from '../entities/sem_html_element_structure.service';
import { SemProduct } from '../entities/sem_product.entity';
import { SemProductService } from '../entities/sem_product.service';
import { SemWebsite } from '../entities/sem_website.entity';
import { SemWebsiteService } from '../entities/sem_website.service';
import { join } from 'path';
import * as appRoot from 'app-root-path';
import * as path from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbName = configService.get<string>('DB_NAME');
        console.log('DB_NAME: ', dbName);
        if (!dbName) {
          throw new Error(
            'DB_NAME is not defined in the environment variables',
          );
        }
        const databaseSubfolder = 'data';

        // Check if the subfolder exists; if not, create it
        const databaseSubfolderPath = path.join(
          appRoot.path,
          databaseSubfolder,
        );
        if (!fs.existsSync(databaseSubfolderPath)) {
          fs.mkdirSync(databaseSubfolderPath, { recursive: true });
        }
        const databasePath = join(databaseSubfolderPath, dbName);
        console.log('databasePath: ', databasePath);

        return {
          type: 'sqlite',
          database: databasePath,
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
          synchronize: true,
          logging: true,
        };
      },
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
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([
      SemCategory,
      SemCurrency,
      SemHtmlElement,
      SemProcess,
      SemHtmlElementStructure,
      SemProduct,
      SemWebsite,
      SemOpenaiCompletions,
      SemOpenaiCompletionsRequest,
    ]),
  ],
  providers: [
    SemHtmlElementService,
    SemOpenaiCompletionsService,
    SemOpenaiCompletionsRequestService,
    SemWebsiteService,
    SemHtmlElementStructureService,
    SemProcessService,
    SemProductService,
    SemCurrencyService,
    SemCategoryService,
  ],
  exports: [
    TypeOrmModule,
    SemHtmlElementService,
    SemOpenaiCompletionsService,
    SemOpenaiCompletionsRequestService,
    SemWebsiteService,
    SemHtmlElementStructureService,
    SemProcessService,
    SemProductService,
    SemCurrencyService,
  ],
})
export class DatabaseModule {}

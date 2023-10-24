// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';

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

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SemProduct } from '../entities/sem_product.entity';
import { SemProcess } from '../entities/sem_process.entity';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbName = configService.get<string>('DB_NAME');
        console.log('DB_NAME:', dbName);  // Add this line to debug 
        const databasePath = join(__dirname, '..', 'database', dbName)
        console.log('databasePath:', databasePath);

        if (!dbName) {
          throw new Error('DB_NAME is not defined in the environment variables');
        }
        return {
          type: 'sqlite',
          database: databasePath, //join(__dirname, '..', 'database', dbName),
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
          synchronize: true,
          logging: true,  // Enable logging
        };
      },      
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([SemProcess, SemProduct]), // Include all entities that will be used in this module
  ],
})
export class DatabaseModule {}


import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { Connection } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => {
        const dbName = ':memory:';
        console.log('memory db name: ', dbName);
        return {
          type: 'sqlite',
          database: ':memory:',
          entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
          synchronize: true,
          logging: true,
        };
      },
    }),
  ],
  providers: [
    {
      provide: 'MEMORY_DATABASE_CONNECTION',
      useFactory: async (connection: Connection) => connection,
      inject: [Connection],
    },
  ],
  exports: [TypeOrmModule, 'MEMORY_DATABASE_CONNECTION'],
})
export class MemoryDatabaseModule {}

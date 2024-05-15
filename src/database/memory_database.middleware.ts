import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Connection } from 'typeorm';

@Injectable()
export class MemoryDatabaseMiddleware implements NestMiddleware {
  constructor(
    @Inject('MEMORY_DATABASE_CONNECTION')
    private readonly connection: Connection,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.connection.query(
      'CREATE TABLE IF NOT EXISTS crawler_lock(is_locked INT NOT NULL PRIMARY KEY)',
    );
    await this.connection.query(
      'INSERT OR IGNORE INTO crawler_lock (is_locked) VALUES (0)',
    );
    const queryResult = await this.connection.query(
      'SELECT * FROM crawler_lock WHERE is_locked = 1',
    );

    if (queryResult.length > 0) {
      // Block the request
      console.log(
        'Memory database locked. Blocking the request with 403 Forbidden',
      );
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  }
}

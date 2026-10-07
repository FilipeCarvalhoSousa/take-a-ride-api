import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

@Injectable()
export class DatabaseService {
  private readonly pool: Pool;

  public readonly db;

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.pool = new Pool({
      host: this.configService.getOrThrow<string>(
        'database.host',
      ),

      port: this.configService.getOrThrow<number>(
        'database.port',
      ),

      database: this.configService.getOrThrow<string>(
        'database.name',
      ),

      user: this.configService.getOrThrow<string>(
        'database.user',
      ),

      password: this.configService.getOrThrow<string>(
        'database.password',
      ),

      max: 10,

      idleTimeoutMillis: 30_000,

      connectionTimeoutMillis: 5_000,
    });

    this.db = drizzle(this.pool);
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}

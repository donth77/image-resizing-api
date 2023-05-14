import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config();

export class Redis {
  private static client: ReturnType<typeof createClient> | undefined;

  public static getConnection() {
    if (this.client) {
      return this.client;
    }

    this.client = createClient({
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });
    return this.client;
  }
}

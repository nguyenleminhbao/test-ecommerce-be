import { connectRedis } from './../utils/connect-redis';
import { Injectable } from '@nestjs/common';
import { RedisClientType } from '@redis/client';

@Injectable()
export class RedisService {
  private readonly client: RedisClientType;
  private readonly databaseCache: RedisClientType;
  constructor() {
    this.client = connectRedis(
      process.env.REDIS_HOST,
      process.env.REDIS_PASSWORD,
      parseInt(process.env.REDIS_PORT),
      'Redis',
    );

    this.databaseCache = connectRedis(
      process.env.DATABASE_CACHE_HOST,
      process.env.DATABASE_CACHE_PASSWORD,
      parseInt(process.env.DATABASE_CACHE_PORT),
      'Database cache',
    );
  }

  async setValueDatabase(key: string, value: string, expired?: number) {
    return await this.databaseCache.set(key, value, {
      EX: expired,
    });
  }

  async getValueDatabase(key: string) {
    if (!this.databaseCache.get(key)) return undefined;
    return await this.databaseCache.get(key);
  }
  async setValue(key: string, value: string, expired?: number) {
    return await this.client.set(key, value, {
      EX: expired,
    });
  }

  async getValue(key: string) {
    return await this.client.get(key);
  }

  async getMultiValue(keys: string[]) {
    return await this.client.mGet(keys);
  }

  async getKeys(name: string) {
    return await this.client.keys(name);
  }

  deleteTokenKey(key: string) {
    if (this.client.get(key)) this.client.del(key);
  }

  deleteKey(key: string) {
    if (this.client.get(key)) this.client.del(key);
  }
}

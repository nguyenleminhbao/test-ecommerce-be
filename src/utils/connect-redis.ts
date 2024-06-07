import { createClient } from 'redis';
import { RedisClientType } from '@redis/client';

export const connectRedis = (
  host: string,
  password: string,
  port: number,
  infor: string,
) => {
  const redis: RedisClientType = createClient({
    password,
    socket: {
      host,
      port,
    },
    legacyMode: false,
  });
  redis.on('connect', () => {
    console.log(`${infor} connected successfully`);
  });
  redis.on('error', (err) => {
    console.log(err?.message);
  });
  redis.connect();
  return redis;
};

import Redis from 'ioredis';

export const redis = new Redis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
  tls: process.env.REDIS_URL?.startsWith('rediss://') ? {} : undefined,
});

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.error('Redis error:', err));
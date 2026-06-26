import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function getCached(key, fetchFn, ttl = 300) {
  const cached = await redis.get(key);
  if (cached) return cached;

  const data = await fetchFn();
  if (data !== null && data !== undefined) {
    const serialized = typeof data === 'object' ? JSON.stringify(data) : String(data);
    await redis.set(key, serialized, { ex: ttl });
  }
  return data;
}

export async function invalidateCache(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) await redis.del(...keys);
  } catch {}
}

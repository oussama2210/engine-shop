import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export const apiRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
  analytics: true,
  prefix: 'ratelimit:api',
});

export const uploadRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
  analytics: true,
  prefix: 'ratelimit:upload',
});

export async function checkRateLimit(identifier, limiter = apiRatelimit) {
  const { success, limit, remaining, reset } = await limiter.limit(identifier);
  return {
    allowed: success,
    remaining,
    limit,
    reset: Math.ceil((reset - Date.now()) / 1000),
  };
}

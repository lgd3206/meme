import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// 创建 Redis 客户端
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    })
  : null;

// 创建速率限制器
// 限制：每个 IP 每小时最多 10 次请求
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '1 h'),
      analytics: true,
      prefix: 'meme-explainer',
    })
  : null;

// 获取客户端 IP 地址
export function getClientIp(request: Request): string {
  // 尝试从各种 header 获取真实 IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (realIp) {
    return realIp.trim();
  }

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  return 'unknown';
}

// 检查速率限制
export async function checkRateLimit(identifier: string) {
  if (!ratelimit) {
    console.warn('⚠️ 速率限制未配置（未设置 UPSTASH_REDIS_REST_URL）');
    return {
      success: true,
      limit: 999,
      remaining: 999,
      reset: Date.now(),
    };
  }

  const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

  return {
    success,
    limit,
    remaining,
    reset,
  };
}

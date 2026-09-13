import { Injectable, OnModuleDestroy } from '@nestjs/common';

// Redis-backed cache with in-memory fallback (works even if Redis is down).
@Injectable()
export class CacheService implements OnModuleDestroy {
  private redis: any = null;
  private mem = new Map<string, { v: string; exp: number }>();

  constructor() {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const IORedis = require('ioredis');
      const url = process.env.REDIS_URL;
      if (url) {
        this.redis = new IORedis(url, { lazyConnect: true, maxRetriesPerRequest: 1 });
        this.redis.connect().catch(() => (this.redis = null));
        this.redis.on('error', () => undefined);
      }
    } catch {
      this.redis = null;
    }
  }

  async get(key: string): Promise<string | null> {
    if (this.redis) {
      try {
        return await this.redis.get(key);
      } catch {
        /* fall through to memory */
      }
    }
    const e = this.mem.get(key);
    if (!e) return null;
    if (Date.now() > e.exp) {
      this.mem.delete(key);
      return null;
    }
    return e.v;
  }

  async set(key: string, value: string, ttlSec = 300): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.set(key, value, 'EX', ttlSec);
        return;
      } catch {
        /* fall through */
      }
    }
    this.mem.set(key, { v: value, exp: Date.now() + ttlSec * 1000 });
  }

  async del(key: string): Promise<void> {
    if (this.redis) {
      try {
        await this.redis.del(key);
      } catch {
        /* ignore */
      }
    }
    this.mem.delete(key);
  }

  onModuleDestroy() {
    try {
      this.redis?.disconnect();
    } catch {
      /* ignore */
    }
  }
}

import { Injectable, OnModuleDestroy } from '@nestjs/common';

type RedisValue = string | number | Buffer;

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly memory = new Map<string, { value: RedisValue; expiresAt?: number }>();

  async get(key: string) {
    const item = this.memory.get(key);
    if (!item) return null;
    if (item.expiresAt && item.expiresAt < Date.now()) {
      this.memory.delete(key);
      return null;
    }
    return String(item.value);
  }

  async set(key: string, value: RedisValue, ttlSeconds?: number) {
    this.memory.set(key, { value, expiresAt: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined });
    return 'OK';
  }

  async del(key: string) {
    return this.memory.delete(key) ? 1 : 0;
  }

  async onModuleDestroy() {
    this.memory.clear();
  }
}

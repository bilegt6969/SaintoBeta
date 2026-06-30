interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

/**
 * Simple in-process TTL cache.
 * Lives for the lifetime of the Node.js process (i.e. survives multiple requests).
 * Good enough for small-to-medium catalogs; swap for Redis when you need
 * multi-instance consistency or sub-second invalidation.
 */
class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private readonly ttlMs: number;

  constructor(ttlMs: number) {
    this.ttlMs = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T): void {
    this.store.set(key, {
      value,
      expiresAt: Date.now() + this.ttlMs,
    });
  }

  invalidate(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }
}

/**
 * Bundle affinity map cache — 5-minute TTL.
 * Call `bundleAffinityCache.invalidate("bundle-affinity")` from a
 * Sanity webhook handler when products are published/deleted.
 */
export const bundleAffinityCache = new TTLCache<Map<string, Set<string>>>(
  5 * 60 * 1000,
);

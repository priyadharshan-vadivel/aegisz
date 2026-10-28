/*
 * Per-key sliding-window rate limit. The in-memory store lives per serverless instance, so on
 * Vercel it is best-effort (each cold instance starts empty). Swap in a shared store (e.g.
 * Upstash Redis) by implementing RateLimiter; callers don't change.
 */

export type RateResult = { ok: boolean; retryAfter: number };

export interface RateLimiter {
  hit(key: string, now?: number): RateResult;
}

export class MemoryRateLimiter implements RateLimiter {
  private hits = new Map<string, number[]>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(limit = 5, windowMs = 10 * 60 * 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  hit(key: string, now = Date.now()): RateResult {
    const since = now - this.windowMs;
    const recent = (this.hits.get(key) ?? []).filter((t) => t > since);
    if (recent.length >= this.limit) {
      this.hits.set(key, recent);
      return { ok: false, retryAfter: Math.ceil((recent[0] + this.windowMs - now) / 1000) };
    }
    recent.push(now);
    this.hits.set(key, recent);
    if (this.hits.size > 5000) this.prune(since);
    return { ok: true, retryAfter: 0 };
  }

  private prune(since: number) {
    for (const [k, v] of this.hits) if (v.every((t) => t <= since)) this.hits.delete(k);
  }
}

/** Shared by /api/contact and /api/lead: 5 submissions per IP per 10 minutes. */
export const formLimiter = new MemoryRateLimiter(5, 10 * 60 * 1000);

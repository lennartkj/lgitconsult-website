// Minimal in-memory rate limiter (sliding window, keyed by IP). No dependency,
// no store. Caveat: in-memory is PER-INSTANCE — on multi-instance/serverless it
// limits each instance separately, not globally. That's fine here: it's a cheap
// first line against scripted abuse of /api/audit (the Opus-spending route); the
// HARD backstop against runaway cost is the Anthropic monthly spend cap.

type Stamps = number[];
const buckets = new Map<string, Stamps>();
let lastSweep = Date.now();

export function rateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Occasional sweep so the map can't grow unbounded across many IPs.
  if (now - lastSweep > 10 * 60_000) {
    for (const [k, v] of buckets) {
      if (v.every((t) => now - t >= windowMs)) buckets.delete(k);
    }
    lastSweep = now;
  }

  const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    buckets.set(key, recent);
    return { ok: false, retryAfter };
  }
  recent.push(now);
  buckets.set(key, recent);
  return { ok: true, retryAfter: 0 };
}

// Best-effort client IP from common proxy headers.
export function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

// Meta (Facebook) pixel helper — the thin client-side bridge to `window.fbq`.
// Mirrors src/lib/track.ts in spirit: tracking must NEVER break the experience,
// and it must no-op cleanly when the pixel isn't loaded. The base pixel is loaded
// (gated on NEXT_PUBLIC_META_PIXEL_ID) by MetaPixel.tsx in the layout; this helper
// only fires the standard funnel events alongside the first-party `track()` calls.
//
// When NEXT_PUBLIC_META_PIXEL_ID is unset, MetaPixel renders nothing, `window.fbq`
// is never defined, and every call here silently returns — no errors, no network.

type Fbq = (...args: unknown[]) => void;

declare global {
  interface Window {
    fbq?: Fbq;
  }
}

// Fire a standard Meta pixel event (`fbq('track', event, params)`), but only if
// the base pixel actually loaded. Call sites stay one-liners and stay safe when
// the pixel is absent (env id unset, blocker, consent gate not yet built, etc.).
export function fbqTrack(event: string, params?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const fbq = window.fbq;
    if (typeof fbq !== "function") return; // pixel not loaded → no-op
    if (params) fbq("track", event, params);
    else fbq("track", event);
  } catch {
    // Never let analytics break the funnel.
  }
}

// Lightweight first-party funnel tracker. No third-party scripts, no cookies,
// no PII — just named events (step ids, not personal data) POSTed to /api/track,
// which logs them server-side for the operator to read. A real analytics store
// or a Plausible/PostHog forward can be swapped in behind /api/track later.

export function track(event: string, props?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  try {
    const body = JSON.stringify({
      event,
      props: props ?? null,
      path: window.location.pathname,
    });
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      // Fires reliably even as the page navigates/unloads.
      navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    } else {
      void fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      });
    }
  } catch {
    // Tracking must never break the experience.
  }
}

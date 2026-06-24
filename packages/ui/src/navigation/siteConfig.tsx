/* ──────────────────────────────────────────────────────────────────────────
   Cross-domain site config (shared by BOTH apps).

   The two surfaces live on two domains but share the Navbar/Footer:
     · LGIT   → https://git-consult.group   (owns /, /work, /about, /journal,
                /patina, /coterie, /provenance, /sibyl, /contact, /legal/*, …)
     · Rogue  → https://rogue.berlin        (owns /creative, /services/*)

   Because the chrome is shared, a root-relative link to a route owned by the
   OTHER app would resolve against the wrong domain (404). So every nav link is
   resolved through `resolveHref()`: links to the current app stay relative;
   links to the other app are rewritten to an absolute URL on the right domain.

   "Which app am I?" is stamped at build time via NEXT_PUBLIC_APP (set by each
   app's next.config through @repo/config/next). Defaults to "lgit".
   ────────────────────────────────────────────────────────────────────────── */

export type AppId = "lgit" | "rogue";

export const DOMAINS: Record<AppId, string> = {
  lgit: "https://git-consult.group",
  rogue: "https://rogue.berlin",
};

/** Route prefixes owned by the Rogue app. Everything else belongs to LGIT. */
const ROGUE_PREFIXES = ["/creative", "/services"];

/** Which app owns a given root-relative route. */
export function ownerOf(href: string): AppId {
  for (const p of ROGUE_PREFIXES) {
    if (href === p || href.startsWith(`${p}/`) || href.startsWith(`${p}?`)) {
      return "rogue";
    }
  }
  return "lgit";
}

/** The app this build is running as. */
export function currentApp(): AppId {
  return process.env.NEXT_PUBLIC_APP === "rogue" ? "rogue" : "lgit";
}

/**
 * Resolve a nav href for the current app.
 * - External/absolute/anchor/mailto links pass through untouched.
 * - Links owned by the current app stay root-relative.
 * - Links owned by the other app become absolute to that app's domain.
 */
export function resolveHref(href: string, app: AppId = currentApp()): string {
  if (!href.startsWith("/")) return href; // mailto:, https://, #, etc.
  const owner = ownerOf(href);
  if (owner === app) return href;
  return `${DOMAINS[owner]}${href}`;
}

/** True when a resolved href points off this app's domain (needs a real <a>). */
export function isCrossDomain(href: string, app: AppId = currentApp()): boolean {
  return href.startsWith("/") && ownerOf(href) !== app;
}

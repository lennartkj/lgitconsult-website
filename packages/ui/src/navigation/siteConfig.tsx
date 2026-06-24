/* ──────────────────────────────────────────────────────────────────────────
   Cross-domain site config (shared by the LGIT + Patina chrome).

   The surfaces live on separate domains but the LGIT + Patina apps share the
   Navbar/Footer:
     · LGIT    → https://git-consult.group   (owns /, /work, /about, /journal,
                 /coterie, /provenance, /sibyl, /contact, /legal/*, …)
     · Patina  → https://patina.berlin       (owns /patina, /audit/*)
     · Rogue   → https://rogue.berlin         (owns /creative, /services/* — has
                 its OWN chrome now and does not import this Navbar/Footer)

   Because the chrome is shared, a root-relative link to a route owned by
   ANOTHER app would resolve against the wrong domain (404). So every nav link is
   resolved through `resolveHref()`: links to the current app stay relative;
   links to another app are rewritten to an absolute URL on the right domain.

   "Which app am I?" is stamped at build time via NEXT_PUBLIC_APP (set by each
   app's next.config through @repo/config/next). Defaults to "lgit".
   ────────────────────────────────────────────────────────────────────────── */

export type AppId = "lgit" | "rogue" | "patina";

export const DOMAINS: Record<AppId, string> = {
  lgit: "https://git-consult.group",
  rogue: "https://rogue.berlin",
  patina: "https://patina.berlin",
};

/** Route prefixes owned by the Rogue app. */
const ROGUE_PREFIXES = ["/creative", "/services"];

/** Route prefixes owned by the Patina app. */
const PATINA_PREFIXES = ["/patina", "/audit"];

/** Which app owns a given root-relative route. Everything else belongs to LGIT. */
export function ownerOf(href: string): AppId {
  const matches = (prefix: string) =>
    href === prefix ||
    href.startsWith(`${prefix}/`) ||
    href.startsWith(`${prefix}?`);
  for (const p of PATINA_PREFIXES) {
    if (matches(p)) return "patina";
  }
  for (const p of ROGUE_PREFIXES) {
    if (matches(p)) return "rogue";
  }
  return "lgit";
}

/** The app this build is running as. */
export function currentApp(): AppId {
  const app = process.env.NEXT_PUBLIC_APP;
  if (app === "rogue") return "rogue";
  if (app === "patina") return "patina";
  return "lgit";
}

/**
 * Resolve a nav href for the current app.
 * - External/absolute/anchor/mailto links pass through untouched.
 * - Links owned by the current app stay root-relative.
 * - Links owned by another app become absolute to that app's domain.
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

import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createNextConfig } = require("@repo/config/next");

const nextConfig: NextConfig = createNextConfig({
  // Redirects keep old git-consult.group URLs alive after two cuts:
  //  · Phase 2 (Patina moved to patina.berlin) — permanent.
  //  · 2026-09-07 consolidation (one site, one digital offer; the standalone
  //    product pages and the Creative line are off this domain) — temporary
  //    (307), because those products are parked, not dead.
  async redirects() {
    return [
      {
        // Patina has no brand landing now — it's the funnel. Send /patina to the Audit.
        source: "/patina",
        destination: "https://patina.berlin/audit",
        permanent: true,
      },
      {
        // The entire /audit funnel — /audit, /audit/received, /audit/sample,
        // /audit/read, /audit/gift, /audit/d/<slug>, etc.
        source: "/audit/:path*",
        destination: "https://patina.berlin/audit/:path*",
        permanent: true,
      },
      {
        source: "/audit",
        destination: "https://patina.berlin/audit",
        permanent: true,
      },
      {
        // The XTE case was filed under a misleading slug; keep the old URL alive.
        // Projects are sections on /work (there never was a /work/<slug> page).
        source: "/work/e-commerce-platform",
        destination: "/work#xte-webcourse",
        permanent: true,
      },
      {
        // Every other /work/<slug> (the six retired write-ups, old search hits).
        source: "/work/:slug",
        destination: "/work",
        permanent: false,
      },
      {
        // The generic "digital services" pages are gone (2026-09-07). The one
        // digital offer now lives on /auftritt; send old bookmarks there.
        source: "/services/:slug(web-development|mobile-development|ui-ux-design|it-consulting)",
        destination: "/auftritt",
        permanent: true,
      },
      {
        // Standalone product pages and the Creative line left this domain on
        // 2026-09-07 (consolidation). Parked, not dead → temporary redirects.
        source: "/:page(coterie|sibyl|creative)",
        destination: "/",
        permanent: false,
      },
      {
        source: "/provenance/:path*",
        destination: "/",
        permanent: false,
      },
    ];
  },
});

export default nextConfig;

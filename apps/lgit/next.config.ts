import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createNextConfig } = require("@repo/config/next");

const nextConfig: NextConfig = createNextConfig({
  // Phase 2 cutover: Patina (the /patina brand landing + the whole /audit funnel)
  // moved to its own app on https://patina.berlin. These permanent (301) redirects
  // keep the old git-consult.group URLs alive so live links, bookmarks, Stripe
  // success URLs and search results don't 404 after the split.
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
        // /audit/read, /audit/gift, /audit/d/<slug>, etc. :path* matches the
        // bare /audit (empty path) as well as every sub-route.
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
        source: "/work/e-commerce-platform",
        destination: "/work/xte-webcourse",
        permanent: true,
      },
      {
        // The generic "digital services" pages are gone (2026-09-07). The one
        // digital offer now lives on /auftritt; send old bookmarks there.
        source: "/services/:slug(web-development|mobile-development|ui-ux-design|it-consulting)",
        destination: "/auftritt",
        permanent: true,
      },
    ];
  },
});

export default nextConfig;

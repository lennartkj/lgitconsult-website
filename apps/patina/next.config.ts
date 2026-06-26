import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createNextConfig } = require("@repo/config/next");

const nextConfig: NextConfig = createNextConfig({
  app: "patina",
  // No brand landing — Patina is the funnel. Any stray /patina link (old
  // bookmarks, the shared siteConfig) lands in the Audit.
  async redirects() {
    return [
      { source: "/patina", destination: "/audit", permanent: true },
      // /audit/read was a fake-door for a "from €200, coming soon" tripwire. It
      // now contradicts the real €150 Read offer baked into the wizard reveal,
      // so retire it: fold any stray traffic back into the funnel. (P0 #20)
      { source: "/audit/read", destination: "/audit", permanent: true },
    ];
  },
});

export default nextConfig;

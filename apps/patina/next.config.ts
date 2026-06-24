import type { NextConfig } from "next";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { createNextConfig } = require("@repo/config/next");

const nextConfig: NextConfig = createNextConfig({
  app: "patina",
  // No brand landing — Patina is the funnel. Any stray /patina link (old
  // bookmarks, the shared siteConfig) lands in the Audit.
  async redirects() {
    return [{ source: "/patina", destination: "/audit", permanent: true }];
  },
});

export default nextConfig;

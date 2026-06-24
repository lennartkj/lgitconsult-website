/**
 * Shared Next.js config bits for all apps in the monorepo.
 *
 * - output: "standalone" matches the original single-app deploy.
 * - transpilePackages: workspace packages ship raw TS/TSX and are compiled by
 *   each app's Next build (Turbopack). Every app must transpile @repo/ui and
 *   @repo/content (and pass its own list if it adds more).
 * - app: stamps NEXT_PUBLIC_APP so the shared chrome (Navbar/Footer) knows which
 *   surface it is rendering on, and can rewrite cross-app links to absolute URLs
 *   on the right domain. Defaults to "lgit". Pass `{ app: "rogue" }` for Rogue,
 *   `{ app: "patina" }` for Patina.
 *
 * @param {Partial<import('next').NextConfig> & { app?: "lgit" | "rogue" | "patina" }} overrides
 * @returns {import('next').NextConfig}
 */
function createNextConfig(overrides = {}) {
  const { transpilePackages = [], app = "lgit", env = {}, ...rest } = overrides;
  return {
    output: "standalone",
    transpilePackages: ["@repo/ui", "@repo/content", ...transpilePackages],
    env: { NEXT_PUBLIC_APP: app, ...env },
    ...rest,
  };
}

module.exports = { createNextConfig };

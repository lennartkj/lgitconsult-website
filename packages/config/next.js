/**
 * Shared Next.js config bits for all apps in the monorepo.
 *
 * - output: "standalone" matches the original single-app deploy.
 * - transpilePackages: workspace packages ship raw TS/TSX and are compiled by
 *   each app's Next build (Turbopack). Every app must transpile @repo/ui and
 *   @repo/content (and pass its own list if it adds more).
 *
 * @param {Partial<import('next').NextConfig>} overrides
 * @returns {import('next').NextConfig}
 */
function createNextConfig(overrides = {}) {
  const { transpilePackages = [], ...rest } = overrides;
  return {
    output: "standalone",
    transpilePackages: ["@repo/ui", "@repo/content", ...transpilePackages],
    ...rest,
  };
}

module.exports = { createNextConfig };

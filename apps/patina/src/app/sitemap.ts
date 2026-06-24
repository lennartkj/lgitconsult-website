import type { MetadataRoute } from "next";

export const revalidate = 60;

// Production domain. NEXT_PUBLIC_SITE_URL overrides for previews/local.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://patina.berlin"
).replace(/\/$/, "");

// Public, indexable routes. The /audit/* funnel is intentionally noindex
// (set per-page via metadata.robots), so it is NOT listed here.
const STATIC_ROUTES = ["/patina"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));
}

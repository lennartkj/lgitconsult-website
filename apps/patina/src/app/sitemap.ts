import type { MetadataRoute } from "next";

export const revalidate = 60;

// Production domain. NEXT_PUBLIC_SITE_URL overrides for previews/local.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://patina.berlin"
).replace(/\/$/, "");

// Patina is the /audit funnel only, and the whole funnel is intentionally
// noindex (set per-page via metadata.robots). Nothing public to list.
const STATIC_ROUTES: string[] = [];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));
}

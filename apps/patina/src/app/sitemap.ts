import type { MetadataRoute } from "next";
import { getVerdictSlugs } from "@/lib/verdict/verdicts";

export const revalidate = 60;

// Production domain. NEXT_PUBLIC_SITE_URL overrides for previews/local.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://patina.berlin"
).replace(/\/$/, "");

// The /audit funnel is intentionally noindex. The one PUBLIC surface is The Eye
// (the proof library) — awareness loud, access scarce (PROOF_ENGINE.md).
const STATIC_ROUTES: string[] = ["/eye"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    ...STATIC_ROUTES,
    ...getVerdictSlugs().map((slug) => `/eye/${slug}`),
  ];
  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));
}

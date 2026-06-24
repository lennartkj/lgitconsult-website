import type { MetadataRoute } from "next";
import { getAllContent } from "@/lib/content";

export const revalidate = 60;

// Production domain. NEXT_PUBLIC_SITE_URL overrides for previews/local.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://git-consult.group"
).replace(/\/$/, "");

// Public, indexable top-level routes.
const STATIC_ROUTES = [
  "",
  "/about",
  "/services",
  "/creative",
  "/work",
  "/journal",
  "/contact",
  "/patina",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));

  const services = await getAllContent("services");
  const serviceEntries: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...serviceEntries];
}

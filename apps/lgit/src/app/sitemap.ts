import type { MetadataRoute } from "next";
import { getAllContent } from "@repo/content/lib";

export const revalidate = 60;

// Production domain. NEXT_PUBLIC_SITE_URL overrides for previews/local.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://git-consult.group"
).replace(/\/$/, "");

// Public, indexable top-level routes owned by THIS app. /services and /creative
// belong to the Rogue app (rogue.berlin) and must not be listed on this domain.
const STATIC_ROUTES = [
  "",
  "/auftritt",
  "/about",
  "/work",
  "/journal",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));

  const projects = await getAllContent("projects");
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${BASE_URL}/work/${project.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...projectEntries];
}

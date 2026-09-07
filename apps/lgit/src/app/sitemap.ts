import type { MetadataRoute } from "next";
import { getAllPosts } from "@repo/content";

export const revalidate = 60;

// Production domain. NEXT_PUBLIC_SITE_URL overrides for previews/local.
const BASE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://git-consult.group"
).replace(/\/$/, "");

// Public, indexable routes owned by THIS app. Projects are sections on /work
// (no /work/<slug> pages). /services and /creative belong to the Rogue app
// (rogue.berlin) and must not be listed on this domain.
const STATIC_ROUTES = [
  "",
  "/auftritt",
  "/work",
  "/about",
  "/journal",
  "/contact",
  "/legal/impressum",
  "/legal/privacy",
  "/legal/terms",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));

  const posts = await getAllPosts();
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/journal/${post.slug}`,
    lastModified: now,
  }));

  return [...staticEntries, ...postEntries];
}

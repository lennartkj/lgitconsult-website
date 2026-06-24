import { getFeaturedProjects } from "@repo/content";
import HomeContent from "@/components/home/HomeContent";
import { Project } from "@repo/content/types";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'LGIT Consult - Creative Consulting & Digital Agency',
    description: 'Leipzig-based creative consulting and digital agency. We work with artists, brands, and businesses — building campaigns, digital products, and everything in between.',
  };
}

export default async function HomePage() {
  const featuredProjects = await getFeaturedProjects();

  // Limit projects to 3
  const projects = featuredProjects.slice(0, 3);

  return (
      <HomeContent projects={projects as Project[]} />
  );
}

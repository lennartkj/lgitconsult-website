import { getFeaturedProjects, getAllServices } from "@/lib/data";
import HomeContent from "@/components/home/HomeContent";
import { Project, Service } from "@/lib/data/types";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'LGIT Consult - Digital Transformation & Web Solutions',
    description: 'We build modern, high-performance websites and applications using Next.js, React, and robust architecture.',
  };
}

export default async function HomePage() {
  // Fetch all necessary data in parallel on the server
  const [featuredProjects, services] = await Promise.all([
    getFeaturedProjects(),
    getAllServices(),
  ]);

  // Limit projects to 3, as the original component did
  const projects = featuredProjects.slice(0, 3);

  // Da alle Daten auf dem Server gefetcht wurden, übergeben wir sie als Props.
  return (
      <HomeContent
          projects={projects as Project[]}
          services={services as Service[]}
      />
  );
}

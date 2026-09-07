import { getFeaturedProjects } from "@repo/content";
import HomeContent from "@/components/home/HomeContent";
import { Project } from "@repo/content/types";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'LGIT Consult — Websites, Webanwendungen und KI-Integration in Leipzig',
    description:
      'Websites, Webanwendungen und KI-Integration zum Festpreis für Kanzleien, Praxen, Architekten, Immobilien und Manufakturen in Leipzig. Derzeit mit 35 bis 60 % der förderfähigen Kosten SAB-bezuschussbar, vorbehiltlich Bewilligung.',
  };
}

export default async function HomePage() {
  // The featured projects (today: the XTE Webcourse and Patina), at most three.
  const featuredProjects = await getFeaturedProjects();
  const projects = featuredProjects.slice(0, 3);

  return (
      <HomeContent projects={projects as Project[]} />
  );
}

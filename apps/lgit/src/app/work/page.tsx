import { getAllProjects } from "@repo/content";
import WorkContent from "@/components/work/WorkContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Our Portfolio | LGIT Consult',
    description: 'Browse our comprehensive portfolio of successful web development, mobile app, and UI/UX design projects.',
  };
}

export default async function WorkPage() {
  // Nur die Projekte werden auf dem Server einmal abgerufen.
  const projects = await getAllProjects();

  // Da die Filterung client-seitig erfolgt, übergeben wir die gesamte Liste.
  return (
      <WorkContent
          projects={projects}
      />
  );
}

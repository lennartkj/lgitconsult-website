import { getAllProjects } from "@repo/content";
import WorkContent from "@/components/work/WorkContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Work | LGIT Consult',
    description: 'Client work and in-house ventures from LGIT Consult, Leipzig: the XTE Webcourse for HTWK Leipzig, Patina, and the products in development.',
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

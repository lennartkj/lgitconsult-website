import { getAllProjects } from "@repo/content";
import WorkContent from "@/components/work/WorkContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Projekte | LGIT Consult',
    description: 'Der XTE Webcourse für die HTWK Leipzig und Patina, ein eigenes Produkt: was LGIT Consult in Leipzig gebaut hat.',
  };
}

export default async function WorkPage() {
  // Projects are sections on this page (anchored by slug); there is no
  // /work/<slug> route.
  const projects = await getAllProjects();

  return (
      <WorkContent
          projects={projects}
      />
  );
}

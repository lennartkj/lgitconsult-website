import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, getRelatedProjects } from "@/lib/data";
import ProjectContent from "@/components/work/ProjectContent"; // Import the new Client Component

// Generate static paths for all projects
export async function generateStaticParams() {
  const projects = await getAllProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

// Generate static props for each project page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Access params.slug directly. The generateMetadata function handles this safely.
  const projectData = await getProjectBySlug(params.slug);

  if (!projectData) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  return {
    title: `${projectData.project.title} | LGIT Consult`,
    description: projectData.project.description,
  };
}

// Set revalidation time for ISR
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  // You no longer need to await params.slug. This was a temporary bug in earlier Next.js versions.
  // Accessing params.slug directly is now the standard practice.

  // Find the project by slug with MDX content
  const projectData = await getProjectBySlug(params.slug);

  // If project not found, show 404 page
  if (!projectData) {
    notFound();
  }

  // Extract project and MDX source from the response
  const { project, mdxSource } = projectData;

  // Fetch related projects based on the slug.
  const relatedProjects = await getRelatedProjects(params.slug, 3);

  return (
      <ProjectContent
          project={project}
          mdxSource={mdxSource}
          relatedProjects={relatedProjects}
      />
  );
}
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, getRelatedProjects } from "@/lib/data";
import ProjectContent from "@/components/work/ProjectContent";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectData = await getProjectBySlug(slug);

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

export const revalidate = 60;

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const projectData = await getProjectBySlug(slug);

  if (!projectData) {
    notFound();
  }

  const { project, mdxSource } = projectData;
  const relatedProjects = await getRelatedProjects(slug, 3);

  return (
      <ProjectContent
          project={project}
          mdxSource={mdxSource}
          relatedProjects={relatedProjects}
      />
  );
}
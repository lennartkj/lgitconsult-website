import { getAllContent, RawContentItem, getContentWithMDX } from '../content';
import { Project } from './types';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Helper-Funktion zum sicheren Konvertieren von RawContentItem in einen Project-Typ.
const mapToProject = (item: RawContentItem): Project => {
  return item as unknown as Project;
};

// --- Datenabfragefunktionen ---

export const getAllProjects = async (): Promise<Project[]> => {
  const allContent = await getAllContent('projects');
  const allProjects = allContent
      .map(mapToProject)
      .sort((a, b) => a.id - b.id); // Annahme: Projekte haben eine numerische ID für die Sortierung
  return allProjects;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.featured);
};

export const getProjectBySlug = async (slug: string): Promise<{ project: Project, mdxSource: MDXRemoteSerializeResult } | null> => {
  const result = await getContentWithMDX('projects', slug);

  if (!result) {
    return null;
  }

  const project = mapToProject(result.content as RawContentItem);

  return {
    project,
    mdxSource: result.mdxSource,
  };
};

export const getRelatedProjects = async (currentSlug: string, limit: number = 3): Promise<Project[]> => {
  const allProjects = await getAllProjects();
  const currentProject = allProjects.find(project => project.slug === currentSlug);

  if (!currentProject) {
    return [];
  }

  return allProjects
      .filter(project =>
          project.slug !== currentSlug &&
          (project.tags ?? []).some(tag => (currentProject.tags ?? []).includes(tag))
      )
      .slice(0, limit);
};
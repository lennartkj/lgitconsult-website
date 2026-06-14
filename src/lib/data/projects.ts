import { getAllContent, RawContentItem } from '../content';
import { Project } from './types';

// Helper-Funktion zum sicheren Konvertieren von RawContentItem in einen Project-Typ.
const mapToProject = (item: RawContentItem): Project => {
  return item as unknown as Project;
};

// --- Datenabfragefunktionen ---

export const getAllProjects = async (): Promise<Project[]> => {
  const allContent = await getAllContent('projects');
  const allProjects = allContent
      .map(mapToProject)
      .sort((a, b) => a.id - b.id);
  return allProjects;
};

export const getFeaturedProjects = async (): Promise<Project[]> => {
  const allProjects = await getAllProjects();
  return allProjects.filter(project => project.featured);
};

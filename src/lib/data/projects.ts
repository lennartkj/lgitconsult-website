// This file centralizes all project data used throughout the website
// to avoid duplication and ensure consistency
import { getAllProjects as getProjects } from '../content';

export interface Project {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  challenge?: string;
  solution?: string;
  results?: string;
  image: string;
  tags: string[];
  slug: string;
  client?: string;
  year?: string;
  services?: string[];
  website?: string;
  featured: boolean;
}

// Cache for projects
let projectsCache: Project[] = [];

// For client-side rendering, we need to provide a synchronous version
// that returns the cached data or empty array
export const projects: Project[] = projectsCache.length > 0 ? projectsCache : [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution with integrated payment processing and inventory management.",
    fullDescription: "We developed a comprehensive e-commerce platform for a retail client looking to expand their online presence. The solution includes product management, inventory tracking, payment processing with Stripe, and a customer portal for order management.",
    challenge: "The client needed a scalable solution that could handle thousands of products and high traffic during peak shopping seasons.",
    solution: "We built a Next.js application with server-side rendering for SEO and performance, using a headless CMS for content management and Stripe for secure payment processing.",
    results: "The platform increased online sales by 45% in the first quarter after launch, with a 30% improvement in conversion rate compared to their previous solution.",
    image: "/placeholder-project-1.jpg",
    tags: ["Next.js", "Stripe", "Tailwind CSS"],
    slug: "e-commerce-platform",
    client: "RetailCo Inc.",
    year: "2023",
    services: ["Web Development", "UI/UX Design", "Payment Integration"],
    website: "https://example.com",
    featured: true,
  },
  {
    id: 2,
    title: "Corporate Dashboard",
    description: "Data visualization dashboard for enterprise analytics and reporting.",
    fullDescription: "We created a comprehensive analytics dashboard for a corporate client to visualize and analyze their business data across multiple departments.",
    challenge: "The client had data spread across multiple systems and needed a unified view with real-time updates and interactive visualizations.",
    solution: "We developed a React-based dashboard with D3.js visualizations, connected to their existing data sources through a custom API layer.",
    results: "The dashboard reduced reporting time by 75% and enabled data-driven decision making across the organization.",
    image: "/placeholder-project-2.jpg",
    tags: ["React", "D3.js", "TypeScript"],
    slug: "corporate-dashboard",
    client: "Enterprise Solutions Ltd.",
    year: "2022",
    services: ["Web Development", "Data Visualization", "API Integration"],
    website: "https://example.com",
    featured: true,
  },
  // Fallback data in case MDX files are not available
  // Additional projects would be here
];

// Helper function to get all projects
export const getAllProjects = async (): Promise<Project[]> => {
  try {
    // Use the content library to get all projects
    const allProjects = await getProjects();

    // Cache the projects
    projectsCache = allProjects;

    return allProjects;
  } catch (error) {
    console.error('Error fetching projects:', error);
    // Fallback to local data
    return projects;
  }
};

// Helper function to get featured projects
export const getFeaturedProjects = async (): Promise<Project[]> => {
  try {
    // Get all projects and filter for featured ones
    const allProjects = await getAllProjects();
    return allProjects.filter(project => project.featured);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    // Fallback to local data
    return projects.filter(project => project.featured);
  }
};

// Helper function to get a project by slug
export const getProjectBySlug = async (slug: string): Promise<Project | undefined> => {
  try {
    // Get all projects and find the one with the matching slug
    const allProjects = await getAllProjects();
    return allProjects.find(project => project.slug === slug);
  } catch (error) {
    console.error(`Error fetching project with slug ${slug}:`, error);
    // Fallback to local data
    return projects.find(project => project.slug === slug);
  }
};

// Helper function to get related projects (same tags, excluding the current project)
export const getRelatedProjects = async (currentSlug: string, limit: number = 3): Promise<Project[]> => {
  try {
    const currentProject = await getProjectBySlug(currentSlug);

    if (!currentProject) {
      return [];
    }

    // Get all projects
    const allProjects = await getAllProjects();

    // Filter for related projects
    return allProjects
      .filter(project => 
        project.slug !== currentSlug && 
        project.tags.some(tag => currentProject.tags.includes(tag))
      )
      .slice(0, limit);
  } catch (error) {
    console.error(`Error fetching related projects for ${currentSlug}:`, error);
    // Fallback to local data
    const currentProject = projects.find(project => project.slug === currentSlug);
    if (!currentProject) {
      return [];
    }
    return projects
      .filter(project => 
        project.slug !== currentSlug && 
        project.tags.some(tag => currentProject.tags.includes(tag))
      )
      .slice(0, limit);
  }
};

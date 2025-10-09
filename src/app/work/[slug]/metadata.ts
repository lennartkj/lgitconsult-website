import { Metadata } from "next";

// Sample projects data (in a real app, this would come from a CMS or API)
const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    description: "A modern e-commerce solution with integrated payment processing and inventory management.",
    slug: "e-commerce-platform",
  },
  {
    id: 2,
    title: "Corporate Dashboard",
    description: "Data visualization dashboard for enterprise analytics and reporting.",
    slug: "corporate-dashboard",
  },
  // More projects would be defined here
];

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Ensure params is awaited properly
  const slug = params?.slug;
  
  if (!slug) {
    return {
      title: "Project Not Found | LGIT Consult",
      description: "The requested project could not be found.",
    };
  }
  
  const project = projects.find((p) => p.slug === slug);
  
  if (!project) {
    return {
      title: "Project Not Found | LGIT Consult",
      description: "The requested project could not be found.",
    };
  }
  
  return {
    title: `${project.title} | LGIT Consult`,
    description: project.description,
  };
}
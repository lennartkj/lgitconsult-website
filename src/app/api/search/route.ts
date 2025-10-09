import { NextRequest, NextResponse } from "next/server";
import { 
  getAllProjects, 
  getAllPosts, 
  getAllServices 
} from "@/lib/content";

// Define the search result interface
interface SearchResult {
  type: 'project' | 'post' | 'service';
  id: number;
  title: string;
  description: string;
  slug: string;
  url: string;
  tags?: string[];
  category?: string;
  excerpt?: string;
}

// GET handler for search functionality
export async function GET(request: NextRequest) {
  try {
    // Get the URL and parse query parameters
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    // If no query is provided, return an empty array
    if (!query || query.trim() === '') {
      return NextResponse.json([]);
    }

    // Normalize the query for case-insensitive search
    const normalizedQuery = query.toLowerCase();

    // Initialize results array
    let results: SearchResult[] = [];

    // Search in projects if type is not specified or type is 'project'
    if (!type || type === 'project') {
      // Get all projects from the content library
      const projects = await getAllProjects();

      const projectResults = projects
        .filter(project => 
          project.title.toLowerCase().includes(normalizedQuery) ||
          (project.description && project.description.toLowerCase().includes(normalizedQuery)) ||
          (project.tags && project.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
        )
        .map(project => ({
          type: 'project' as const,
          id: project.id,
          title: project.title,
          description: project.description || '',
          slug: project.slug,
          url: `/work/${project.slug}`,
          tags: project.tags
        }));

      results = [...results, ...projectResults];
    }

    // Search in posts if type is not specified or type is 'post'
    if (!type || type === 'post') {
      // Get all posts from the content library
      const posts = await getAllPosts();

      const postResults = posts
        .filter(post => 
          post.title.toLowerCase().includes(normalizedQuery) ||
          post.excerpt.toLowerCase().includes(normalizedQuery) ||
          (post.tags && post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) ||
          (post.category && post.category.toLowerCase().includes(normalizedQuery))
        )
        .map(post => ({
          type: 'post' as const,
          id: post.id,
          title: post.title,
          description: post.excerpt,
          slug: post.slug,
          url: `/journal/${post.slug}`,
          tags: post.tags,
          category: post.category,
          excerpt: post.excerpt
        }));

      results = [...results, ...postResults];
    }

    // Search in services if type is not specified or type is 'service'
    if (!type || type === 'service') {
      // Get all services from the content library
      const services = await getAllServices();

      const serviceResults = services
        .filter(service => 
          service.title.toLowerCase().includes(normalizedQuery) ||
          service.description.toLowerCase().includes(normalizedQuery) ||
          (service.features && service.features.some(feature => feature.toLowerCase().includes(normalizedQuery)))
        )
        .map(service => ({
          type: 'service' as const,
          id: service.id,
          title: service.title,
          description: service.description,
          slug: service.title.toLowerCase().replace(/\s+/g, '-'),
          url: `/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`,
        }));

      results = [...results, ...serviceResults];
    }

    // Apply limit if provided
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        results = results.slice(0, limitNum);
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error('Error handling search request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import {
  getAllProjects,
  getAllPosts,
  getAllServices,
  Project,
  Post,
  Service // Importiere alle Typen, falls sie noch nicht in types.ts sind
} from "@/lib/data"; // Korrekter Importpfad

// Definiere die SearchResult-Schnittstelle zentral (Sollte in types.ts sein, aber hier zur Klarheit definiert)
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
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type');
    const limit = searchParams.get('limit');

    // ... (Logik zur Behandlung leerer Abfragen bleibt gleich) ...
    if (!query || query.trim() === '') {
      return NextResponse.json([]);
    }

    const normalizedQuery = query.toLowerCase();
    let results: SearchResult[] = [];

    // --- Suche in Projekten ---
    if (!type || type === 'project') {
      // FIX: Ruft die korrekt typisierte Funktion aus lib/data auf
      const projects = await getAllProjects();

      const projectResults = projects
          .filter((project: Project) => // Typisierung hinzugefügt
              project.title.toLowerCase().includes(normalizedQuery) ||
              (project.description && project.description.toLowerCase().includes(normalizedQuery)) ||
              (project.tags && project.tags.some(tag => tag.toLowerCase().includes(normalizedQuery)))
          )
          .map((project: Project) => ({
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

    // --- Suche in Posts ---
    if (!type || type === 'post') {
      // FIX: Ruft die korrekt typisierte Funktion aus lib/data auf
      const posts = await getAllPosts();

      const postResults = posts
          .filter((post: Post) => // Typisierung hinzugefügt
              post.title.toLowerCase().includes(normalizedQuery) ||
              post.excerpt.toLowerCase().includes(normalizedQuery) ||
              (post.tags && post.tags.some(tag => tag.toLowerCase().includes(normalizedQuery))) ||
              (post.category && post.category.toLowerCase().includes(normalizedQuery))
          )
          .map((post: Post) => ({
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

    // --- Suche in Services ---
    if (!type || type === 'service') {
      // FIX: Ruft die korrekt typisierte Funktion aus lib/data auf
      const services = await getAllServices();

      const serviceResults = services
          .filter((service: Service) => // Typisierung hinzugefügt
              service.title.toLowerCase().includes(normalizedQuery) ||
              service.description.toLowerCase().includes(normalizedQuery) ||
              (service.features && service.features.some(feature => feature.toLowerCase().includes(normalizedQuery)))
          )
          .map((service: Service) => ({
            type: 'service' as const,
            id: service.id,
            title: service.title,
            description: service.description,
            // SLUG-Erstellung basiert auf dem Titel (wie zuvor)
            slug: service.title.toLowerCase().replace(/\s+/g, '-'),
            url: `/services#${service.title.toLowerCase().replace(/\s+/g, '-')}`,
          }));

      results = [...results, ...serviceResults];
    }

    // ... (Begrenzung der Ergebnisse bleibt gleich) ...
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

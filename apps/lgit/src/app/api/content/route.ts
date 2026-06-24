import { NextRequest, NextResponse } from "next/server";
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getPostsByCategory,
  getAllProjects,
  getFeaturedProjects,
  getAllServices,
  getServiceById,
  getAllPricingTiers,
  getPricingTierById,
  getAllProcessSteps
} from "@repo/content";

// GET handler for fetching content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const slug = searchParams.get('slug');

    // If a slug is provided, handle a single item request
    if (slug) {
      switch (type) {
        case 'posts': {
          const content = await getPostBySlug(slug);
          if (!content) return NextResponse.json({ error: 'Post not found' }, { status: 404 });
          return NextResponse.json(content);
        }
        case 'services': {
          const id = parseInt(slug, 10);
          if (isNaN(id)) return NextResponse.json({ error: 'Service ID must be a number' }, { status: 400 });
          const content = await getServiceById(id);
          if (!content) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
          return NextResponse.json(content);
        }
        case 'pricing': {
          const id = parseInt(slug, 10);
          if (isNaN(id)) return NextResponse.json({ error: 'Pricing tier ID must be a number' }, { status: 400 });
          const content = await getPricingTierById(id);
          if (!content) return NextResponse.json({ error: 'Pricing tier not found' }, { status: 404 });
          return NextResponse.json(content);
        }
        default:
          return NextResponse.json({ error: `Invalid content type: ${type}` }, { status: 400 });
      }
    }

    // Handle all items based on type and filters
    switch (type) {
      case 'projects': {
        const featured = searchParams.get('featured');
        const content = featured === 'true' ? await getFeaturedProjects() : await getAllProjects();
        return NextResponse.json(content);
      }
      case 'posts': {
        const featured = searchParams.get('featured');
        const category = searchParams.get('category');

        if (category) {
          const content = await getPostsByCategory(category);
          return NextResponse.json(content);
        } else if (featured === 'true') {
          const content = await getFeaturedPosts();
          return NextResponse.json(content);
        } else {
          const content = await getAllPosts();
          return NextResponse.json(content);
        }
      }
      case 'services': {
        const content = await getAllServices();
        return NextResponse.json(content);
      }
      case 'pricing': {
        const content = await getAllPricingTiers();
        return NextResponse.json(content);
      }
      case 'process': {
        const content = await getAllProcessSteps();
        return NextResponse.json(content);
      }
      default:
        return NextResponse.json(
            { error: 'Content type is required or invalid' },
            { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error handling content request:', error);
    return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
    );
  }
}
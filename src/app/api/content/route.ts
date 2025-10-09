import { NextRequest, NextResponse } from "next/server";
import { 
  getContentByType, 
  getContentBySlug, 
  ContentType,
  ContentOptions
} from "@/lib/content";

// GET handler for fetching content
export async function GET(request: NextRequest) {
  try {
    // Get the URL and parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as ContentType | null;
    const slug = searchParams.get('slug');
    
    // If no type is provided, return an error
    if (!type) {
      return NextResponse.json(
        { error: 'Content type is required' },
        { status: 400 }
      );
    }
    
    // Validate content type
    const validTypes: ContentType[] = ['projects', 'posts', 'services', 'pricing', 'process'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid content type: ${type}. Valid types are: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }
    
    // Build content options from query parameters
    const options: ContentOptions = {};
    
    // Parse featured parameter
    const featured = searchParams.get('featured');
    if (featured === 'true') {
      options.featured = true;
    }
    
    // Parse limit parameter
    const limit = searchParams.get('limit');
    if (limit) {
      const limitNum = parseInt(limit, 10);
      if (!isNaN(limitNum) && limitNum > 0) {
        options.limit = limitNum;
      }
    }
    
    // Parse category parameter
    const category = searchParams.get('category');
    if (category) {
      options.category = category;
    }
    
    // Parse tag parameter
    const tag = searchParams.get('tag');
    if (tag) {
      options.tag = tag;
    }
    
    // If slug is provided, return a specific content item
    if (slug) {
      const content = await getContentBySlug(type, slug);
      
      if (!content) {
        return NextResponse.json(
          { error: `${type} with slug '${slug}' not found` },
          { status: 404 }
        );
      }
      
      return NextResponse.json(content);
    }
    
    // Otherwise, return all content of the specified type with the given options
    const content = await getContentByType(type, options);
    return NextResponse.json(content);
  } catch (error) {
    console.error('Error handling content request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
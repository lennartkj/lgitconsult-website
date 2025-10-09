import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Project } from './data/projects';
import { Post } from './data/posts';
import { Service } from './data/services';
import { PricingTier, ProcessStep } from './data/services';

// Base interface for all content items
export interface ContentItem {
  slug: string;
  content?: string;
  [key: string]: string | number | boolean | string[] | Date | undefined | null; // For dynamic properties
}

// Define the content types
export type ContentType = 'projects' | 'posts' | 'services' | 'pricing' | 'process';

// Options for content retrieval
export interface ContentOptions {
  featured?: boolean;
  limit?: number;
  category?: string;
  tag?: string;
}

// Get content directory path
export const getContentDirectory = (type: ContentType): string => {
  return path.join(process.cwd(), 'content', type);
};

// Get all content files
export const getContentFiles = (type: ContentType): string[] => {
  const contentDir = getContentDirectory(type);

  try {
    return fs.readdirSync(contentDir)
      .filter(file => path.extname(file) === '.mdx');
  } catch (error) {
    console.error(`Error reading ${type} directory:`, error);
    return [];
  }
};

// Read and parse content file
export const parseContentFile = (type: ContentType, filename: string): ContentItem => {
  const filePath = path.join(getContentDirectory(type), filename);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.mdx$/, '');

    return {
      slug,
      ...data,
      content
    };
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return null;
  }
};

// Get all content of a specific type
export async function getContentByType(type: ContentType, options: ContentOptions = {}): Promise<ContentItem[]> {
  const files = getContentFiles(type);
  const allContent = files
    .map(file => parseContentFile(type, file))
    .filter(Boolean);

  // Apply filters
  let filteredContent = [...allContent];

  // Filter by featured
  if (options.featured) {
    filteredContent = filteredContent.filter(item => item.featured);
  }

  // Filter by category (for posts)
  if (options.category && type === 'posts') {
    filteredContent = filteredContent.filter(item => 
      item.category.toLowerCase() === options.category!.toLowerCase()
    );
  }

  // Filter by tag
  if (options.tag) {
    filteredContent = filteredContent.filter(item => 
      item.tags && item.tags.some((tag: string) => 
        tag.toLowerCase() === options.tag!.toLowerCase()
      )
    );
  }

  // Apply sorting
  if (type === 'posts') {
    // Sort posts by date (newest first)
    filteredContent.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } else if (type === 'process') {
    // Sort process steps by step number
    filteredContent.sort((a, b) => a.step - b.step);
  } else {
    // Sort other content by ID
    filteredContent.sort((a, b) => a.id - b.id);
  }

  // Apply limit
  if (options.limit) {
    filteredContent = filteredContent.slice(0, options.limit);
  }

  return filteredContent;
}

// Get a specific content item by slug
export async function getContentBySlug(type: ContentType, slug: string): Promise<{ content: ContentItem, mdxSource: MDXRemoteSerializeResult } | null> {
  const files = getContentFiles(type);
  const filename = files.find(file => file.replace(/\.mdx$/, '') === slug);

  if (!filename) {
    return null;
  }

  const fileData = parseContentFile(type, filename);

  if (!fileData) {
    return null;
  }

  // Serialize MDX content
  const mdxSource = await serialize(fileData.content);

  // Remove the raw content from the returned data to avoid duplication
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { content, ...metadata } = fileData;

  return {
    content: metadata,
    mdxSource
  };
}

// Helper functions for specific content types

// Projects
export async function getAllProjects(): Promise<Project[]> {
  return getContentByType('projects') as Promise<Project[]>;
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return getContentByType('projects', { featured: true }) as Promise<Project[]>;
}

export async function getProjectBySlug(slug: string): Promise<{ project: Project, mdxSource: MDXRemoteSerializeResult } | null> {
  const result = await getContentBySlug('projects', slug);
  if (!result) return null;

  return {
    project: result.content as Project,
    mdxSource: result.mdxSource
  };
}

export async function getRelatedProjects(currentSlug: string, limit: number = 3): Promise<Project[]> {
  const currentProject = await getProjectBySlug(currentSlug);
  if (!currentProject) return [];

  const allProjects = await getAllProjects();

  return allProjects
    .filter(project => 
      project.slug !== currentSlug && 
      project.tags.some(tag => currentProject.project.tags.includes(tag))
    )
    .slice(0, limit);
}

// Posts
export async function getAllPosts(): Promise<Post[]> {
  return getContentByType('posts') as Promise<Post[]>;
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return getContentByType('posts', { featured: true }) as Promise<Post[]>;
}

export async function getPostBySlug(slug: string): Promise<{ post: Post, mdxSource: MDXRemoteSerializeResult } | null> {
  const result = await getContentBySlug('posts', slug);
  if (!result) return null;

  return {
    post: result.content as Post,
    mdxSource: result.mdxSource
  };
}

export async function getRelatedPosts(currentSlug: string, limit: number = 3): Promise<Post[]> {
  const currentPost = await getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = await getAllPosts();

  return allPosts
    .filter(post => 
      post.slug !== currentSlug && 
      post.category === currentPost.post.category
    )
    .slice(0, limit);
}

export async function getPostsByCategory(category: string): Promise<Post[]> {
  return getContentByType('posts', { category }) as Promise<Post[]>;
}

// Services
export async function getAllServices(): Promise<Service[]> {
  return getContentByType('services') as Promise<Service[]>;
}

export async function getServiceById(id: number): Promise<Service | undefined> {
  const services = await getAllServices();
  return services.find(service => service.id === id);
}

// Pricing
export async function getAllPricingTiers(): Promise<PricingTier[]> {
  return getContentByType('pricing') as Promise<PricingTier[]>;
}

export async function getPricingTierById(id: number): Promise<PricingTier | undefined> {
  const pricingTiers = await getAllPricingTiers();
  return pricingTiers.find(tier => tier.id === id);
}

// Process
export async function getAllProcessSteps(): Promise<ProcessStep[]> {
  return getContentByType('process') as Promise<ProcessStep[]>;
}

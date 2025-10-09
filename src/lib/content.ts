import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Base interface for all content items
export interface RawContentItem {
  slug: string;
  content: string;
  [key: string]: any; // For dynamic frontmatter properties
}

// Define the content types
export type ContentType = 'projects' | 'posts' | 'services' | 'pricing' | 'process';

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

// Read and parse a single content file
export const parseContentFile = (type: ContentType, filename: string): RawContentItem | null => {
  const filePath = path.join(getContentDirectory(type), filename);

  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const slug = filename.replace(/\.mdx$/, '');

    return {
      slug,
      ...data,
      content
    } as RawContentItem;
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return null;
  }
};

// ** NEW FUNCTION **
// Get all raw content of a specific type
export async function getAllContent(type: ContentType): Promise<RawContentItem[]> {
  const files = getContentFiles(type);
  const allContent = files
      .map(file => parseContentFile(type, file))
      .filter(item => item !== null) as RawContentItem[];

  return allContent;
}

// Get a specific content item by slug, and serialize its MDX
export async function getContentWithMDX(type: ContentType, slug: string): Promise<{
  content: Omit<RawContentItem, 'content'>,
  mdxSource: MDXRemoteSerializeResult
} | null> {
  const allFiles = getContentFiles(type);
  const filename = allFiles.find(file => file.replace(/\.mdx$/, '') === slug);

  if (!filename) {
    return null;
  }

  const fileData = parseContentFile(type, filename);

  if (!fileData) {
    return null;
  }

  const mdxSource = await serialize(fileData.content);
  const { content, ...metadata } = fileData;

  return {
    content: metadata,
    mdxSource
  };
}

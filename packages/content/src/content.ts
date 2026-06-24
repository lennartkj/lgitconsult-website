import 'server-only';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Base interface for all content items
export interface RawContentItem {
  slug: string;
  content: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // For dynamic frontmatter properties
}

// Define the content types
export type ContentType = 'projects' | 'posts' | 'services' | 'pricing' | 'process';

// ── Content root resolution ────────────────────────────────────────────────
// The MDX collections live in THIS package (packages/content/content), but the
// data layer is consumed by multiple apps (apps/lgit, apps/rogue). Each app's
// runtime `process.cwd()` is its own directory, so we cannot use cwd directly.
// We resolve the package's own `content/` folder by trying, in order:
//   1. CONTENT_DIR env override (explicit escape hatch),
//   2. a path relative to this compiled module (works in dev + most builds),
//   3. walking up from cwd to find packages/content/content (monorepo fallback).
let cachedRoot: string | null = null;

const candidateRoots = (): string[] => {
  const roots: string[] = [];

  if (process.env.CONTENT_DIR) {
    roots.push(process.env.CONTENT_DIR);
  }

  // Relative to this module's location. After bundling, __dirname points into
  // the build output; `../content` from the package src still resolves in dev.
  try {
    roots.push(path.join(__dirname, '..', 'content'));
    roots.push(path.join(__dirname, 'content'));
  } catch {
    // __dirname may be undefined in some ESM contexts — ignore.
  }

  // Walk up from cwd looking for the workspace content package.
  let dir = process.cwd();
  for (let i = 0; i < 6; i++) {
    roots.push(path.join(dir, 'packages', 'content', 'content'));
    roots.push(path.join(dir, 'content'));
    const parent = path.dirname(dir);
    if (parent === dir) break;
    dir = parent;
  }

  return roots;
};

// A valid content root must actually contain the shared collections — not just
// be a directory. (apps/lgit/content exists but holds only `audits`, so a bare
// existsSync check would wrongly pick it. Validate against marker collections.)
const MARKER_COLLECTIONS = ['projects', 'services', 'posts'];

const isValidRoot = (root: string): boolean => {
  try {
    if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) return false;
    return MARKER_COLLECTIONS.some((c) => {
      const dir = path.join(root, c);
      return fs.existsSync(dir) && fs.statSync(dir).isDirectory();
    });
  } catch {
    return false;
  }
};

const getContentRoot = (): string => {
  if (cachedRoot) return cachedRoot;
  for (const root of candidateRoots()) {
    if (isValidRoot(root)) {
      cachedRoot = root;
      return root;
    }
  }
  // Last resort: cwd/content (original behaviour) so errors are legible.
  cachedRoot = path.join(process.cwd(), 'content');
  return cachedRoot;
};

// Get content directory path
export const getContentDirectory = (type: ContentType): string => {
  return path.join(getContentRoot(), type);
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

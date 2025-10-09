# LGIT Consult Website

This is the official website for LGIT Consult, built with Next.js and featuring a hybrid content management system.

## Getting Started

First, set up the environment variables:

1. Create a `.env.local` file in the root directory
2. Add the following variables:

```
# Decap CMS Configuration
PREVIEW_SECRET=your_preview_secret
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Content Management System

This project uses a Git-based content management approach with:

1. **Decap CMS** - User-friendly admin interface
2. **MDX Files** - Content stored as Markdown/MDX files in the repository
3. **Unified API** - Single API endpoint for all content types

### Architecture Overview

```
src/
  lib/
    content.ts          # Core content library for reading MDX files
    data/
      index.ts          # Unified data access layer
      projects.ts       # Project type definitions
      posts.ts          # Post type definitions
      services.ts       # Service type definitions
  app/
    api/
      content/          # Unified content API
      preview/          # Preview mode API routes
      exit-preview/     # Exit preview mode API routes
      search/           # Search API
  components/
    preview/            # Preview mode components
    search/             # Search components
content/                # MDX content files
  projects/             # Project MDX files
  posts/                # Blog post MDX files
  services/             # Service MDX files
  pricing/              # Pricing tier MDX files
  process/              # Process step MDX files
public/
  admin/                # Decap CMS admin interface
    index.html          # Admin HTML file
    config.yml          # Decap CMS configuration
```

### Key Features

#### 1. Git-based Content Management

All content is stored as MDX files in the repository, providing:
- Version control for content
- Content and code in the same repository
- No external service dependencies
- Simplified deployment process

```typescript
// Example of content retrieval in src/lib/content.ts
export async function getContentBySlug(type: ContentType, slug: string) {
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

  // Remove the raw content from the returned data
  const { content, ...metadata } = fileData;

  return {
    content: metadata,
    mdxSource
  };
}
```

#### 2. Decap CMS Admin Interface

The system includes a user-friendly admin interface for content editors:

- **Admin Panel**: `/admin` route for content management
- **WYSIWYG Editor**: Rich text editing experience
- **Media Management**: Upload and manage images
- **Editorial Workflow**: Draft, review, and publish content

#### 3. Preview Mode

The system supports previewing draft content:

- **Preview API Route**: `/api/preview?secret=xxx&redirect=/path`
- **Exit Preview**: `/api/exit-preview?redirect=/path`
- **Preview Banner**: Visible when in preview mode
- **Preview Context**: React context for managing preview state

#### 4. Unified Content API

A single API endpoint handles all content types:

- **Content API**: `/api/content?type=projects|posts|services&slug=xxx`
- **Filtering**: Support for featured, category, and tag filters
- **Pagination**: Limit parameter for controlling result size

#### 5. Search Functionality

The site includes a global search feature:

- **Search API**: `/api/search?q=query&type=project|post|service`
- **Search Dialog**: Accessible from the navigation bar
- **Real-time Results**: Updates as you type

#### 6. Performance Optimizations

- **Static Generation**: Pages are statically generated at build time
- **Type Safety**: Full TypeScript support for all content types
- **Efficient Data Loading**: Only load what's needed when it's needed

### Content Types

#### Projects

Projects represent case studies and portfolio items:

```typescript
interface Project {
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
```

#### Blog Posts

Blog posts for the journal section:

```typescript
interface Post {
  id: number;
  title: string;
  excerpt: string;
  content?: string;
  date: string;
  author: string;
  authorBio?: string;
  authorImage?: string;
  category: string;
  tags: string[];
  slug: string;
  featured: boolean;
}
```

#### Services

Services offered by the company:

```typescript
interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  cta: string;
}
```

## Deployment

The site is configured for deployment on Vercel:

```bash
vercel
```

For production deployment:

```bash
vercel --prod
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Decap CMS Documentation](https://decapcms.org/docs/intro/)
- [MDX Documentation](https://mdxjs.com/docs/)
- [Gray Matter Documentation](https://github.com/jonschlinkert/gray-matter)

import { getAllContent, RawContentItem, getContentWithMDX } from '../content';
import { Post, Category } from './types';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Helper-Funktion, die ein RawContentItem sicher in einen Post-Typ konvertiert.
// Diese Funktion stellt sicher, dass alle erforderlichen Eigenschaften vorhanden sind.
const mapToPost = (item: RawContentItem): Post => {
  // Eine robustere Implementierung würde hier eine Validierung hinzufügen.
  // Für diesen Fall gehen wir davon aus, dass die MDX-Frontmatter korrekt ist.
  return item as Post;
};

// --- Datenabfragefunktionen ---

export const getAllPosts = async (): Promise<Post[]> => {
  const allContent = await getAllContent('posts');

  // Konvertiere die Rohdaten in den Post-Typ und sortiere sie.
  const allPosts = allContent
      .map(mapToPost)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return allPosts;
};

export const getFeaturedPosts = async (): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.featured);
};

export const getPostBySlug = async (slug: string): Promise<{ post: Post, mdxSource: MDXRemoteSerializeResult } | null> => {
  const result = await getContentWithMDX('posts', slug);

  if (!result) {
    return null;
  }

  // Konvertiere den Metadaten-Teil in den Post-Typ
  const post = mapToPost(result.content as RawContentItem);

  return {
    post,
    mdxSource: result.mdxSource,
  };
};

export const getRelatedPosts = async (currentSlug: string, limit: number = 3): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  const currentPost = allPosts.find(post => post.slug === currentSlug);

  if (!currentPost) {
    return [];
  }

  return allPosts
      .filter(post =>
          post.slug !== currentSlug &&
          post.category === currentPost.category
      )
      .slice(0, limit);
};

export const getPostsByCategory = async (category: string): Promise<Post[]> => {
  const allPosts = await getAllPosts();
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
};

export const getCategories = async (): Promise<Category[]> => {
  const allPosts = await getAllPosts();

  const categoryCounts: Record<string, number> = {};
  allPosts.forEach(post => {
    if (typeof post.category === 'string') {
      // Use original casing — first occurrence wins
      const key = post.category.toLowerCase();
      if (!(key in categoryCounts)) {
        categoryCounts[post.category] = 0;
      }
      // Find the existing key with matching lowercase
      const existingKey = Object.keys(categoryCounts).find(k => k.toLowerCase() === key);
      if (existingKey) {
        categoryCounts[existingKey] = categoryCounts[existingKey] + 1;
      }
    }
  });

  const categories: Category[] = [
    { name: "All", count: allPosts.length },
    ...Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count
    }))
  ];

  return categories;
};
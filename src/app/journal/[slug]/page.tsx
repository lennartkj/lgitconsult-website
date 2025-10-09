import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts, Post } from "@/lib/data";
import PostContent from "@/components/journal/PostContent";
import { MDXRemoteSerializeResult } from "next-mdx-remote";


// Generiere statische Pfade für alle Posts (für Static Site Generation/ISR)
export async function generateStaticParams() {
  const posts = await getAllPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Generiere Metadaten für die Seite
export async function generateMetadata({ params }: { params: { slug: string } }) {
  // Daten holen, um SEO-Metadaten zu generieren
  const postData = await getPostBySlug(params.slug);

  if (!postData) {
    return {
      title: 'Article Not Found',
      description: 'The requested article could not be found.',
    };
  }

  return {
    title: `${postData.post.title} | LGIT Consult Journal`,
    description: postData.post.excerpt,
  };
}

// Setze die Revalidierungszeit (für ISR)
export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // 1. Daten des aktuellen Posts holen (mit MDX Source)
  const postWithMdx = await getPostBySlug(params.slug);

  // 2. 404 behandeln, falls Post nicht gefunden wird
  if (!postWithMdx) {
    notFound();
  }

  // 3. Verwandte Posts holen
  const relatedPosts = await getRelatedPosts(params.slug, 3);

  // 4. Daten für den Client Component vorbereiten
  const { post, mdxSource } = postWithMdx;

  // Render den Client Component mit allen Daten
  return (
      <PostContent
          post={post}
          mdxSource={mdxSource}
          relatedPosts={relatedPosts}
      />
  );
}

import { notFound } from "next/navigation";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/lib/data";
import PostContent from "@/components/journal/PostContent";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postData = await getPostBySlug(slug);

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

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const postWithMdx = await getPostBySlug(slug);

  if (!postWithMdx) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, 3);
  const { post, mdxSource } = postWithMdx;

  return (
      <PostContent
          post={post}
          mdxSource={mdxSource}
          relatedPosts={relatedPosts}
      />
  );
}

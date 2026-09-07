import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@repo/content";
import { getAllContent } from "@repo/content/lib";
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
      title: 'Beitrag nicht gefunden',
      description: 'Der angeforderte Beitrag existiert nicht.',
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
  const [postData, rawPosts] = await Promise.all([getPostBySlug(slug), getAllContent("posts")]);

  if (!postData) {
    notFound();
  }

  // getPostBySlug strips the raw MDX from the post object; the raw item still
  // carries it. The body is compiled here on the server (next-mdx-remote/rsc)
  // and handed to the client component as a ready React tree; the raw text
  // also feeds the table of contents.
  const raw = rawPosts.find((item) => item.slug === slug);
  const content = raw?.content ?? "";
  const post = { ...postData.post, content };
  const relatedPosts = await getRelatedPosts(slug, 3);
  const body = <MDXRemote source={content} />;

  return (
      <PostContent
          post={post}
          body={body}
          relatedPosts={relatedPosts}
      />
  );
}

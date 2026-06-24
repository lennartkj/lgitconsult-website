import { Metadata } from "next";

// Sample blog posts data (in a real app, this would come from a CMS or API)
const posts = [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt: "Explore the emerging technologies and methodologies that will shape web development in the coming year.",
    tags: ["Next.js", "React", "Web Trends"],
    slug: "future-web-development-trends-2024",
    author: "LGIT Consult",
    date: "January 15, 2024",
    category: "Web Development",
  },
  {
    id: 2,
    title: "How to Optimize Your Website for Core Web Vitals",
    excerpt: "A comprehensive guide to improving your site's performance metrics and boosting your search rankings.",
    tags: ["SEO", "Performance", "Core Web Vitals"],
    slug: "optimize-website-core-web-vitals",
    author: "LGIT Consult",
    date: "December 10, 2023",
    category: "Performance",
  },
  // More posts would be defined here
];

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  // Ensure params is awaited properly
  const slug = params?.slug;

  if (!slug) {
    return {
      title: "Article Not Found | LGIT Consult",
      description: "The requested article could not be found.",
    };
  }

  const post = posts.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | LGIT Consult",
      description: "The requested article could not be found.",
    };
  }

  return {
    title: `${post.title} | LGIT Consult Journal`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
  };
}

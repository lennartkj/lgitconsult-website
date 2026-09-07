import { getAllPosts, getCategories } from "@repo/content";
import JournalContent from "@/components/journal/JournalContent";
import { Post, Category } from "@repo/content/types";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Journal | LGIT Consult',
    description: 'Notizen zu Technik, Gestaltung und Handwerk aus Leipzig. Die Beiträge sind auf Englisch.',
  };
}

export default async function JournalPage() {
  // Fetch all necessary data in parallel on the server
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  const featuredPosts = allPosts.filter((post: Post) => post.featured);

  return (
      <JournalContent
          featuredPosts={featuredPosts}
          allPosts={allPosts as Post[]}
          categories={categories as Category[]}
      />
  );
}

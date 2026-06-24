import { getAllPosts, getCategories } from "@repo/content";
// Korrigierter Import: Die Übersichtsseite nutzt JournalContent
import JournalContent from "@/components/journal/JournalContent";
import { Post, Category } from "@repo/content/types"; // Importiere Typen, falls benötigt

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Journal & Insights | LGIT Consult',
    description: 'Explore our latest articles, case studies, and insights on web development, technology, and design trends.',
  };
}

export default async function JournalPage() {
  // Fetch all necessary data in parallel on the server
  const [allPosts, categories] = await Promise.all([
    getAllPosts(),
    getCategories(),
  ]);

  // Filtern für den Featured-Bereich
  const featuredPosts = allPosts.filter((post: Post) => post.featured);

  // Übergabe aller Daten an den Client Component.
  return (
      <JournalContent
          featuredPosts={featuredPosts}
          allPosts={allPosts as Post[]} // Übergabe der gesamten Liste für die client-seitige Filterung
          categories={categories as Category[]}
      />
  );
}

import AboutContent from "@/components/about/AboutContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Über uns | LGIT Consult',
    description: 'LGIT Consult ist das Büro von Lennart Gründel in der Leipziger Mädler-Passage: Websites, Webanwendungen und KI-Integration zum Festpreis, mit festen Abnahmepunkten, in Betrieb übergeben.',
  };
}

export default function AboutPage() {
  return <AboutContent />;
}

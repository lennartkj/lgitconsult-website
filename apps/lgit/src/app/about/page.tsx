import AboutContent from "@/components/about/AboutContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'About LGIT Consult',
    description: 'Learn about our mission, values, and team of passionate IT professionals.',
  };
}

export default function AboutPage() {
  // Da keine Daten geholt werden müssen, kann die Komponente direkt gerendert werden.
  return <AboutContent />;
}
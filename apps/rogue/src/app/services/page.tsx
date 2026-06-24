import { getServicesByPillar, getAllProcessSteps } from "@repo/content";
import ServicesContent from "@/components/services/ServicesContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Digital',
    description: 'Web, product, design and IT consulting — the technical backbone behind the work, built so creative scales instead of breaking.',
    keywords: [
      'web development Europe',
      'product engineering',
      'UI UX design',
      'IT consulting',
      'digital agency Berlin',
    ],
  };
}

export default async function ServicesPage() {
  const [services, processSteps] = await Promise.all([
    getServicesByPillar("digital"),
    getAllProcessSteps(),
  ]);

  return (
      <ServicesContent
          services={services}
          processSteps={processSteps}
      />
  );
}

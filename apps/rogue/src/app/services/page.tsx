import { getServicesByPillar, getAllProcessSteps } from "@repo/content";
import ServicesContent from "@/components/services/ServicesContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Digital Services | LGIT Consult',
    description: 'Web development, mobile apps, UI/UX design, and IT consulting. The technical backbone for your digital presence.',
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

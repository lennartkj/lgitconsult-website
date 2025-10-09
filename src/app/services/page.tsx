import { getAllServices, getAllProcessSteps, getAllPricingTiers } from "@/lib/data";
import ServicesContent from "@/components/services/ServicesContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Our Services & Pricing | LGIT Consult',
    description: 'Explore our full range of services, detailed process steps, and transparent pricing plans for web development and consulting.',
  };
}

export default async function ServicesPage() {
  // Fetch all necessary data in parallel on the server
  const [services, processSteps, pricingTiers] = await Promise.all([
    getAllServices(),
    getAllProcessSteps(),
    getAllPricingTiers(),
  ]);

  return (
      <ServicesContent
          services={services}
          processSteps={processSteps}
          pricingTiers={pricingTiers}
      />
  );
}

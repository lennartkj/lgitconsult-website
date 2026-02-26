import { getServicesByPillar } from "@/lib/data";
import CreativeContent from "@/components/creative/CreativeContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Creative Consulting | LGIT Consult',
    description: 'Campaign design, photography, physical media, music and video production, and creative direction. For artists, brands, and advertisers.',
  };
}

export default async function CreativePage() {
  const services = await getServicesByPillar("creative");

  return <CreativeContent services={services} />;
}

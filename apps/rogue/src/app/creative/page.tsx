import { getServicesByPillar } from "@repo/content";
import CreativeContent from "@/components/creative/CreativeContent";

// Set revalidation time for ISR
export const revalidate = 60;

// Generate SEO metadata
export async function generateMetadata() {
  return {
    title: 'Creative',
    description: 'Art direction, film, sound and physical media for brands and artists across Europe. Built to detonate first and explain later. A European creative network, run out of Leipzig.',
    keywords: [
      'creative agency Europe',
      'art direction',
      'film production',
      'music video production',
      'brand creative direction',
      'creative network Berlin',
    ],
  };
}

export default async function CreativePage() {
  const services = await getServicesByPillar("creative");

  return <CreativeContent services={services} />;
}

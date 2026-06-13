import { notFound } from "next/navigation";
import { getAllContent, getContentWithMDX } from "@/lib/content";
import { Service } from "@/lib/data/types";
import ServiceDetail from "@/components/services/ServiceDetail";

export const revalidate = 60;

export async function generateStaticParams() {
  const services = await getAllContent("services");
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getContentWithMDX("services", slug);

  if (!result) {
    return {
      title: "Service Not Found | LGIT Consult",
      description: "The requested service could not be found.",
    };
  }

  const service = result.content as unknown as Service;
  return {
    title: `${service.title} | LGIT Consult`,
    description: service.description,
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getContentWithMDX("services", slug);

  if (!result) {
    notFound();
  }

  const service = result.content as unknown as Service;
  return <ServiceDetail service={service} mdxSource={result.mdxSource} />;
}

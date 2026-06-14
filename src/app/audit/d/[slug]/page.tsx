import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuditDeliverable from "@/components/audit/AuditDeliverable";
import { getAudit, getAuditSlugs } from "@/lib/audit/deliverables";

// Only deliverables that exist at build time render; any other slug → 404.
// Private by unlisted slug + noindex (see generateMetadata). A passphrase gate
// can be added later if a deliverable needs more than obscurity.
export const dynamicParams = false;

export function generateStaticParams() {
  return getAuditSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const audit = getAudit(slug);
  return {
    title: audit
      ? `The Audit · Patina — For ${audit.client}`
      : "The Audit · Patina",
    description: "A private Audit deliverable.",
    robots: { index: false, follow: false },
  };
}

export default async function AuditDeliverablePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const audit = getAudit(slug);
  if (!audit) notFound();
  return <AuditDeliverable audit={audit} />;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import VerdictCard from "@/components/eye/VerdictCard";
import { getVerdict, getVerdictSlugs } from "@/lib/verdict/verdicts";

// Only published verdicts get a route; any other slug → 404. Public + indexable
// (this is proof, meant to be shared). See docs/products/patina/PROOF_ENGINE.md.
export const dynamicParams = false;

export function generateStaticParams() {
  return getVerdictSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = getVerdict(slug);
  if (!v) return { title: "The Eye" };
  const title = `${v.call.label} — the tell`;
  return {
    title,
    description: v.verdict,
    openGraph: {
      title: `${title} · Patina`,
      description: v.verdict,
      images: [{ url: v.call.image }],
    },
  };
}

export default async function VerdictPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = getVerdict(slug);
  if (!v) notFound();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <Link href="/eye" className="ac-link font-mono text-[11px] uppercase tracking-[0.2em]">
          ← The Eye
        </Link>

        <div className="mt-12">
          <VerdictCard verdict={v} variant="full" trackOnMount />
        </div>

        {/* CTA into the funnel */}
        <div className="mt-20 border-t border-fg/15 pt-12 max-w-lg">
          <p className="text-fg/70 text-lg leading-relaxed">
            The same eye, turned on your world.
          </p>
          <Link
            href="/audit"
            className="ac-btn mt-8 inline-block font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4"
          >
            Where you stand ▸
          </Link>
        </div>
      </div>
    </div>
  );
}

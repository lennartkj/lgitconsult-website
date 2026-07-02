import type { Metadata } from "next";
import Link from "next/link";
import VerdictCard from "@/components/eye/VerdictCard";
import { getVerdicts } from "@/lib/verdict/verdicts";

// The Eye — the public, indexable proof library. Awareness loud, access scarce:
// this is the one Patina surface meant to be found and shared. It exposes only
// objects (public/settled), never a client. See docs/products/patina/PROOF_ENGINE.md.
export const metadata: Metadata = {
  title: "The Eye",
  description:
    "The eye, at work. Public objects, side by side — the right call and the expensive mistake, and the one line that separates them.",
  openGraph: {
    title: "The Eye · Patina",
    description:
      "The right call beside the expensive mistake — and the one line that separates them.",
  },
};

export default function EyeIndexPage() {
  const verdicts = getVerdicts();

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="pt-24 md:pt-32 pb-16 md:pb-24">
          <Link href="/audit" className="ac-link font-mono text-[11px] uppercase tracking-[0.2em]">
            Patina
          </Link>
          <h1 className="mt-8 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">
            The Eye
          </h1>
          <p className="mt-8 max-w-xl text-fg/60 text-lg leading-relaxed">
            The eye, at work. Public objects, side by side — the right call and the
            expensive mistake, and the one line that separates them. No clients here;
            only the market&apos;s own pieces.
          </p>
        </header>

        {/* The library */}
        {verdicts.length ? (
          <div className="space-y-24 md:space-y-32 pb-24">
            {verdicts.map((v) => (
              <Link
                key={v.slug}
                href={`/eye/${v.slug}`}
                className="block group"
                aria-label={`${v.call.label} versus ${v.tell.label}`}
              >
                <VerdictCard verdict={v} variant="full" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="pb-24 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40">
            The library is being assembled.
          </p>
        )}

        {/* Footer CTA into the funnel */}
        <footer className="border-t border-fg/15 py-16 md:py-24">
          <p className="max-w-lg text-fg/70 text-lg leading-relaxed">
            The same eye, turned on your world — what to keep, what gives you away,
            what to acquire next.
          </p>
          <Link
            href="/audit"
            className="ac-btn mt-8 inline-block font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4"
          >
            Where you stand ▸
          </Link>
        </footer>
      </div>
    </div>
  );
}

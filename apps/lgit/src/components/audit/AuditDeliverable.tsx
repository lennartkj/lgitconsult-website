import React from "react";

export interface StarterItem {
  piece: string;
  where: string;
  why: string;
  range?: string;
}

export interface AuditData {
  client: string;
  date: string;
  summary: string; // the one-line read
  works: string[];
  lose: string[];
  direction: string[]; // paragraphs
  starter: StarterItem[];
}

/**
 * The Audit deliverable — the keepable document a client receives, in the Patina
 * register. Rendered from structured data (operator-approved output of the
 * AI pre-process). See docs/playbooks/curation-offer.md + taste-rubric.md.
 */
export default function AuditDeliverable({ audit }: { audit: AuditData }) {
  return (
    <article>
      {/* Cover */}
      <section className="py-32 md:py-48 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-9">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">
                The Audit · {audit.date}
              </span>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.95]">
                For {audit.client}
              </h1>
              <p className="mt-8 max-w-2xl text-fg/60 text-lg leading-relaxed">
                {audit.summary}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 001 — The Read */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-12">
            001 — The Read
          </span>
          <div className="grid grid-cols-12 gap-12">
            <div className="col-span-12 md:col-span-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-4">
                What works
              </h3>
              <ul className="border-t border-fg/10">
                {audit.works.map((item, i) => (
                  <li key={i} className="py-4 border-b border-fg/10 text-fg/70 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-12 md:col-span-6">
              <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-4">
                What to lose
              </h3>
              <ul className="border-t border-fg/10">
                {audit.lose.map((item, i) => (
                  <li key={i} className="py-4 border-b border-fg/10 text-fg/70 leading-relaxed">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 002 — The Direction */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-3">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-8">
                002 — The Direction
              </span>
            </div>
            <div className="col-span-12 md:col-span-8 md:col-start-5">
              <div className="space-y-6 max-w-prose">
                {audit.direction.map((para, i) => (
                  <p key={i} className="text-fg/70 text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 003 — The Starter List */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-12">
            003 — The Starter List
          </span>
          <div className="border-t border-fg/15">
            {audit.starter.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 py-8 border-b border-fg/10">
                <div className="col-span-12 md:col-span-1 font-mono text-[11px] text-fg/30 pt-1">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div className="col-span-12 md:col-span-6">
                  <h4 className="text-fg font-medium tracking-tight">{item.piece}</h4>
                  <p className="mt-2 text-fg/60 text-sm leading-relaxed">{item.why}</p>
                </div>
                <div className="col-span-12 md:col-span-5 md:text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40">
                    {item.where}
                  </p>
                  {item.range && (
                    <p className="mt-1 font-mono text-sm text-fg/70">{item.range}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <p className="mt-16 max-w-md text-fg/40 text-sm leading-relaxed font-mono uppercase tracking-[0.1em] text-[11px]">
            Private to {audit.client}. The eye is on call when you are ready to acquire.
          </p>
        </div>
      </section>
    </article>
  );
}

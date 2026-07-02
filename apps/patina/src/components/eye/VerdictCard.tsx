"use client";

import React, { useEffect, useState } from "react";
import { track } from "@/lib/track";

/**
 * A "verdict" — one reasoning-contrast artifact for Patina's Proof Engine:
 * the right call beside the expensive mistake (or the real piece beside the
 * market's fake), with a single one-line why. Public/settled objects only —
 * never a client, never a live stranger, never the operator's own collection.
 * See docs/products/patina/PROOF_ENGINE.md.
 *
 * The `Verdict` type is defined here (client-safe) and imported by the
 * server-only loader (src/lib/verdict/verdicts.ts) — mirrors the AuditData /
 * deliverables.ts split, so nothing pulls `server-only` into the client bundle.
 */

export interface VerdictObject {
  /** e.g. "Leica M6 · 0.72" */
  label: string;
  /** e.g. "brassed, used" */
  sub?: string;
  /** /eye/<slug>/call.jpg — hands + object, never a face. */
  image: string;
  alt: string;
}

export interface Verdict {
  slug: string;
  /** The "THE EYE / 004" index. */
  order: number;
  domain: "cameras" | "design" | "watches" | "fashion";
  mode: "contrast" | "forensic";
  /** The right call. */
  call: VerdictObject;
  /** The expensive mistake / the fake. */
  tell: VerdictObject;
  /** The one line — the whole eye compressed. ≤200 chars (enforced in the loader). */
  verdict: string;
  /** Forensic mode: the checkable fact (serial ledger, year, hallmark, house). */
  provenance?: string | null;
  /** For public/settled lots: where it sold, so the claim is verifiable. */
  source?: { house?: string; lot?: string; url?: string } | null;
  published: boolean;
  /** Exactly one featured verdict seeds the free-test reveal. */
  featured?: boolean;
}

const labelCls =
  "font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40";
const microCls =
  "font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30";

/** One framed object image, with a graceful placeholder until the operator
 *  drops the real photograph in /public/eye/<slug>/. */
function ObjectFigure({ obj, kind }: { obj: VerdictObject; kind: "CALL" | "TELL" }) {
  const [errored, setErrored] = useState(false);
  return (
    <figure>
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-muted border border-fg/10">
        {!errored ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={obj.image}
            alt={obj.alt}
            loading="lazy"
            onError={() => setErrored(true)}
            className="h-full w-full object-cover grayscale contrast-[1.03]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg/25">
              photo pending
            </span>
          </div>
        )}
      </div>
      <figcaption className="mt-3">
        <span className={microCls}>{kind === "CALL" ? "The call" : "The tell"}</span>
        <p className="mt-1 text-fg font-medium tracking-tight leading-snug">{obj.label}</p>
        {obj.sub ? <p className="text-fg/50 text-sm leading-snug">{obj.sub}</p> : null}
      </figcaption>
    </figure>
  );
}

export default function VerdictCard({
  verdict,
  variant = "full",
  trackOnMount = false,
}: {
  verdict: Verdict;
  variant?: "full" | "inline";
  trackOnMount?: boolean;
}) {
  useEffect(() => {
    if (trackOnMount) {
      track("verdict_view", { slug: verdict.slug, domain: verdict.domain });
    }
  }, [trackOnMount, verdict.slug, verdict.domain]);

  const idx = String(verdict.order).padStart(3, "0");

  return (
    <article className={variant === "full" ? "max-w-3xl" : "max-w-xl"}>
      {/* Top rule: THE EYE / NNN · domain */}
      <div className="flex items-baseline justify-between border-t border-fg/15 pt-4">
        <span className={labelCls}>The Eye / {idx}</span>
        <span className={labelCls}>
          ⌖ {verdict.domain}
          {verdict.mode === "forensic" ? " · forensic" : ""}
        </span>
      </div>

      {/* Call | Tell — stacks on mobile, side-by-side from sm up */}
      <div className={`mt-8 grid grid-cols-1 sm:grid-cols-2 ${variant === "full" ? "gap-8" : "gap-5"}`}>
        <ObjectFigure obj={verdict.call} kind="CALL" />
        <ObjectFigure obj={verdict.tell} kind="TELL" />
      </div>

      {/* The one line */}
      <div className="mt-8 border-t border-fg/10 pt-6">
        <p className={`${variant === "full" ? "text-xl md:text-2xl" : "text-lg"} font-light tracking-tight leading-snug text-fg/90`}>
          {verdict.verdict}
        </p>

        {verdict.provenance ? (
          <div className="mt-5">
            <span className={microCls}>Provenance —</span>
            <p className="mt-1 text-fg/60 text-sm leading-relaxed">{verdict.provenance}</p>
          </div>
        ) : null}

        {verdict.source && (verdict.source.house || verdict.source.lot) ? (
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.15em] text-fg/35">
            {[verdict.source.house, verdict.source.lot].filter(Boolean).join(" · ")}
          </p>
        ) : null}
      </div>

      {variant === "full" ? (
        <p className="mt-10 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/30">
          patina ⌐
        </p>
      ) : null}
    </article>
  );
}

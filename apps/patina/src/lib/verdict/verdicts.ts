import "server-only";
import fs from "fs";
import path from "path";
import { z } from "zod";
import type { Verdict } from "@/components/eye/VerdictCard";

/**
 * The Proof Engine — reasoning-contrast "verdicts", stored as JSON in
 * content/verdicts/<slug>.json and rendered publicly at /eye + /eye/<slug>.
 *
 * The operator picks the pair (the taste call — the irreducible 20%), the AI
 * drafts the reasoning + provenance (src/lib/verdict/draft.ts), the operator
 * edits to the final one line, then drops a JSON here + images in
 * public/eye/<slug>/. Content-as-code, versioned with the site. No DB.
 * See docs/products/patina/PROOF_ENGINE.md.
 */

const VerdictObjectSchema = z.object({
  label: z.string(),
  sub: z.string().optional(),
  image: z.string(),
  alt: z.string(),
});

const VerdictSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9-]+$/),
    order: z.number(),
    domain: z.enum(["cameras", "design", "watches", "fashion"]),
    mode: z.enum(["contrast", "forensic"]),
    call: VerdictObjectSchema,
    tell: VerdictObjectSchema,
    // The one-line discipline: density, not length. Reject overlong at validation.
    verdict: z.string().max(200),
    provenance: z.string().nullish(),
    source: z
      .object({
        house: z.string().optional(),
        lot: z.string().optional(),
        url: z.string().optional(),
      })
      .nullish(),
    published: z.boolean(),
    featured: z.boolean().optional(),
  })
  // Forensic mode's whole point is the checkable fact — require it.
  .refine((v) => v.mode !== "forensic" || !!v.provenance, {
    message: "forensic verdicts must include a provenance fact",
    path: ["provenance"],
  }) satisfies z.ZodType<Verdict>;

const VERDICTS_DIR = path.join(process.cwd(), "content", "verdicts");

function readAll(): Verdict[] {
  let files: string[];
  try {
    files = fs.readdirSync(VERDICTS_DIR).filter((f) => path.extname(f) === ".json");
  } catch {
    return []; // dir may not exist yet
  }
  const out: Verdict[] = [];
  for (const f of files) {
    try {
      const raw = fs.readFileSync(path.join(VERDICTS_DIR, f), "utf8");
      const parsed = VerdictSchema.safeParse(JSON.parse(raw));
      if (parsed.success) out.push(parsed.data);
      else console.error(`Invalid verdict "${f}":`, parsed.error.flatten());
    } catch {
      // skip missing/unparseable
    }
  }
  return out;
}

/** Published verdicts, newest-index first (the public /eye library). */
export function getVerdicts(): Verdict[] {
  return readAll()
    .filter((v) => v.published)
    .sort((a, b) => b.order - a.order);
}

/** Slugs of published verdicts — for generateStaticParams (unpublished get no route). */
export function getVerdictSlugs(): string[] {
  return getVerdicts().map((v) => v.slug);
}

/** One published verdict by slug (path-traversal guarded), or null. */
export function getVerdict(slug: string): Verdict | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  return getVerdicts().find((v) => v.slug === slug) ?? null;
}

/** The one featured verdict that seeds the free-test reveal (last wins if >1). */
export function getFeaturedVerdict(): Verdict | null {
  const featured = getVerdicts().filter((v) => v.featured);
  if (featured.length > 1) {
    console.warn(`More than one featured verdict (${featured.length}); using the highest order.`);
  }
  return featured[0] ?? null;
}

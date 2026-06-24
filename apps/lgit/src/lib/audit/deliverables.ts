import "server-only";
import fs from "fs";
import path from "path";
import { z } from "zod";
import type { AuditData } from "@/components/audit/AuditDeliverable";

/**
 * Per-client Audit deliverables, stored as JSON in content/audits/<slug>.json.
 *
 * The operator refines the AI first-pass draft (emailed by /api/audit) into an
 * AuditData JSON, drops it in content/audits/, and it renders at /audit/d/<slug>
 * — a private (noindex, unlisted-slug) page in the Patina register. No DB; the
 * deliverable is content-as-code, versioned with the site. See
 * docs/products/patina/{BUILD,DECISIONS}.md.
 */

const StarterItemSchema = z.object({
  piece: z.string(),
  where: z.string(),
  why: z.string(),
  range: z.string().optional(),
});

const AuditDataSchema = z.object({
  client: z.string(),
  date: z.string(),
  summary: z.string(),
  works: z.array(z.string()),
  lose: z.array(z.string()),
  direction: z.array(z.string()),
  starter: z.array(StarterItemSchema),
});

const AUDITS_DIR = path.join(process.cwd(), "content", "audits");

export function getAuditSlugs(): string[] {
  try {
    return fs
      .readdirSync(AUDITS_DIR)
      .filter((f) => path.extname(f) === ".json")
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return []; // dir may not exist yet — no deliverables published
  }
}

export function getAudit(slug: string): AuditData | null {
  // Only simple slugs — blocks path traversal and odd filenames.
  if (!/^[a-z0-9-]+$/i.test(slug)) return null;

  const filePath = path.join(AUDITS_DIR, `${slug}.json`);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const parsed = AuditDataSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      console.error(
        `Invalid audit deliverable "${slug}":`,
        parsed.error.flatten()
      );
      return null;
    }
    return parsed.data;
  } catch {
    return null; // missing or unparseable
  }
}

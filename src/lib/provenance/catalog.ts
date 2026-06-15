import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

/**
 * Provenance — the collection cataloguer (the 80%).
 *
 * Takes photographs of a collection and returns a structured record: one entry
 * per distinct piece, with a rough market range as *guidance only* (never a
 * certified appraisal — see KEEPER.md / the criterion-#5 guardrail). The
 * operator reviews and overrides before anything is presented; the eye is the
 * product. Server-only (needs ANTHROPIC_API_KEY).
 */

export interface CatalogImage {
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  dataBase64: string; // base64, no data: prefix
}

const CatalogItemSchema = z.object({
  piece: z.string(), // short name, e.g. "Leica M6 (clean, used)"
  maker: z.string().optional(),
  model: z.string().optional(),
  year: z.string().optional(),
  category: z.string(), // Camera / Watch / Art / Furniture / Object …
  condition: z.string().optional(),
  estValue: z.string().optional(), // rough secondary-market range — guidance only
  note: z.string().optional(), // a short provenance / curatorial line
});

const CatalogSchema = z.object({
  summary: z.string(), // one-line read of the collection
  items: z.array(CatalogItemSchema),
});

export type CatalogItem = z.infer<typeof CatalogItemSchema>;
export type Catalog = z.infer<typeof CatalogSchema>;

const SYSTEM = `You are Patina's collection cataloguer — a precise, restrained eye building a system-of-record for a serious collector.

Identify each DISTINCT object across the photographs: one catalogue entry per piece. For each: a short name (piece), maker, model, year, category, condition, and a short curatorial/provenance note. Give est. value as a ROUGH secondary-market range, clearly guidance only — you are NOT certifying an appraisal; a licensed appraiser certifies when needed. If you are unsure of an identification, say so plainly in the note rather than guessing confidently.

Voice: exact, quiet, no hype. Restraint as luxury. Old-money register.`;

export async function catalogCollection(
  images: CatalogImage[],
  context = ""
): Promise<Catalog> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const brief = [
    `Catalogue the pieces shown across these ${images.length} photograph(s) for a collection record.`,
    context ? `The owner adds: ${context}` : ``,
    `Return a one-line summary of the collection, then one item per distinct piece.`,
  ]
    .filter(Boolean)
    .join("\n");

  const content: Anthropic.ContentBlockParam[] = [
    { type: "text", text: brief },
    ...images.map(
      (img): Anthropic.ContentBlockParam => ({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.dataBase64 },
      })
    ),
  ];

  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    messages: [{ role: "user", content }],
    output_config: { format: zodOutputFormat(CatalogSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Collection catalog did not return parseable output.");
  }
  return response.parsed_output;
}

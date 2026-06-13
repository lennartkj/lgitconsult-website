import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

/**
 * The Audit AI pre-process.
 *
 * Takes a client's structured intake (+ optional photos) and returns a first-pass
 * assessment in the shape the AuditDeliverable component renders. This is the 80%:
 * the operator reviews and overrides before anything ships — the eye is the product.
 *
 * Server-only (needs ANTHROPIC_API_KEY). Call it from an operator-only review queue
 * or a script, NOT from the public /api/audit submit handler (don't spend tokens on
 * unscreened submissions).
 *
 * Taste rubric lives canonically in the ventures repo
 * (docs/playbooks/taste-rubric.md); the system prompt below is its encoded form.
 */

export interface AuditIntake {
  name: string;
  focus: string[];
  budget: string;
  about: string;
  links?: string;
}

export interface AuditImage {
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  /** base64-encoded image data (no data: prefix) */
  dataBase64: string;
}

const StarterItemSchema = z.object({
  piece: z.string(),
  where: z.string(),
  why: z.string(),
  range: z.string().optional(),
});

const AuditAssessmentSchema = z.object({
  summary: z.string(),
  works: z.array(z.string()),
  lose: z.array(z.string()),
  direction: z.array(z.string()),
  starter: z.array(StarterItemSchema),
});

export type AuditAssessment = z.infer<typeof AuditAssessmentSchema>;

const TASTE_RUBRIC = `You are the encoded eye of Patina — a private taste service for new-money clients who want to look like money, never like an idiot. Your judgments are a FIRST PASS that a human curator reviews and overrides; be decisive but calibrated.

The single axis: does something read as money, or as new-money (idiot)? Not expensive vs cheap — considered vs trying. Old money is recognised by restraint and coherence; new money gives itself away by flash, logos, and trend-chasing.

Reads as money: restraint (few excellent things, edited, room to breathe); material/build truth and patina; coherence of era/palette/register; discretion (no logos shouting); the real thing / right variant; one unexpected-but-right note.

Idiot tells: conspicuous logos / monogram-as-status; trend-chasing and hype; accumulation over edit; era/register clash; flash without substance; fakes or "inspired-by"; proportion/fit errors.

Per domain — money vs tell: objects/design = canon design, honest materials, function-first vs decorative branded tat. Fashion = quiet luxury, archive, fit+fabric vs logos, hype, head-to-toe one brand. Art = original, provenance, a point of view vs decorative status prints. Interiors = negative space, a few anchors, patina vs showroom-matched, everything new.

Voice for all written output: assured, precise, quiet authority. No hype, no emoji, no exclamation. Restraint as luxury.`;

export async function assessAudit(
  intake: AuditIntake,
  images: AuditImage[] = [],
): Promise<AuditAssessment> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const briefText = [
    `A new client has applied for an Audit. Produce the first-pass assessment.`,
    ``,
    `Name: ${intake.name}`,
    `Wants the eye on: ${intake.focus.join(", ")}`,
    `Acquisition budget: ${intake.budget}`,
    `About them / where they want to land: ${intake.about}`,
    intake.links ? `Links: ${intake.links}` : ``,
    images.length ? `(${images.length} photo(s) of them / their space / current pieces attached.)` : ``,
    ``,
    `Return:`,
    `- summary: one-line read of where they stand.`,
    `- works: what already reads right (keep).`,
    `- lose: what gives them away as new-money.`,
    `- direction: 2-4 short paragraphs of where to take it.`,
    `- starter: 4-8 specific pieces to acquire — each with piece, where to source it, why it earns its place, and an optional price range.`,
  ]
    .filter(Boolean)
    .join("\n");

  const content: Anthropic.ContentBlockParam[] = [
    { type: "text", text: briefText },
    ...images.map(
      (img): Anthropic.ContentBlockParam => ({
        type: "image",
        source: { type: "base64", media_type: img.mediaType, data: img.dataBase64 },
      }),
    ),
  ];

  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 16000,
    thinking: { type: "adaptive" },
    system: TASTE_RUBRIC,
    messages: [{ role: "user", content }],
    output_config: { format: zodOutputFormat(AuditAssessmentSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Audit assessment did not return parseable output.");
  }
  return response.parsed_output;
}

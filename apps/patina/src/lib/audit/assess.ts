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
  /** Derived taste archetype from the intake test (e.g. "The Heir"). */
  tasteType?: string;
  /** Childhood-sweet answer — human texture for the eye. */
  sweet?: string;
  /** What they saw in the randomized pattern (Rorschach-style). */
  seen?: string;
  /** F1 · why-now — the event that brought them now (the highest-leverage field). */
  trigger?: string;
  /** F3 · the oblique tell — the last thing they bought and showed no one. */
  oblique?: string;
  /** R2 · who they most want to feel at ease around (aspiration-framed; status is relational). */
  audience?: string;
  /** R6 · the piece/choice they've been wondering about (the prime `lose` candidate, their words). */
  unsurePiece?: string;
  /** R4 · acquisition budget band (anchors `starter` ranges). */
  budgetBand?: string;
  /** Goal · how they want to feel + who they want to feel easy around (the forward-looking aim). */
  goal?: string;
  /** Occasion · the moment this is for (a move, an evening, a new chapter) + roughly when. */
  occasion?: string;
}

export interface AuditImage {
  mediaType: "image/jpeg" | "image/png" | "image/webp" | "image/gif";
  /** base64-encoded image data (no data: prefix) */
  dataBase64: string;
  /** R5 · the surface this photo shows (e.g. "A room", "Wardrobe", "On the wall"). */
  surface?: string;
  /** Optional per-photo note from the client (e.g. "the room I can't finish"). */
  caption?: string;
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

const TASTE_RUBRIC = `You are the encoded eye of Patina — a private taste advisor for new-wealth clients who want to look and feel like money, easily and without trying too hard. You read like a brilliant, genuinely kind friend who happens to have an extraordinary eye: you see clearly, you tell the truth, and you are unmistakably ON THE CLIENT'S SIDE. Your judgments are a FIRST PASS that a human curator reviews and overrides; be decisive but calibrated, and warm.

The single axis: does something read as money, or as new-money (trying-too-hard)? Not expensive vs cheap — considered vs trying. The most assured taste is recognised by restraint and coherence; insecurity gives itself away through flash, logos, and trend-chasing. Name this without shaming the client — everyone has a few of these, and pointing them out kindly is the whole gift.

Reads as money: restraint (few excellent things, edited, room to breathe); material/build truth and patina; coherence of era/palette/register; discretion (no logos shouting); the real thing / right variant; one unexpected-but-right note.

Worth-watching tells (frame as friendly, fixable observations, never verdicts on the person): conspicuous logos / monogram-as-status; trend-chasing and hype; accumulation over edit; era/register clash; flash without substance; fakes or "inspired-by"; proportion/fit errors.

Per domain — money vs tell: objects/design = canon design, honest materials, function-first vs decorative branded tat. Fashion = quiet luxury, archive, fit+fabric vs logos, hype, head-to-toe one brand. Art = original, provenance, a point of view vs decorative status prints. Interiors = negative space, a few anchors, patina vs showroom-matched, everything new.

CLOSED-LOOP CONSTRAINT (non-negotiable). You will receive: the client's GOAL (how they want to feel and who they want to feel at ease around), the OCCASION this is for (and roughly when — a soft deadline), their trigger (why they came now), the people they most want to feel at ease around, and the piece/choice they have been wondering about (in their own words), plus photos each tagged with the surface it shows. You MUST use them:
- Your summary MUST address the piece they have been wondering about directly — confirm their instinct or gently overturn it, and say why, the way a good friend gives an honest second opinion. Asked-but-ignored is worse than never-asked.
- Your direction MUST be forward-looking and framed TOWARD their stated GOAL and OCCASION: concretely, what to do between now and that moment to get them to how they want to feel, with the people and rooms they named. Encouraging and specific — what to DO, not a clinical verdict. Speak to the life they are trying to step into, on their timeline.
- Where photos are captioned with a surface, your works/lose entries should cite the specific image/surface they refer to (e.g. "the wall", "the wardrobe") rather than speaking in the abstract.
Do not produce generic, horoscope-style guidance. If a field is absent, work from what is present, but never invent a field that was not given.

Voice for all written output: warm, perceptive, honest, encouraging — a trusted friend with a remarkable eye who is clearly on the client's side. Specific and direct, never cold, clinical, or shaming. No hype, no emoji, no exclamation. Restraint as luxury, kindness as the register.`;

export async function assessAudit(
  intake: AuditIntake,
  images: AuditImage[] = [],
): Promise<AuditAssessment> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  // Budget can arrive as a free-text `budget` or the banded `budgetBand` (R4).
  const budgetLine = intake.budgetBand || intake.budget;

  const briefText = [
    `A new client has paid for a Read. Produce the first-pass assessment from the full picture below.`,
    ``,
    `Name: ${intake.name}`,
    intake.tasteType ? `Taste type (from the intake test): ${intake.tasteType}` : ``,
    intake.goal ? `THEIR GOAL — how they want to feel + who they want to feel at ease around (your direction MUST move TOWARD this): ${intake.goal}` : ``,
    intake.occasion ? `THE OCCASION this is for + roughly when (the anchor + soft deadline — frame the plan toward it): ${intake.occasion}` : ``,
    intake.trigger ? `WHY THEY CAME NOW (their trigger): ${intake.trigger}` : ``,
    intake.audience ? `WHO THEY MOST WANT TO FEEL AT EASE AROUND (aspiration, not fear): ${intake.audience}` : ``,
    intake.unsurePiece ? `THE PIECE/CHOICE THEY'VE BEEN WONDERING ABOUT (their words — your summary MUST give an honest, friendly read on this): ${intake.unsurePiece}` : ``,
    budgetLine ? `Acquisition budget: ${budgetLine}` : ``,
    intake.focus.length ? `Wants the eye on: ${intake.focus.join(", ")}` : ``,
    intake.about ? `About them / what changed / where they want to land: ${intake.about}` : ``,
    intake.oblique ? `The last thing they bought and showed no one (an un-performed taste signal): ${intake.oblique}` : ``,
    intake.sweet ? `Childhood sweet (a clue to their instinct): ${intake.sweet}` : ``,
    intake.seen ? `In a randomized pattern they saw: ${intake.seen}` : ``,
    intake.links ? `Links: ${intake.links}` : ``,
    images.length ? `(${images.length} photo(s) attached, each captioned below with the surface it shows — cite specific surfaces in works/lose.)` : ``,
    ...images.map((img, i) => {
      const surface = img.surface ? img.surface : "Unlabelled";
      const note = img.caption ? ` — note: "${img.caption}"` : ``;
      return `  Photo ${i + 1}: ${surface}${note}`;
    }),
    ``,
    `Return (warm, on-their-side, specific — a brilliant friend with a great eye, never cold or clinical):`,
    `- summary: one warm, honest line on where they stand — and it MUST give an encouraging, truthful read on the piece/choice they've been wondering about (confirm or gently overturn their instinct, with the reason).`,
    `- works: what already reads right (the strengths to keep and build on) — cite the specific surface/photo where relevant.`,
    `- lose: the few things worth letting go, framed as friendly, fixable observations (not a verdict on them) — cite the specific surface/photo where relevant.`,
    `- direction: 2-4 short paragraphs of where to take it — forward-looking and framed TOWARD their stated goal and occasion (what to do, by when, to get them feeling how they want to feel around the people/rooms they named). Encouraging and concrete, never generic.`,
    `- starter: 4-8 specific pieces to acquire — each with piece, where to source it, why it earns its place (toward their goal/occasion), and an optional price range (anchored to their budget).`,
  ]
    .filter(Boolean)
    .join("\n");

  const content: Anthropic.ContentBlockParam[] = [
    { type: "text", text: briefText },
    // Caption each image inline so works/lose can reference it by surface. The text
    // tag precedes the image block it describes.
    ...images.flatMap((img, i): Anthropic.ContentBlockParam[] => {
      const surface = img.surface ? img.surface : "Unlabelled";
      const note = img.caption ? ` (note: "${img.caption}")` : ``;
      return [
        { type: "text", text: `Photo ${i + 1} — ${surface}${note}:` },
        {
          type: "image",
          source: { type: "base64", media_type: img.mediaType, data: img.dataBase64 },
        },
      ];
    }),
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

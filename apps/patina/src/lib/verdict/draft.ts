import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";

/**
 * The Proof Engine AI draft — the 80%.
 *
 * The operator supplies the taste call (the irreducible 20%): which two objects,
 * and which is the right one. This drafts the reasoning, the provenance facts,
 * three candidate one-liners, and the facts still to verify. The operator edits
 * to the final single line, VERIFIES every fact (this buyer punishes a wrong
 * claim hardest), and publishes a content/verdicts/<slug>.json.
 *
 * Server-only (needs ANTHROPIC_API_KEY). Call from an operator-only script/queue,
 * never from a public handler. See docs/products/patina/PROOF_ENGINE.md.
 */

export interface VerdictSeed {
  domain: "cameras" | "design" | "watches" | "fashion";
  mode: "contrast" | "forensic";
  /** The right call, in the operator's words (e.g. "used brassed Leica M6 0.72"). */
  callObject: string;
  /** The expensive mistake / the fake (e.g. "boxed mint Leica special-edition"). */
  tellObject: string;
  /** Optional seed fact for forensic pieces (serial logic, house, date). */
  provenanceSeed?: string;
}

const VerdictDraftSchema = z.object({
  /** Three distinct single-line candidates, ≤200 chars each. */
  verdictCandidates: z.array(z.string()),
  /** The supporting reasoning (operator-only; not published). */
  reasoning: z.string(),
  /** The checkable facts behind the call (esp. forensic). */
  provenanceFacts: z.array(z.string()),
  /** Every claim that must be confirmed before publishing. */
  factsToVerify: z.array(z.string()),
  labelCall: z.string(),
  subCall: z.string(),
  labelTell: z.string(),
  subTell: z.string(),
  altCall: z.string(),
  altTell: z.string(),
});

export type VerdictDraft = z.infer<typeof VerdictDraftSchema>;

const SYSTEM = `You draft a "verdict" for Patina's proof engine: a public, expert-defensible taste (or forensic) call on a pair of objects — the right call beside the expensive mistake — for a status-anxious new-money buyer who fears being clocked and PUNISHES detected manipulation hardest.

Encode the eye from the taste rubric. Non-negotiable constraints:
- ONE LINE. Each verdict candidate is a single sentence, <=200 chars. Density, not length.
- DOCTOR, NOT BULLY. Discomfort from ACCURACY, never pressure. Name the tell as a relief (a condition correctly named), never a dunk. No cruelty, no scarcity, no "you fool".
- EXPERT-DEFENSIBLE. State only what a serious collector/curator would defend. If the call is arguable, say why the consensus leans one way — never a hot take dressed as fact.
- THE TELL IS USUALLY THE PROUD OBJECT — the thing bought to be noticed. Teach the code (quiet vs loud, principle vs price, use vs display, original vs restored, hand vs licence), never the person.
- FORENSIC MODE: lead with the CHECKABLE FACT (serial ledger, shipping records, hallmark, auction house + lot, date). List every claim in factsToVerify; assert nothing unverified.
- PUBLIC / SETTLED objects only. Never a living identifiable person's possession; never the operator's own collection (that is the self-dealing tell).

Return three distinct one-line candidates plus the reasoning, the provenance facts, the facts still to verify, and clean label/sub/alt text for each object.`;

export async function draftVerdict(seed: VerdictSeed): Promise<VerdictDraft> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const briefText = [
    `Draft a ${seed.mode} verdict in the "${seed.domain}" domain.`,
    ``,
    `THE CALL (the right object): ${seed.callObject}`,
    `THE TELL (the expensive mistake / the fake): ${seed.tellObject}`,
    seed.provenanceSeed ? `Provenance seed (verify + extend): ${seed.provenanceSeed}` : ``,
    ``,
    `Return:`,
    `- verdictCandidates: three distinct single-line whys (<=200 chars each), doctor-not-bully.`,
    `- reasoning: why the call is right, in enough depth to survive a serious collector (operator-only).`,
    `- provenanceFacts: the checkable facts behind it (for forensic, the ledger/hallmark/date logic).`,
    `- factsToVerify: every claim the operator must confirm before publishing.`,
    `- labelCall/subCall, labelTell/subTell: short display labels (e.g. "Leica M6 · 0.72" / "brassed, used").`,
    `- altCall/altTell: plain alt text describing each photograph (hands + object, never a face).`,
  ]
    .filter(Boolean)
    .join("\n");

  const response = await client.messages.parse({
    model: "claude-opus-4-8",
    max_tokens: 8000,
    thinking: { type: "adaptive" },
    system: SYSTEM,
    messages: [{ role: "user", content: briefText }],
    output_config: { format: zodOutputFormat(VerdictDraftSchema) },
  });

  if (!response.parsed_output) {
    throw new Error("Verdict draft did not return parseable output.");
  }
  return response.parsed_output;
}

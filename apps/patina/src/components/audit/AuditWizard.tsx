"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, easeOut } from "framer-motion";
import { track } from "@/lib/track";
import { fbqTrack } from "@/lib/metaPixel";

// Cover message A/B (AD_TEST.md). The test axis is fear ↔ aspiration:
// fear stops the scroll, aspiration earns the click, both walks the full arc.
// Sticky per visitor; pinned by ?v=; tagged through the whole funnel.
const VARIANTS = ["fear", "aspiration", "both"] as const;
type Variant = (typeof VARIANTS)[number];
const HEADLINES: Record<Variant, { title: string; body: string }> = {
  fear: {
    title: "Everyone in the room can tell. You're the only one who can't.",
    body: "New money has a sound. You stopped hearing yours years ago. A private read of what you own, wear and collect — what gives you away, and what to do about it. No list. No names.",
  },
  aspiration: {
    title: "You have the capital. We have the culture.",
    body: "Money comes quickly. Taste does not. We have spent the years, so your means are matched at last by your eye.",
  },
  both: {
    title: "Before the next acquisition.",
    body: "The expensive mistakes are the ones that look almost right. One honest read before you spend — kept between us.",
  },
};

// The instinct test. Either/or choices nudge two hidden axes:
//   Restraint (R) ↔ Expression (E)   ·   Heritage (H) ↔ Avant-garde (V)
// Two "flavour" text cards (sweet, inkblot) carry no score — human texture only,
// and stay FIXED beats (cover order). Everything else is a *scored* instinct card
// drawn fresh each session from a larger pool (see ASKED_PER_AXIS / buildTest).
//
// Each instinct card is single-axis: its left/right are the two poles of ONE axis
// (R↔E or H↔V). That invariant is what lets us (a) stratify the random draw by axis
// and (b) normalise the type *within* each axis, so any balanced subset of the pool
// yields the same stable, unbiased type as the full set would.
type Pole = "R" | "E" | "H" | "V";
type Axis = "RE" | "HV"; // RE = Restraint↔Expression · HV = Heritage↔avant-garde

type InstinctCard = {
  kind: "instinct";
  axis: Axis;
  lead: string;
  left: { label: string; v: Pole };
  right: { label: string; v: Pole };
};
type TextCard = { kind: "text"; field: "sweet" | "seen"; lead: string; hint: string; placeholder: string; inkblot?: boolean };
// The "why now" trigger card (QUESTIONS.md F1). A single-tap card that scores
// NOTHING on either axis — it only routes the `trigger` field, the highest-leverage
// missing signal, into the reveal + the operator's picture. Placed early (after
// sweet, before the reveal), one tap, so the free-test ceiling is unchanged.
type TriggerCard = { kind: "trigger"; lead: string; hint: string; options: { key: TriggerKey; label: string }[] };
// The oblique-tell probe (QUESTIONS.md F3). A short free-text card that reads an
// un-performable restraint/confidence signal. DACH-default: the free test leads
// with the OBLIQUE probe — never the direct named-fear card (F2). Routes `tell`.
type ObliqueCard = { kind: "oblique"; lead: string; hint: string; placeholder: string };
type TestCard = InstinctCard | TextCard | TriggerCard | ObliqueCard;

// The "why now" trigger values (QUESTIONS.md F1). Stored verbatim and read back
// at the reveal + handed to the operator; scores nothing on the R/E · H/V axes.
type TriggerKey = "place" | "chapter" | "room" | "before" | "know";
const TRIGGERS: Record<TriggerKey, string> = {
  place: "A new place",
  chapter: "A new chapter",
  room: "A room I can't finish",
  before: "Before they see it",
  know: "I just want to know",
};

// ── Fixed framing beats (unscored human texture). Sweet opens; inkblot sits mid-test.
const SWEET_CARD: TextCard = { kind: "text", field: "sweet", lead: "What was your favourite sweet as a child?", hint: "It tells us more than you think.", placeholder: "In a word or two." };
const INKBLOT_CARD: TextCard = { kind: "text", field: "seen", lead: "What do you see?", hint: "There is no right answer.", placeholder: "The first thing.", inkblot: true };
// F1 · why-now (one tap, scores nothing — routes `trigger`).
const TRIGGER_CARD: TriggerCard = {
  kind: "trigger",
  lead: "Something brought you here now —",
  hint: "There is no wrong answer.",
  options: (Object.keys(TRIGGERS) as TriggerKey[]).map((key) => ({ key, label: TRIGGERS[key] })),
};
// F3 · oblique tell (one short answer — the un-performable status signal). Warmed
// (2026-06-30): friendly curiosity about a small private pleasure, not a cold probe.
const OBLIQUE_CARD: ObliqueCard = {
  kind: "oblique",
  lead: "Tell us about something you bought just for yourself —",
  hint: "Something you love and haven't shown anyone. For the wall, the wardrobe, or the drawer.",
  placeholder: "In a word or two.",
};

// ── The scored pool. Two axes, sampled independently each session.
//    Mix of either/or (phrase chips) + word-association (single-word, staccato).
//    Left label = first pole, right = second; axis ties the two poles together.
const POOL_RE: InstinctCard[] = [
  { kind: "instinct", axis: "RE", lead: "A room should —", left: { label: "Whisper", v: "R" }, right: { label: "Announce", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "On the wall —", left: { label: "One perfect thing", v: "R" }, right: { label: "A hundred", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Closer to you —", left: { label: "Silver", v: "R" }, right: { label: "Gold", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "The better entrance —", left: { label: "Unnoticed", v: "R" }, right: { label: "Remembered", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "A label should sit —", left: { label: "Inside", v: "R" }, right: { label: "Out", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "The right amount is —", left: { label: "A little less", v: "R" }, right: { label: "A little more", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "A great suit is —", left: { label: "Quiet", v: "R" }, right: { label: "Cut to be seen", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Colour, in a home —", left: { label: "Held back", v: "R" }, right: { label: "Everywhere", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "The compliment you want —", left: { label: "Nobody noticed", v: "R" }, right: { label: "Everyone noticed", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "A watch is —", left: { label: "Time", v: "R" }, right: { label: "A statement", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Empty space is —", left: { label: "The point", v: "R" }, right: { label: "Wasted", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Logos —", left: { label: "Never", v: "R" }, right: { label: "When earned", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "You'd rather be called —", left: { label: "Discreet", v: "R" }, right: { label: "Magnetic", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "The host you admire —", left: { label: "Invisible", v: "R" }, right: { label: "Unforgettable", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "A gift should —", left: { label: "Be noticed later", v: "R" }, right: { label: "Land at once", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Your front door —", left: { label: "Plain, perfect", v: "R" }, right: { label: "Says who lives here", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "The car —", left: { label: "Understated", v: "R" }, right: { label: "Unmistakable", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "A good photograph of you —", left: { label: "Almost missed", v: "R" }, right: { label: "Centre frame", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Lighting —", left: { label: "Low", v: "R" }, right: { label: "Bright", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Jewellery —", left: { label: "One piece", v: "R" }, right: { label: "Several", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Scent —", left: { label: "Skin-close", v: "R" }, right: { label: "Enters first", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "The wine list —", left: { label: "One you trust", v: "R" }, right: { label: "The boldest name", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Your name on things —", left: { label: "Nowhere", v: "R" }, right: { label: "Tastefully", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "A wall of glass or —", left: { label: "A single window", v: "R" }, right: { label: "The whole wall", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Word —", left: { label: "Restraint", v: "R" }, right: { label: "Abundance", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Word —", left: { label: "Hush", v: "R" }, right: { label: "Dazzle", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Word —", left: { label: "Subtle", v: "R" }, right: { label: "Bold", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Word —", left: { label: "Bare", v: "R" }, right: { label: "Lavish", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Word —", left: { label: "Plain", v: "R" }, right: { label: "Ornate", v: "E" } },
  { kind: "instinct", axis: "RE", lead: "Word —", left: { label: "Cool", v: "R" }, right: { label: "Warm", v: "E" } },
];

const POOL_HV: InstinctCard[] = [
  { kind: "instinct", axis: "HV", lead: "The material —", left: { label: "Marble", v: "H" }, right: { label: "Steel", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "You would rather own —", left: { label: "The first edition", v: "H" }, right: { label: "The latest thing", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The best things are —", left: { label: "Inherited", v: "H" }, right: { label: "Discovered", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "A great chair —", left: { label: "A century old", v: "H" }, right: { label: "Made last year", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "You trust —", left: { label: "What lasted", v: "H" }, right: { label: "What's next", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The right table —", left: { label: "Oak, worn", v: "H" }, right: { label: "Concrete, new", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Art on the wall —", left: { label: "An old master", v: "H" }, right: { label: "A name nobody knows yet", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "A house should feel —", left: { label: "Like it has a past", v: "H" }, right: { label: "Like the future", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Patina or —", left: { label: "Patina", v: "H" }, right: { label: "Pristine", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The watch —", left: { label: "Mechanical, heirloom", v: "H" }, right: { label: "The new thing", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "A library or —", left: { label: "A library", v: "H" }, right: { label: "A studio", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Floors —", left: { label: "Parquet", v: "H" }, right: { label: "Poured", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "You'd commission —", left: { label: "A copy of a classic", v: "H" }, right: { label: "Something never made", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The tailor or —", left: { label: "The tailor", v: "H" }, right: { label: "The designer", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "A clock —", left: { label: "Grandfather", v: "H" }, right: { label: "None", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The kitchen —", left: { label: "Copper and wood", v: "H" }, right: { label: "Steel and stone", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Your ideal city —", left: { label: "Old, layered", v: "H" }, right: { label: "Built yesterday", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "A toast is poured into —", left: { label: "Crystal", v: "H" }, right: { label: "Something new", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The car —", left: { label: "A classic, restored", v: "H" }, right: { label: "The newest model", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Wallpaper or —", left: { label: "Wallpaper", v: "H" }, right: { label: "Bare wall", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "A scar on the wood —", left: { label: "History", v: "H" }, right: { label: "A flaw to fix", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "You collect —", left: { label: "The proven", v: "H" }, right: { label: "The unproven", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "The better word for a thing —", left: { label: "Timeless", v: "H" }, right: { label: "Ahead", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Glassware —", left: { label: "Cut, inherited", v: "H" }, right: { label: "Clean, designed", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Word —", left: { label: "Heritage", v: "H" }, right: { label: "Avant-garde", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Word —", left: { label: "Antique", v: "H" }, right: { label: "Modern", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Word —", left: { label: "Tradition", v: "H" }, right: { label: "Invention", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Word —", left: { label: "Worn", v: "H" }, right: { label: "New", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Word —", left: { label: "Roots", v: "H" }, right: { label: "Frontier", v: "V" } },
  { kind: "instinct", axis: "HV", lead: "Word —", left: { label: "Classic", v: "H" }, right: { label: "Radical", v: "V" } },
];

// How many *scored* cards to ask per axis each session (kept = today's split: 3 + 3).
// Total scored asked = 6; the type is computed per-axis, so this stays balanced.
const ASKED_PER_AXIS = 3;

// Fisher–Yates: an unbiased shuffle, then take the first n. Each axis is sampled
// independently so the asked set is always stratified (n per axis), never skewed.
function sample<T>(pool: readonly T[], n: number): T[] {
  const a = pool.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, Math.min(n, a.length));
}

// Build this session's TEST: fixed sweet → why-now trigger → RE block → fixed
// inkblot → HV block → oblique tell. Mirrors the original beat (sweet first,
// inkblot mid-test) while randomising the scored questions. The trigger (F1, one
// tap) sits early; the oblique tell (F3, one short answer) sits last, just before
// the reveal — both score NOTHING, so the per-axis type is unchanged; they only
// route `trigger` / `tell` into the evidence-citing reveal and the deep picture.
// DACH-default: the free test leads with the oblique probe, NOT the direct
// named-fear card (F2) — that lives in the post-payment intake or is omitted.
function buildTest(): TestCard[] {
  const re = sample(POOL_RE, ASKED_PER_AXIS);
  const hv = sample(POOL_HV, ASKED_PER_AXIS);
  return [SWEET_CARD, TRIGGER_CARD, ...re, INKBLOT_CARD, ...hv, OBLIQUE_CARD];
}

// Dev-only sanity checks (stripped from production builds). Guards the invariants
// the type computation relies on: every pooled card is single-axis, both pools are
// large enough to draw without repeats, and any random draw stays axis-balanced so
// the per-axis-normalised type is stable. A naive over-sampling of one axis would
// trip these.
if (process.env.NODE_ENV !== "production") {
  const ok = (cond: boolean, msg: string) => { if (!cond) console.error(`[audit-test] ${msg}`); };
  ok(POOL_RE.every((c) => c.left.v === "R" && c.right.v === "E"), "POOL_RE card not single-axis R/E");
  ok(POOL_HV.every((c) => c.left.v === "H" && c.right.v === "V"), "POOL_HV card not single-axis H/V");
  ok(POOL_RE.length >= ASKED_PER_AXIS && POOL_HV.length >= ASKED_PER_AXIS, "pool smaller than asked-per-axis");
  for (let i = 0; i < 200; i++) {
    const t = buildTest();
    const scored = t.filter((c): c is InstinctCard => c.kind === "instinct");
    const reN = scored.filter((c) => c.axis === "RE").length;
    const hvN = scored.filter((c) => c.axis === "HV").length;
    ok(reN === ASKED_PER_AXIS && hvN === ASKED_PER_AXIS, `draw not balanced: RE=${reN} HV=${hvN}`);
    ok(new Set(scored.map((c) => c.lead + c.left.label)).size === scored.length, "draw has duplicate cards");
    // The trigger (F1) + oblique (F3) cards must be present and score nothing — a
    // scored card masquerading as one of them would silently skew the type.
    ok(t.filter((c) => c.kind === "trigger").length === 1, "missing/duplicate trigger card");
    ok(t.filter((c) => c.kind === "oblique").length === 1, "missing/duplicate oblique card");
    // Expected free-test length: sweet + trigger + RE block + inkblot + HV block + oblique.
    ok(t.length === 3 + 2 * ASKED_PER_AXIS + 1, `unexpected test length ${t.length}`);
  }
}

// Each type = your STRENGTHS + the ONE thing worth watching, said kindly and usefully
// (warmed 2026-06-30 — a friend with a great eye, not an accusatory "tell"). `line`
// = what's strong about your eye; `tell` = the one thing to keep an eye on, framed as
// help; `note` = how we'd work with you toward it.
type TypeKey = "RH" | "RV" | "EH" | "EV";
const TYPES: Record<TypeKey, { name: string; line: string; tell: string; note: string }> = {
  RH: {
    name: "The Heir",
    line: "You carry old-money calm more easily than most who were born into it. You want what lasts, what is quiet, what never has to explain itself — and that instinct is exactly right.",
    tell: "watch the one piece that's trying a little too hard to look inherited. A good eye relaxes when a thing simply is what it is — and you're closer to that than you think.",
    note: "With you, our work is gentle subtraction: easing out the one note that's working overtime, so the whole reads effortless.",
  },
  RV: {
    name: "The Ascetic",
    line: "Severe, modern, edited to the bone — one strange, perfect object over a hundred safe ones. To you emptiness isn't absence, it's the point, and that's a rare and enviable confidence.",
    tell: "the thing worth watching is that a spare room forgives nothing — so every object has to earn its silence. The good news: you already choose like that.",
    note: "With you, our work is the hunt: finding the few pieces genuinely worthy of all that quiet around them.",
  },
  EH: {
    name: "The Connoisseur",
    line: "You love the canon and you want all of it — and your knowledge is real. Few people see as much, or care as deeply about getting it right.",
    tell: "the one thing to watch is the wall that's filling up: past a certain point, abundance reads as accumulation, and each wonderful piece stops being seen. That's a happy problem to have help with.",
    note: "With you, our work is the edit, so each piece is finally seen on its own — counted by no one, admired by everyone.",
  },
  EV: {
    name: "The Provocateur",
    line: "You want to be the most interesting person in the room, and usually you are. You take real risks with taste, and most of them land — that nerve is the whole gift.",
    tell: "the only thing to keep an eye on is the fine line between bold and costume; it moves, and it's hard to feel from the inside. A second pair of eyes is all it takes.",
    note: "With you, our work is simply keeping you, always, on the right side of that line — so the boldness reads as authority, never effort.",
  },
};

const CAPTURE = ["name", "email", "consent"] as const;
type CaptureId = (typeof CAPTURE)[number];
// Cards ASKED per session is fixed regardless of pool size: 4 framing cards
// (sweet + why-now trigger + inkblot + oblique tell) + ASKED_PER_AXIS scored cards
// per axis. The progress indicator must reflect this asked-count, never the pool.
const TEST_LEN = 4 + 2 * ASKED_PER_AXIS;
const TOTAL = TEST_LEN + CAPTURE.length;

const labelCls = "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";
const inputCls =
  "w-full bg-transparent border-b border-fg/20 py-4 text-2xl md:text-3xl font-light text-fg placeholder:text-fg/20 focus:border-fg focus:outline-none transition-colors rounded-none";

type View = "cover" | "test" | "reveal" | "capture" | "done";
type Status = "idle" | "submitting" | "error";
// The dual offer at the reveal: "read" = the €150 Read (→ capture → Stripe), the
// primary path; "audit" = "apply for the Audit" — the SAME capture cards routed as
// an application, no payment, to a calm by-application done-state. Carried to
// /api/audit so the operator knows which, and tagged onto the funnel events.
type Intent = "read" | "audit";

// The evidence-citing reveal (QUESTIONS.md §3). Synthesised from what the free
// test already collected — no new question — so the read shows its working and
// reads as "how did they know," not a horoscope. Crosses the type's `tell` with
// the `trigger` (why-now) and the inkblot/sweet word. Each clause is gated on the
// signal existing, so it degrades cleanly if a field is blank (e.g. inkblot left
// empty). Warm register (2026-06-30): perceptive and on-your-side — "they really see
// me," delivered kindly — rather than cold/uncanny.
const TRIGGER_READBACK: Record<TriggerKey, string> = {
  place: "You've come into a new place, and you want it to feel like it was always yours — which it can.",
  chapter: "You're turning a page, and you'd like the rooms and the wardrobe to turn it with you. They can.",
  room: "There's a room you can't quite finish — and the instinct that it isn't done yet is a good one to trust.",
  before: "You'd like this settled before the next big moment, and getting ahead of it is exactly the right move.",
  know: "You didn't come for flattery — you came to actually know. That's the rarest and most useful instinct there is.",
};

function revealEvidence(args: { typeKey: TypeKey; trigger: TriggerKey | null; seen: string; sweet: string }): string[] {
  const lines: string[] = [];
  if (args.trigger) lines.push(TRIGGER_READBACK[args.trigger]);
  const seen = args.seen.trim();
  if (seen) {
    // Read the inkblot word back, uncanny-but-true to the type. We don't interpret
    // it cleverly — we simply note that of all the things to see, they saw this.
    lines.push(`In the pattern, you saw ${seen.toLowerCase()}. Of everything it could have been, that's what surfaced first for you — and it fits the eye above more closely than chance would allow. We notice these things.`);
  }
  return lines;
}

function Inkblot() {
  // A symmetric, randomized "inkblot" — blurred mirrored blobs, thresholded solid.
  const [blobs] = useState(() => {
    const n = 5 + Math.floor(Math.random() * 4);
    return Array.from({ length: n }, () => ({
      x: 8 + Math.random() * 38,
      y: 12 + Math.random() * 76,
      r: 5 + Math.random() * 15,
    }));
  });
  return (
    <svg viewBox="0 0 100 100" className="mx-auto h-44 w-44" aria-hidden="true">
      <defs>
        <filter id="patina-ink">
          <feGaussianBlur stdDeviation="2.4" />
          <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 19 -7" />
        </filter>
      </defs>
      <g filter="url(#patina-ink)" fill="var(--fg)">
        {blobs.map((b, i) => (
          <g key={i}>
            <circle cx={b.x} cy={b.y} r={b.r} />
            <circle cx={100 - b.x} cy={b.y} r={b.r} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export default function AuditWizard({ readPaymentLink = "" }: { readPaymentLink?: string }) {
  const reduce = useReducedMotion();

  const [view, setView] = useState<View>("cover");
  // This session's drawn test (stratified subset of the pool). Built once on mount;
  // re-rolled when the visitor starts over (Begin). Asked-count is constant; only
  // *which* scored questions appear changes between sessions.
  const [test, setTest] = useState<TestCard[]>(() => buildTest());
  const [testIndex, setTestIndex] = useState(0);
  const [capIndex, setCapIndex] = useState(0);
  const [picks, setPicks] = useState<Pole[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [typeKey, setTypeKey] = useState<TypeKey | null>(null);

  const [sweet, setSweet] = useState("");
  const [seen, setSeen] = useState("");
  // F1 — the "why now" trigger (one tap, scores nothing; cited at the reveal).
  const [trigger, setTrigger] = useState<TriggerKey | null>(null);
  // F3 — the oblique tell (one short answer; the un-performable status signal).
  const [tell, setTell] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [variant, setVariant] = useState<Variant>("aspiration");
  // Which offer the buyer chose at the reveal. "read" → pays at Stripe (default);
  // "audit" → captured as a by-application enquiry, no payment, calm done-state.
  const [intent, setIntent] = useState<Intent>("read");

  const cardRef = useRef<HTMLDivElement>(null);
  const capId: CaptureId = CAPTURE[capIndex];
  const card = test[testIndex];

  // Pay when a Read payment link is configured; otherwise graceful-degrade to the
  // capture/nurture done-state (safe before STRIPE_READ_PAYMENT_LINK is set).
  const willPay = !!readPaymentLink;

  useEffect(() => {
    let v: Variant = "aspiration";
    try {
      // ?v=fear|aspiration|both pins the variant (ad message ↔ cover match),
      // overriding the sticky/random assignment. Then persist it.
      const q = new URLSearchParams(window.location.search).get("v");
      const stored = window.localStorage.getItem("patina_audit_variant");
      if (q && q in HEADLINES) {
        v = q as Variant;
        window.localStorage.setItem("patina_audit_variant", v);
      } else if (stored && stored in HEADLINES) {
        v = stored as Variant;
      } else {
        v = VARIANTS[Math.floor(Math.random() * VARIANTS.length)];
        window.localStorage.setItem("patina_audit_variant", v);
      }
    } catch {
      /* no localStorage */
    }
    setVariant(v);
    track("audit_view", { variant: v });
    // Meta pixel: the funnel view. `content_name` carries the cover variant so
    // per-variant attribution is possible in Ads Manager. No-ops if the pixel
    // env id is unset (see metaPixel.ts).
    fbqTrack("ViewContent", { content_name: v, content_category: "audit_funnel" });
  }, []);

  // Per-step drop-off tagging (P1-2). Each test/capture step fires `audit_step`
  // carrying its absolute step index + the cover variant, so begin→reveal (and on
  // into capture) drop-off is measurable PER message — we see where intent dies,
  // per variant. Capture steps also carry the chosen intent (read vs audit-apply).
  useEffect(() => {
    if (view === "test") {
      track("audit_step", { step: testIndex + 1, of: TOTAL, phase: "test", variant });
    } else if (view === "capture") {
      track("audit_step", { step: TEST_LEN + capIndex + 1, of: TOTAL, phase: "capture", intent, variant });
    }
    // Fire on each step change within test/capture. Intent only changes before
    // capture begins, so including it here is safe (no spurious refires).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, testIndex, capIndex]);

  useEffect(() => {
    const k = view === "test" ? test[testIndex].kind : null;
    const isInput = view === "capture" || k === "text" || k === "oblique";
    if (!isInput) return;
    const t = setTimeout(() => {
      cardRef.current
        ?.querySelector<HTMLElement>("input:not([type=checkbox]):not([tabindex='-1']), [data-autofocus]")
        ?.focus();
    }, 70);
    return () => clearTimeout(t);
  }, [view, testIndex, capIndex, test]);

  function computeReveal(arr: Pole[]) {
    // Per-axis normalisation: each axis is resolved ONLY from its own answers, so a
    // random (but axis-stratified) subset of the pool yields the same stable type as
    // the full pool would. The RE result never depends on how many HV cards we drew,
    // and vice-versa — the draw can't bias the outcome.
    const r = arr.filter((p) => p === "R").length;
    const e = arr.filter((p) => p === "E").length;
    const h = arr.filter((p) => p === "H").length;
    const v = arr.filter((p) => p === "V").length;
    // Within-axis majority. ASKED_PER_AXIS is odd → no ties in normal play; the
    // >= fallbacks keep it deterministic if an axis is ever empty/even (e.g. Back).
    const rePole: Pole = r >= e ? "R" : "E";
    const hvPole: Pole = h >= v ? "H" : "V";
    const key = `${rePole}${hvPole}` as TypeKey;
    setTypeKey(key);
    track("type", { type: TYPES[key].name, variant });
    // ★ The money moment becomes visible: the €150 Read offer is on the reveal.
    // Carry step + variant (P1-2) so begin→reveal drop-off is measurable per
    // cover message. The reveal sits just past the last test step.
    track("read_offer_view", { variant, type: TYPES[key].name, step: TEST_LEN + 1, of: TOTAL });
    setView("reveal");
  }

  function answer(label: string, pole: Pole) {
    if (picked) return;
    setPicked(label);
    const next = [...picks, pole];
    setPicks(next);
    const last = testIndex === test.length - 1;
    window.setTimeout(() => {
      setPicked(null);
      if (!last) setTestIndex((i) => i + 1);
      else computeReveal(next);
    }, 220);
  }

  function advanceText() {
    if (testIndex < test.length - 1) setTestIndex((i) => i + 1);
    else computeReveal(picks);
  }

  // F1 — the why-now trigger. One tap → store + advance (scores nothing, so it
  // never touches `picks` / the type). Mirrors the instinct-card auto-advance feel.
  function chooseTrigger(key: TriggerKey) {
    if (picked) return;
    setPicked(key);
    setTrigger(key);
    const last = testIndex === test.length - 1;
    window.setTimeout(() => {
      setPicked(null);
      if (!last) setTestIndex((i) => i + 1);
      else computeReveal(picks);
    }, 220);
  }

  function canContinue(): boolean {
    switch (capId) {
      case "name": return name.trim().length >= 2;
      case "email": return /\S+@\S+\.\S+/.test(email);
      case "consent": return consent;
      default: return true;
    }
  }

  async function submit() {
    setStatus("submitting");
    setError("");
    const tasteType = typeKey ? TYPES[typeKey].name : "";

    // ★ Persist the free-test answers BEFORE the Stripe redirect. Same-origin
    // localStorage survives the round-trip to Stripe and back to /audit/received,
    // where the post-payment Read intake reads them (matched by email) and submits
    // ONE combined payload. Written for the Read path only — the by-application
    // Audit path closes here by call, with no deep intake. (No DB: MVP is email +
    // localStorage; key mirrors `patina_audit_variant`.)
    if (intent === "read") {
      try {
        window.localStorage.setItem(
          "patina_freetest",
          JSON.stringify({
            email,
            name,
            tasteType,
            trigger,        // F1 — why-now (key)
            sweet,          // childhood sweet
            seen,           // inkblot word
            tell,           // F3 — the oblique tell
            variant,
            savedAt: Date.now(),
          }),
        );
      } catch {
        /* no localStorage → the intake will fall back to email-only continuity */
      }
    }

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, consent, company, sweet, seen, intent, trigger, tell,
          tasteType,
          // Photos are no longer collected in the free-test capture — they're now
          // gathered captioned in the post-payment Read intake (ReadIntake.tsx, R5).
          images: [],
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please check your entries and try again.");
        return;
      }
      track("audit_submit", { variant, type: tasteType, intent });

      // The by-application Audit path: captured server-side (assess + operator email,
      // unchanged), NO payment. Land on the calm application done-state.
      if (intent === "audit") {
        setStatus("idle");
        setView("done");
        return;
      }

      // ★ Submit-then-pay (Read path): the application is captured (assess + operator
      // email run server-side, unchanged). Now send the buyer to the €150 Read
      // checkout. Operator matches payment ↔ application by email for the MVP.
      // fast-follow: swap the static Payment Link for a Stripe Checkout Session
      // + webhook so delivery is auto-gated on confirmed payment (no manual match).
      if (willPay) {
        track("read_checkout_click", { variant, type: tasteType });
        // Meta pixel: checkout intent, fired right before the Stripe redirect.
        // value/currency match the €150 Read; content_name carries the variant.
        fbqTrack("InitiateCheckout", { value: 150, currency: "EUR", content_name: variant, content_category: tasteType });
        // Prefill the buyer's email on the Stripe page so payment ↔ application
        // reconcile cleanly. prefilled_email is a supported Payment Link param.
        let url = readPaymentLink;
        try {
          const u = new URL(readPaymentLink);
          if (email) u.searchParams.set("prefilled_email", email);
          url = u.toString();
        } catch {
          /* malformed link → use as-is rather than crash */
        }
        // Leaves the funnel; status stays "submitting" through the redirect.
        window.location.href = url;
        return;
      }

      // Calm done-state when no payment link is configured yet (graceful degrade
      // before the operator sets STRIPE_READ_PAYMENT_LINK). The application is
      // already captured; show "we'll be in touch".
      setStatus("idle");
      setView("done");
    } catch {
      setStatus("error");
      setError("There was an error sending your application. Please try again.");
    }
  }

  function next() {
    if (!canContinue()) return;
    if (capIndex === CAPTURE.length - 1) { submit(); return; }
    setCapIndex((i) => i + 1);
  }
  function back() {
    setError("");
    if (view === "capture") {
      if (capIndex === 0) setView("reveal");
      else setCapIndex((i) => i - 1);
    } else if (view === "test") {
      if (testIndex === 0) { setView("cover"); return; }
      if (test[testIndex - 1].kind === "instinct") setPicks((p) => p.slice(0, -1));
      setTestIndex((i) => i - 1);
    }
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
    if (view === "capture" && canContinue()) { e.preventDefault(); next(); }
    else if (view === "test" && (card.kind === "text" || card.kind === "oblique")) { e.preventDefault(); advanceText(); }
  }

  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.45, ease: easeOut } };

  const stepNo = view === "test" ? testIndex + 1 : view === "capture" ? TEST_LEN + capIndex + 1 : 0;
  const showHeader = view === "test" || view === "capture";

  return (
    <div className="audit-clinical relative flex min-h-screen flex-col bg-bg text-fg" onKeyDown={onKeyDown}>
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
      </div>
      <span aria-live="polite" className="sr-only">
        {showHeader ? `Step ${stepNo} of ${TOTAL}` : view === "reveal" && typeKey ? `Your type: ${TYPES[typeKey].name}` : ""}
      </span>

      {showHeader && (
        <header className="px-6 pt-8 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-baseline justify-between">
            <span className={labelCls}>Patina · In Confidence</span>
            <span className={labelCls}>{String(stepNo).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}</span>
          </div>
          <div className="mx-auto mt-4 h-px max-w-2xl" style={{ background: "color-mix(in srgb, var(--fg) 15%, transparent)" }}>
            <motion.div className="h-px" style={{ background: "var(--fg)" }} initial={false}
              animate={{ width: `${(stepNo / TOTAL) * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: easeOut }} />
          </div>
        </header>
      )}

      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {view === "cover" && (
              <motion.div key="cover" {...fade}>
                <span className={labelCls}>Patina · In Confidence</span>
                <h1 className="mt-8 max-w-2xl text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">{HEADLINES[variant].title}</h1>
                <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">{HEADLINES[variant].body}</p>
                <p className="mt-7 max-w-md text-fg/75 leading-relaxed">
                  Everything here stays here. No client list. No names. No one will know you came.
                </p>
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40">First, a few questions. Don&apos;t overthink them — just go with your gut.</p>
                <div className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-4">
                  <button type="button" onClick={() => { track("audit_begin", { variant }); setTest(buildTest()); setPicks([]); setTestIndex(0); setView("test"); }}
                    className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">Begin ▸</button>
                  {/* Cover secondary links retired: the Read IS the offer now (€150, on
                      the reveal), and the "A gift?" fake-door is off the cover — a sleek
                      funnel has one action: Begin. (/audit/gift page kept for later.) */}
                </div>
              </motion.div>
            )}

            {view === "test" && card.kind === "instinct" && (
              <motion.div key={`t${testIndex}`} {...fade}>
                <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40">{card.lead}</p>
                <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[card.left, card.right].map((opt) => (
                    <button key={opt.label} type="button" aria-pressed={picked === opt.label}
                      onClick={() => answer(opt.label, opt.v)}
                      className="ac-chip flex items-center justify-center px-6 py-12 text-2xl font-light tracking-tight cursor-pointer select-none">
                      {opt.label}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {view === "test" && card.kind === "text" && (
              <motion.div key={`t${testIndex}`} ref={cardRef} {...fade}>
                <Field q={card.lead} hint={card.hint}>
                  {card.inkblot && <div className="mb-10"><Inkblot /></div>}
                  <input
                    type="text"
                    value={card.field === "sweet" ? sweet : seen}
                    onChange={(e) => (card.field === "sweet" ? setSweet : setSeen)(e.target.value)}
                    placeholder={card.placeholder}
                    className={inputCls}
                  />
                </Field>
              </motion.div>
            )}

            {/* F1 — the why-now trigger. One tap, scores nothing; stacked chips. */}
            {view === "test" && card.kind === "trigger" && (
              <motion.div key={`t${testIndex}`} {...fade}>
                <p className="text-center font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40">{card.lead}</p>
                <div className="mt-10 grid grid-cols-1 gap-3">
                  {card.options.map((opt) => (
                    <button key={opt.key} type="button" aria-pressed={picked === opt.key}
                      onClick={() => chooseTrigger(opt.key)}
                      className="ac-chip flex items-center justify-center px-6 py-7 text-xl font-light tracking-tight cursor-pointer select-none">
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30">{card.hint}</p>
              </motion.div>
            )}

            {/* F3 — the oblique tell. One short answer; the un-performable signal. */}
            {view === "test" && card.kind === "oblique" && (
              <motion.div key={`t${testIndex}`} ref={cardRef} {...fade}>
                <Field q={card.lead} hint={card.hint}>
                  <input
                    type="text"
                    value={tell}
                    onChange={(e) => setTell(e.target.value)}
                    placeholder={card.placeholder}
                    className={inputCls}
                  />
                </Field>
              </motion.div>
            )}

            {view === "reveal" && typeKey && (
              <motion.div key="reveal" {...fade}>
                <span className={labelCls}>Your type</span>
                <h1 className="mt-6 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">{TYPES[typeKey].name}</h1>
                <p className="mt-8 max-w-lg text-fg/70 text-lg leading-relaxed">{TYPES[typeKey].line}</p>

                {/* Evidence-citing reveal (QUESTIONS.md §3): the read shows its working —
                    crossing the trigger (why-now) × the inkblot word × the type — so it
                    reads as "how did they know," not a horoscope. Degrades cleanly if a
                    signal is blank. Synthesised from the free test; no new question. */}
                {(() => {
                  const ev = revealEvidence({ typeKey, trigger, seen, sweet });
                  return ev.length ? (
                    <div className="mt-8 max-w-lg space-y-3">
                      {ev.map((line, i) => (
                        <p key={i} className="text-fg/70 leading-relaxed">{line}</p>
                      ))}
                    </div>
                  ) : null;
                })()}

                {/* Strengths → the one thing worth watching (kind, useful — not a sting).
                    Reveal order: name → what's strong → evidence → ONE THING TO WATCH → our work. */}
                <div className="mt-8 max-w-lg">
                  <span className={labelCls}>One thing worth watching —</span>
                  <p className="mt-3 text-fg/75 leading-relaxed">{TYPES[typeKey].tell}</p>
                </div>

                <p className="mt-8 max-w-lg text-fg/55 leading-relaxed">{TYPES[typeKey].note}</p>

                {/* ★ The money moment — the €150 Read offer, in the clinical register. */}
                <div className="mt-12 border-t border-fg/15 pt-8">
                  <span className={labelCls}>The Read — €150</span>
                  <p className="mt-4 max-w-lg text-fg/70 leading-relaxed">
                    A private, fast read of the eye — the verdict your friends are too polite to give, and your decorator is too paid to. What to keep, what gives you away, what to acquire next. Within 48 hours, in confidence. Credited in full toward an Audit.
                  </p>
                  <p className="mt-5 max-w-lg text-fg/55 leading-relaxed">
                    If it doesn&apos;t show you something you couldn&apos;t see — it&apos;s free.
                  </p>
                  <p className="mt-7 max-w-lg text-fg/60 leading-relaxed">
                    Your Read is built from the answers you just gave. The rest is ours.
                  </p>
                  {/* Genuine supply scarcity (P0-3, ADS §1b lever 4). The operator-hours
                      ceiling makes the cap real — one honest line, no demand-hype. */}
                  <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40">
                    We take a limited number of Reads each month.
                  </p>
                  <div className="mt-8 flex flex-col items-start gap-5">
                    <button type="button" onClick={() => { setIntent("read"); setCapIndex(0); setView("capture"); }}
                      className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">Get my Read ▸</button>
                    {/* The dual offer (P1-1): a quieter, by-application path to the Audit.
                        Same capture cards, routed as an application — no payment, no price
                        on-page. Tracked distinctly as `audit_apply_click`. */}
                    <button type="button"
                      onClick={() => { track("audit_apply_click", { variant, type: TYPES[typeKey].name }); setIntent("audit"); setCapIndex(0); setView("capture"); }}
                      className="ac-link font-mono text-[11px] uppercase tracking-[0.18em] text-fg/45">
                      Or apply for the Audit →
                    </button>
                  </div>
                  <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35">
                    The people with the best eye are the ones who knew to ask.
                  </p>
                </div>
              </motion.div>
            )}

            {view === "capture" && (
              <motion.div key={`c${capId}`} ref={cardRef} {...fade}>{renderCapture()}</motion.div>
            )}

            {view === "done" && (
              <motion.div key="done" {...fade}>
                <span className={labelCls}>Patina · In Confidence</span>
                <h2 className="mt-8 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">Received.</h2>
                <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
                  We read every application, in confidence. If there&apos;s a fit, you&apos;ll hear from us — privately, and not from a list.
                </p>
                <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/30">Fewer things. Better ones.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {showHeader && (
        <footer className="px-6 pb-12 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <button type="button" onClick={back} className="ac-link font-mono text-[12px] uppercase tracking-[0.15em]">◂ Back</button>
            {view === "capture" ? (
              <div className="flex items-center gap-6">
                {error && <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60 max-w-[16rem] text-right">{error}</span>}
                <button type="button" onClick={next} disabled={!canContinue() || status === "submitting"}
                  className="ac-btn font-mono text-[12px] uppercase tracking-[0.15em] px-7 py-3 disabled:opacity-25 disabled:pointer-events-none">
                  {capIndex === CAPTURE.length - 1
                    ? status === "submitting"
                      ? intent === "audit" ? "Submitting…" : willPay ? "To checkout…" : "Sending…"
                      : intent === "audit" ? "Apply ▸" : willPay ? "Pay €150 ▸" : "Submit ▸"
                    : "Continue ▸"}
                </button>
              </div>
            ) : card.kind === "text" || card.kind === "oblique" ? (
              <button type="button" onClick={advanceText} className="ac-btn font-mono text-[12px] uppercase tracking-[0.15em] px-7 py-3">Continue ▸</button>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-fg/25">Choose one</span>
            )}
          </div>
        </footer>
      )}
    </div>
  );

  function renderCapture() {
    switch (capId) {
      case "name":
        return (<Field q="Your name."><input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className={inputCls} /></Field>);
      case "email":
        return (<Field q="Where can we reach you?" hint="In private."><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputCls} /></Field>);
      case "consent": {
        // The Audit path is by-application: no price on-page, no checkout note.
        // The Read path keeps the €150 / secure-checkout framing (when willPay).
        const isAudit = intent === "audit";
        const payRead = willPay && !isAudit;
        return (
          <Field
            q={isAudit ? "Your application." : "Your Read."}
            hint={isAudit ? "By application." : payRead ? "€150 · Credited toward an Audit · Delivered within 48h." : "By application."}
          >
            <label className="flex items-start gap-4 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 accent-fg" data-autofocus />
              <span className="text-fg/60 text-lg leading-relaxed max-w-md">
                {isAudit
                  ? "I agree that Patina may keep and use what I share to consider my application, in confidence — per the privacy policy."
                  : "I agree that Patina may keep and use what I share to prepare my Read, in confidence — per the privacy policy."}
              </span>
            </label>
            {payRead && (
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35 leading-relaxed max-w-md">
                Next: secure checkout — €150. Your Read is prepared once payment is received.
              </p>
            )}
          </Field>
        );
      }
      default:
        return null;
    }
  }
}

function Field({ q, hint, children }: { q: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">{q}</h2>
      {hint && <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35">{hint}</p>}
      <div className="mt-10">{children}</div>
    </div>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, easeOut } from "framer-motion";
import { compressImage, type UploadedImage } from "./compressImage";
import { track } from "@/lib/track";

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
type TestCard = InstinctCard | TextCard;

// ── Fixed framing beats (unscored human texture). Sweet opens; inkblot sits mid-test.
const SWEET_CARD: TextCard = { kind: "text", field: "sweet", lead: "What was your favourite sweet as a child?", hint: "It tells us more than you think.", placeholder: "In a word or two." };
const INKBLOT_CARD: TextCard = { kind: "text", field: "seen", lead: "What do you see?", hint: "There is no right answer.", placeholder: "The first thing.", inkblot: true };

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

// Build this session's TEST: fixed sweet → RE block → fixed inkblot → HV block.
// Mirrors the original beat (sweet first, inkblot mid-test) while randomising the
// scored questions. Asked-count is constant; only the pool grew.
function buildTest(): TestCard[] {
  const re = sample(POOL_RE, ASKED_PER_AXIS);
  const hv = sample(POOL_HV, ASKED_PER_AXIS);
  return [SWEET_CARD, ...re, INKBLOT_CARD, ...hv];
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
  }
}

type TypeKey = "RH" | "RV" | "EH" | "EV";
const TYPES: Record<TypeKey, { name: string; line: string; tell: string; note: string }> = {
  RH: {
    name: "The Heir",
    line: "Old money you were not born into — and you carry it more easily than most who were. You want what lasts, what is quiet, what never has to explain itself.",
    tell: "the one piece you bought to look inherited. It tries hardest — so it's the first thing the right eye finds.",
    note: "Our work with you is subtraction: removing the one false note that gives the game away.",
  },
  RV: {
    name: "The Ascetic",
    line: "Severe, modern, edited to the bone. One strange, perfect object over a hundred safe ones. To you, emptiness is not absence — it is the point.",
    tell: "you trust that less is enough. Empty rooms forgive nothing; one wrong object is the whole room.",
    note: "Our work with you is the hunt: the few pieces worth the silence around them.",
  },
  EH: {
    name: "The Connoisseur",
    line: "You love the canon, and you want all of it. Your danger is the wall of treasures — abundance that starts to read as accumulation.",
    tell: "you keep acquiring, and the wall has begun to read as a receipt, not a collection.",
    note: "Our work with you is the edit, so each piece is seen rather than counted.",
  },
  EV: {
    name: "The Provocateur",
    line: "You want to be the most interesting person in the room, and usually you are. The line you walk is the fine one between bold and costume.",
    tell: "the line between bold and costume moves — and you are usually the last in the room to feel it cross.",
    note: "Our work with you is keeping you, always, on the right side of it.",
  },
};

const CAPTURE = ["name", "email", "photos", "consent"] as const;
type CaptureId = (typeof CAPTURE)[number];
const MAX_IMAGES = 5;
// Cards ASKED per session is fixed regardless of pool size: 2 framing text cards
// (sweet + inkblot) + ASKED_PER_AXIS scored cards per axis. The progress indicator
// must reflect this asked-count, never the size of the pool we draw from.
const TEST_LEN = 2 + 2 * ASKED_PER_AXIS;
const TOTAL = TEST_LEN + CAPTURE.length;

const labelCls = "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";
const inputCls =
  "w-full bg-transparent border-b border-fg/20 py-4 text-2xl md:text-3xl font-light text-fg placeholder:text-fg/20 focus:border-fg focus:outline-none transition-colors rounded-none";

type View = "cover" | "test" | "reveal" | "capture" | "done";
type Status = "idle" | "submitting" | "error";

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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imgError, setImgError] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [variant, setVariant] = useState<Variant>("aspiration");

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
  }, []);

  useEffect(() => {
    const isInput = view === "capture" || (view === "test" && test[testIndex].kind === "text");
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
    track("read_offer_view", { variant, type: TYPES[key].name });
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

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setImgError("");
    const room = MAX_IMAGES - images.length;
    if (room <= 0) { setImgError(`Up to ${MAX_IMAGES} photographs.`); return; }
    const incoming = Array.from(fileList);
    const toAdd = incoming.slice(0, room);
    try {
      const compressed = await Promise.all(toAdd.map((f) => compressImage(f)));
      setImages((prev) => [...prev, ...compressed.map((c, i) => ({ ...c, name: toAdd[i].name }))]);
      if (incoming.length > room) setImgError(`Added the first ${room} — up to ${MAX_IMAGES}.`);
    } catch {
      setImgError("Could not read one of those — try a different file.");
    }
  }
  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));

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
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name, email, consent, company, sweet, seen,
          tasteType: typeKey ? TYPES[typeKey].name : "",
          images: images.map(({ mediaType, dataBase64 }) => ({ mediaType, dataBase64 })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please check your entries and try again.");
        return;
      }
      const typeName = typeKey ? TYPES[typeKey].name : "";
      track("audit_submit", { variant, type: typeName });

      // ★ Submit-then-pay: the application is captured (assess + operator email
      // run server-side, unchanged). Now send the buyer to the €150 Read checkout.
      // Operator matches payment ↔ application by email for the MVP.
      // fast-follow: swap the static Payment Link for a Stripe Checkout Session
      // + webhook so delivery is auto-gated on confirmed payment (no manual match).
      if (willPay) {
        track("read_checkout_click", { variant, type: typeName });
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
    else if (view === "test" && card.kind === "text") { e.preventDefault(); advanceText(); }
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
                <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40">First, a few questions. Don&apos;t think — answer.</p>
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

            {view === "reveal" && typeKey && (
              <motion.div key="reveal" {...fade}>
                <span className={labelCls}>Your type</span>
                <h1 className="mt-6 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">{TYPES[typeKey].name}</h1>
                <p className="mt-8 max-w-lg text-fg/70 text-lg leading-relaxed">{TYPES[typeKey].line}</p>

                {/* The tell — the sting. Reveal order: name → who you are → TELL → our work. */}
                <div className="mt-8 max-w-lg">
                  <span className={labelCls}>Your tell —</span>
                  <p className="mt-3 text-fg/75 leading-relaxed">{TYPES[typeKey].tell}</p>
                </div>

                <p className="mt-8 max-w-lg text-fg/55 leading-relaxed">{TYPES[typeKey].note}</p>

                {/* ★ The money moment — the €150 Read offer, in the clinical register. */}
                <div className="mt-12 border-t border-fg/15 pt-8">
                  <span className={labelCls}>The Read — €150</span>
                  <p className="mt-4 max-w-lg text-fg/70 leading-relaxed">
                    The honest read your friends are too polite to give, and your decorator is too paid to. One eye, one verdict: what to keep, what gives you away, what to acquire next. Within 48 hours, in confidence. Credited in full toward an Audit.
                  </p>
                  <p className="mt-5 max-w-lg text-fg/55 leading-relaxed">
                    If it doesn&apos;t show you something you couldn&apos;t see — it&apos;s free.
                  </p>
                  <p className="mt-7 max-w-lg text-fg/60 leading-relaxed">
                    Your Read is built from the answers you just gave. The rest is ours.
                  </p>
                  <div className="mt-8">
                    <button type="button" onClick={() => { setCapIndex(0); setView("capture"); }}
                      className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">Get my Read ▸</button>
                  </div>
                  <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35">
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
                <h2 className="mt-8 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">We have you.</h2>
                <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
                  Your application is with us, in confidence{typeKey ? ` — noted as ${TYPES[typeKey].name}` : ""}. If there is a fit, you will hear from us — privately, and not from a list.
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
                      ? willPay ? "To checkout…" : "Sending…"
                      : willPay ? "Pay €150 ▸" : "Submit ▸"
                    : "Continue ▸"}
                </button>
              </div>
            ) : card.kind === "text" ? (
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
      case "photos":
        return (
          <Field q="A few photographs help the eye." hint={`You, your rooms, your things. Up to ${MAX_IMAGES}. In confidence.`}>
            <input id="photos" type="file" accept="image/*" multiple onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              className="block w-full text-sm text-fg/50 file:mr-4 file:rounded-none file:border file:border-fg/25 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.1em] file:text-fg/70 hover:file:border-fg/60" />
            {imgError && <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60">{imgError}</p>}
            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden border border-fg/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.previewUrl} alt={img.name} className="h-full w-full object-cover" />
                    <button type="button" onClick={() => removeImage(i)} aria-label="Remove photograph"
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center border border-fg/20 bg-bg/80 text-xs leading-none text-fg">×</button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        );
      case "consent":
        return (
          <Field q="Your Read." hint={willPay ? "€150 · Credited toward an Audit · Delivered within 48h." : "By application."}>
            <label className="flex items-start gap-4 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 accent-fg" data-autofocus />
              <span className="text-fg/60 text-lg leading-relaxed max-w-md">
                I agree that Patina may keep and use what I share to prepare my Read, in confidence — per the privacy policy.
              </span>
            </label>
            {willPay && (
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35 leading-relaxed max-w-md">
                Next: secure checkout — €150. Your Read is prepared once payment is received.
              </p>
            )}
          </Field>
        );
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

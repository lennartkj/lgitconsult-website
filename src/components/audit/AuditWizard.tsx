"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, easeOut } from "framer-motion";
import { compressImage, type UploadedImage } from "./compressImage";
import { track } from "@/lib/track";

// Cover message A/B (MARKET.md §4). Sticky per visitor; tagged on funnel events.
const VARIANTS = ["capital", "refuge", "invitation"] as const;
type Variant = (typeof VARIANTS)[number];
const HEADLINES: Record<Variant, { title: string; body: string }> = {
  capital: {
    title: "You have the capital. We have the culture.",
    body: "Money comes quickly. Taste does not. We have spent the years, so your means are matched at last by your eye.",
  },
  refuge: {
    title: "Ask what you can't ask anyone.",
    body: "An honest read of what you own and how it reads, given in private and kept between us. The judgment is yours alone.",
  },
  invitation: {
    title: "The eye, by application.",
    body: "We work with few, and closely. A quiet, unhurried read of what you own, wear, and collect — and what is worth your attention next.",
  },
};

// The instinct test. Either/or choices nudge two hidden axes:
//   Restraint (R) ↔ Expression (E)   ·   Heritage (H) ↔ Avant-garde (V)
// Two "flavour" text cards (sweet, inkblot) carry no score — human texture only.
type Pole = "R" | "E" | "H" | "V";
type TestCard =
  | { kind: "instinct"; lead: string; left: { label: string; v: Pole }; right: { label: string; v: Pole } }
  | { kind: "text"; field: "sweet" | "seen"; lead: string; hint: string; placeholder: string; inkblot?: boolean };

const TEST: TestCard[] = [
  { kind: "text", field: "sweet", lead: "What was your favourite sweet as a child?", hint: "It tells us more than you think.", placeholder: "In a word or two." },
  { kind: "instinct", lead: "A room should —", left: { label: "Whisper", v: "R" }, right: { label: "Announce", v: "E" } },
  { kind: "instinct", lead: "The material —", left: { label: "Marble", v: "H" }, right: { label: "Steel", v: "V" } },
  { kind: "text", field: "seen", lead: "What do you see?", hint: "There is no right answer.", placeholder: "The first thing.", inkblot: true },
  { kind: "instinct", lead: "On the wall —", left: { label: "One perfect thing", v: "R" }, right: { label: "A hundred", v: "E" } },
  { kind: "instinct", lead: "You would rather own —", left: { label: "The first edition", v: "H" }, right: { label: "The latest thing", v: "V" } },
  { kind: "instinct", lead: "Closer to you —", left: { label: "Silver", v: "R" }, right: { label: "Gold", v: "E" } },
  { kind: "instinct", lead: "The best things are —", left: { label: "Inherited", v: "H" }, right: { label: "Discovered", v: "V" } },
];

type TypeKey = "RH" | "RV" | "EH" | "EV";
const TYPES: Record<TypeKey, { name: string; line: string; note: string }> = {
  RH: {
    name: "The Heir",
    line: "Old money you were not born into — and you carry it more easily than most who were. You want what lasts, what is quiet, what never has to explain itself.",
    note: "Our work with you is subtraction: removing the one false note that gives the game away.",
  },
  RV: {
    name: "The Ascetic",
    line: "Severe, modern, edited to the bone. One strange, perfect object over a hundred safe ones. To you, emptiness is not absence — it is the point.",
    note: "Our work with you is the hunt: the few pieces worth the silence around them.",
  },
  EH: {
    name: "The Connoisseur",
    line: "You love the canon, and you want all of it. Your danger is the wall of treasures — abundance that starts to read as accumulation.",
    note: "Our work with you is the edit, so each piece is seen rather than counted.",
  },
  EV: {
    name: "The Provocateur",
    line: "You want to be the most interesting person in the room, and usually you are. The line you walk is the fine one between bold and costume.",
    note: "Our work with you is keeping you, always, on the right side of it.",
  },
};

const CAPTURE = ["name", "email", "budget", "photos", "consent"] as const;
type CaptureId = (typeof CAPTURE)[number];
const BUDGET_OPTIONS = ["Just exploring", "€10k – €50k", "€50k – €250k", "€250k +"];
const MAX_IMAGES = 5;
const TOTAL = TEST.length + CAPTURE.length;

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

export default function AuditWizard() {
  const reduce = useReducedMotion();

  const [view, setView] = useState<View>("cover");
  const [testIndex, setTestIndex] = useState(0);
  const [capIndex, setCapIndex] = useState(0);
  const [picks, setPicks] = useState<Pole[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [typeKey, setTypeKey] = useState<TypeKey | null>(null);

  const [sweet, setSweet] = useState("");
  const [seen, setSeen] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imgError, setImgError] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [variant, setVariant] = useState<Variant>("capital");

  const cardRef = useRef<HTMLDivElement>(null);
  const capId: CaptureId = CAPTURE[capIndex];
  const card = TEST[testIndex];

  useEffect(() => {
    let v: Variant = "capital";
    try {
      const stored = window.localStorage.getItem("patina_audit_variant");
      if (stored && stored in HEADLINES) v = stored as Variant;
      else {
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
    const isInput = view === "capture" || (view === "test" && TEST[testIndex].kind === "text");
    if (!isInput) return;
    const t = setTimeout(() => {
      cardRef.current
        ?.querySelector<HTMLElement>("input:not([type=checkbox]):not([tabindex='-1']), [data-autofocus]")
        ?.focus();
    }, 70);
    return () => clearTimeout(t);
  }, [view, testIndex, capIndex]);

  function computeReveal(arr: Pole[]) {
    const r = arr.filter((p) => p === "R").length;
    const e = arr.filter((p) => p === "E").length;
    const h = arr.filter((p) => p === "H").length;
    const v = arr.filter((p) => p === "V").length;
    const key = (`${r >= e ? "R" : "E"}${h >= v ? "H" : "V"}`) as TypeKey;
    setTypeKey(key);
    track("type", { type: TYPES[key].name });
    setView("reveal");
  }

  function answer(label: string, pole: Pole) {
    if (picked) return;
    setPicked(label);
    const next = [...picks, pole];
    setPicks(next);
    const last = testIndex === TEST.length - 1;
    window.setTimeout(() => {
      setPicked(null);
      if (!last) setTestIndex((i) => i + 1);
      else computeReveal(next);
    }, 220);
  }

  function advanceText() {
    if (testIndex < TEST.length - 1) setTestIndex((i) => i + 1);
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

  function selectBudget(b: string) {
    setBudget(b);
    window.setTimeout(() => setCapIndex((i) => Math.min(i + 1, CAPTURE.length - 1)), 220);
  }

  function canContinue(): boolean {
    switch (capId) {
      case "name": return name.trim().length >= 2;
      case "email": return /\S+@\S+\.\S+/.test(email);
      case "budget": return budget !== "";
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
          name, email, budget, consent, company, sweet, seen,
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
      track("audit_submit", { variant, type: typeKey ? TYPES[typeKey].name : "" });
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
      if (TEST[testIndex - 1].kind === "instinct") setPicks((p) => p.slice(0, -1));
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

  const stepNo = view === "test" ? testIndex + 1 : view === "capture" ? TEST.length + capIndex + 1 : 0;
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
                  <button type="button" onClick={() => { track("audit_begin", { variant }); setPicks([]); setTestIndex(0); setView("test"); }}
                    className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">Begin ▸</button>
                  <a href="/audit/read" onClick={() => track("read_click")} className="ac-link font-mono text-[11px] uppercase tracking-[0.15em]">Not ready? The Read ▸</a>
                  <a href="/audit/gift" onClick={() => track("gift_click")} className="ac-link font-mono text-[11px] uppercase tracking-[0.15em]">A gift? ▸</a>
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
                <p className="mt-6 max-w-lg text-fg/55 leading-relaxed">{TYPES[typeKey].note}</p>
                <div className="mt-12">
                  <button type="button" onClick={() => { setCapIndex(0); setView("capture"); }}
                    className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">Continue ▸</button>
                </div>
                <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.2em] text-fg/35">We will build your Audit around this.</p>
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
                  {capIndex === CAPTURE.length - 1 ? (status === "submitting" ? "Sending…" : "Submit ▸") : "Continue ▸"}
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
      case "budget":
        return (
          <Field q="What do you spend when something is right?" hint="It only helps us aim.">
            <div className="border-t border-fg/15">
              {BUDGET_OPTIONS.map((b) => (
                <button key={b} type="button" aria-pressed={budget === b} onClick={() => selectBudget(b)}
                  className="ac-row flex w-full cursor-pointer select-none items-center justify-between border-b border-fg/15 py-5 pl-4 text-left hover:pl-6 transition-all">
                  <span className="text-xl font-light">{b}</span>
                  <span className="ac-swatch mr-4 h-2.5 w-2.5 rotate-45" />
                </button>
              ))}
            </div>
          </Field>
        );
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
          <Field q="Before we begin." hint="By application.">
            <label className="flex items-start gap-4 cursor-pointer">
              <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-1.5 accent-fg" data-autofocus />
              <span className="text-fg/60 text-lg leading-relaxed max-w-md">
                I agree that Patina may keep and use what I share to respond to my application, in confidence — per the privacy policy.
              </span>
            </label>
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

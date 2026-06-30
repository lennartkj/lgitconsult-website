"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, easeOut } from "framer-motion";
import { compressImage, type UploadedImage } from "./compressImage";
import { track } from "@/lib/track";
import { fbqTrack } from "@/lib/metaPixel";

// ── The post-payment Read intake (QUESTIONS.md §3 "READ INTAKE — a confession").
// Shown on the Stripe success page (/audit/received) AFTER the €150 is paid — never
// before (that would reintroduce abandonment at the worst point). It reads the
// free-test answers the wizard pinned to localStorage (so the experience is
// continuous and we submit ONE combined payload), then asks the deep questions in
// DESCENDING SAFETY.
//
// REGISTER (revised 2026-06-30 after a real smoke test): WARM, perceptive, direct,
// on-your-side — a trusted friend who happens to have an extraordinary eye, genuinely
// curious about you and where you're trying to get to. Still elegant + intelligent
// (no emoji, no hype, not chatty), but warm + clear, never cold/clinical/oblique. We
// OPEN warm (goal + occasion set the friendly tone), then ask what changed, who you
// want to feel at ease around (aspiration, not fear), where the eye starts, the
// budget, the photos (SPECIFIC prompts driven by the focus you chose), and finally a
// gentle "anything you've been wondering about" — the honest second opinion a good
// friend would give, not a sting.
//
// On submit it POSTs the COMBINED payload to /api/audit with phase:"read-intake",
// keyed by email — the operator gets the full intake AND the meaningful assess runs
// there (the near-blind initial assess is gone). If the buyer drops the intake, the
// operator already has the order + the free-test data from the initial submit and
// can still deliver — this surface is graceful, not load-bearing.

const labelCls = "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";
const inputCls =
  "w-full bg-transparent border-b border-fg/20 py-4 text-2xl md:text-3xl font-light text-fg placeholder:text-fg/20 focus:border-fg focus:outline-none transition-colors rounded-none";
const MAX_IMAGES = 5;

// The free-test answers the wizard pinned before the Stripe redirect.
type FreeTest = {
  email?: string;
  name?: string;
  tasteType?: string;
  trigger?: string; // key, e.g. "place"
  sweet?: string;
  seen?: string;
  tell?: string;
  variant?: string;
};

// R3 · the surfaces the eye starts on (multi-select). Each carries the SPECIFIC,
// warm photo prompt it should generate at R5, and the surface tag those photos get.
const FOCUS_OPTIONS = [
  {
    label: "The room I walk guests into",
    prompt: "Show us the room as it is now — however it looks today.",
    surface: "A room",
  },
  {
    label: "The wardrobe",
    prompt: "Show us a few pieces you reach for most — and one you're unsure about.",
    surface: "Wardrobe",
  },
  {
    label: "The walls",
    prompt: "Show us your walls — whatever's hanging there now.",
    surface: "On the wall",
  },
  {
    label: "The watch",
    prompt: "Show us the watch — on the wrist or off, however you like.",
    surface: "Something I collect",
  },
  {
    label: "The table",
    prompt: "Show us the table — set, or just as it lives day to day.",
    surface: "A room",
  },
  {
    label: "What I collect",
    prompt: "Show us the pieces — the ones you'd point to first.",
    surface: "Something I collect",
  },
] as const;

// R4 · budget bands (single-select, auto-advance).
const BUDGET_BANDS = [
  "Under €1k",
  "€1–5k",
  "€5–25k",
  "€25k+",
  "Whatever it takes, if it's right",
] as const;

// R5 · the surface a photo shows (per-photo select — kept so an off-prompt extra
// photo can still be tagged; the dynamic prompts pre-tag each upload).
const SURFACES = ["A room", "Wardrobe", "On the wall", "Something I collect", "Me"] as const;

// The general fallback prompt when the client selected no focus areas at R3.
const GENERAL_PHOTO_PROMPT = {
  prompt: "Show us a few things you'd most like an honest eye on.",
  surface: SURFACES[0] as string,
};

type IntakeImage = UploadedImage & { surface: string; caption: string };

// Steps, in WARM order then descending safety. The two warm openers (goal, occasion)
// come first to set the friendly tone; focus (r3) comes BEFORE photos (r5) so it can
// drive the specific photo prompts.
const STEPS = ["intro", "goal", "occasion", "r1", "r2", "r3", "r4", "r5", "r6"] as const;
type Step = (typeof STEPS)[number];

type Status = "idle" | "submitting" | "error" | "done";

function Field({ q, hint, children }: { q: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">{q}</h2>
      {hint && <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35">{hint}</p>}
      <div className="mt-10">{children}</div>
    </div>
  );
}

export default function ReadIntake() {
  const reduce = useReducedMotion();

  const [freeTest, setFreeTest] = useState<FreeTest>({});
  const [stepIndex, setStepIndex] = useState(0);
  const step: Step = STEPS[stepIndex];

  // The deep answers.
  const [goal, setGoal] = useState(""); // warm opener — goals / aspiration
  const [occasion, setOccasion] = useState(""); // the occasion / anchor
  const [about, setAbout] = useState(""); // R1 — what changed
  const [audience, setAudience] = useState(""); // R2 — who you want to feel at ease around
  const [focus, setFocus] = useState<string[]>([]); // R3
  const [budget, setBudget] = useState(""); // R4
  const [images, setImages] = useState<IntakeImage[]>([]); // R5
  const [imgError, setImgError] = useState("");
  const [unsurePiece, setUnsurePiece] = useState(""); // R6 — the honest second opinion

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  // On load: fire the revenue event (was in ReadReceived) and read the free-test
  // answers the wizard pinned. Same-origin localStorage survives the Stripe redirect.
  useEffect(() => {
    let ft: FreeTest = {};
    let variant = "unknown";
    try {
      const raw = window.localStorage.getItem("patina_freetest");
      if (raw) ft = JSON.parse(raw) as FreeTest;
      variant = ft.variant || window.localStorage.getItem("patina_audit_variant") || "unknown";
    } catch {
      /* no localStorage → email-only continuity; the intake still works */
    }
    setFreeTest(ft);
    // `read_paid` (the revenue event) fires here — reaching this page is the
    // payment proxy in the Payment-Link MVP, unchanged from ReadReceived.
    track("read_paid", { variant });
    track("read_intake_view", { variant });
    // Meta pixel: the €150 Read purchase. CAVEAT — the static Stripe Payment Link
    // means this (like `read_paid` above) fires on ANY direct /audit/received hit,
    // not only confirmed payments. The Stripe Checkout Session + webhook fast-follow
    // (noted in BUILD.md) makes Purchase accurate; until then the Stripe dashboard
    // is the revenue source of truth. content_name carries the variant.
    fbqTrack("Purchase", { value: 150, currency: "EUR", content_name: variant, content_category: "read" });
  }, []);

  // Focus the text input when a typed card appears.
  useEffect(() => {
    if (status === "done") return;
    if (step === "goal" || step === "occasion" || step === "r1" || step === "r2" || step === "r6") {
      const t = setTimeout(() => {
        cardRef.current?.querySelector<HTMLElement>("input, textarea")?.focus();
      }, 70);
      return () => clearTimeout(t);
    }
  }, [step, status]);

  function toggleFocus(opt: string) {
    setFocus((prev) => (prev.includes(opt) ? prev.filter((f) => f !== opt) : [...prev, opt]));
  }

  // The dynamic, focus-driven photo prompts. One SPECIFIC prompt per focus area the
  // client chose at R3 (each pre-tags its uploads with the right surface). If they
  // chose nothing, fall back to a single warm general prompt.
  const photoPrompts =
    focus.length > 0
      ? FOCUS_OPTIONS.filter((o) => focus.includes(o.label)).map((o) => ({
          label: o.label,
          prompt: o.prompt,
          surface: o.surface as string,
        }))
      : [{ label: "", prompt: GENERAL_PHOTO_PROMPT.prompt, surface: GENERAL_PHOTO_PROMPT.surface }];

  async function handleFiles(fileList: FileList | null, surface: string) {
    if (!fileList || fileList.length === 0) return;
    setImgError("");
    const room = MAX_IMAGES - images.length;
    if (room <= 0) { setImgError(`Up to ${MAX_IMAGES} photographs.`); return; }
    const incoming = Array.from(fileList);
    const toAdd = incoming.slice(0, room);
    try {
      const compressed = await Promise.all(toAdd.map((f) => compressImage(f)));
      setImages((prev) => [
        ...prev,
        // Pre-tag each upload with the surface from the prompt it came from; keep the
        // optional note empty for the client to fill.
        ...compressed.map((c, i) => ({ ...c, name: toAdd[i].name, surface, caption: "" })),
      ]);
      if (incoming.length > room) setImgError(`Added the first ${room} — up to ${MAX_IMAGES}.`);
    } catch {
      setImgError("Could not read one of those — try a different file.");
    }
  }
  const removeImage = (i: number) => setImages((prev) => prev.filter((_, idx) => idx !== i));
  const setSurface = (i: number, surface: string) =>
    setImages((prev) => prev.map((img, idx) => (idx === i ? { ...img, surface } : img)));
  const setCaption = (i: number, caption: string) =>
    setImages((prev) => prev.map((img, idx) => (idx === i ? { ...img, caption } : img)));

  // R4 budget auto-advances on select (Typeform-style).
  function chooseBudget(band: string) {
    setBudget(band);
    window.setTimeout(() => advance(), 200);
  }

  function advance() {
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1);
    else submit();
  }
  function back() {
    setError("");
    if (stepIndex > 0) setStepIndex((i) => i - 1);
  }

  async function submit() {
    setStatus("submitting");
    setError("");
    // Resolve the trigger label from the free-test key, then fold R1 into `about`
    // so the eye reads the full why-now in the client's own words.
    const triggerLabel = freeTest.trigger || "";
    const about_full = [triggerLabel ? `Why now (chip): ${triggerLabel}.` : "", about.trim()]
      .filter(Boolean)
      .join(" ");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phase: "read-intake",
          intent: "read",
          // Carried from the free test (matched by email), so it's ONE combined
          // payload — consent was given at the free test, not re-collected here.
          name: freeTest.name || "Read client",
          email: freeTest.email || "",
          tasteType: freeTest.tasteType || "",
          trigger: triggerLabel,
          sweet: freeTest.sweet || "",
          seen: freeTest.seen || "",
          tell: freeTest.tell || "",
          // The deep answers.
          goal: goal.trim(),
          occasion: occasion.trim(),
          about: about_full,
          audience: audience.trim(),
          focus,
          budget: budget,
          unsurePiece: unsurePiece.trim(),
          images: images.map(({ mediaType, dataBase64, surface, caption }) => ({
            mediaType,
            dataBase64,
            surface,
            caption,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please check your entries and try again.");
        return;
      }
      track("read_intake_submit", { variant: freeTest.variant || "unknown" });
      // Clear the pinned free-test answers — they've been submitted.
      try { window.localStorage.removeItem("patina_freetest"); } catch { /* noop */ }
      setStatus("done");
    } catch {
      setStatus("error");
      setError("There was an error sending your answers. Please try again.");
    }
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter") return;
    if ((e.target as HTMLElement).tagName === "TEXTAREA") return;
    if (step === "r2") { e.preventDefault(); advance(); }
  }

  const fade = reduce
    ? {}
    : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -12 }, transition: { duration: 0.45, ease: easeOut } };

  // The calm, warm done-state.
  if (status === "done") {
    return (
      <div className="audit-clinical flex min-h-screen flex-col items-center justify-center bg-bg text-fg px-6 py-16 sm:px-10">
        <div className="w-full max-w-xl">
          <motion.div {...(reduce ? {} : { initial: { opacity: 0, y: 12 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: easeOut } })}>
            <span className={labelCls}>Patina · In Confidence</span>
            <h1 className="mt-8 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">Thank you.</h1>
            <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
              We have everything we need. Your Read is being written by hand —
              honestly, and on your side — and it reaches you within 48 hours, in
              confidence.
            </p>
            <p className="mt-6 max-w-md text-fg/55 leading-relaxed">
              The €150 is credited in full toward an Audit, should you want to go
              further.
            </p>
            <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/30">Fewer things. Better ones.</p>
          </motion.div>
        </div>
      </div>
    );
  }

  const showFooter = step !== "intro" && step !== "r4";
  const total = STEPS.length - 1; // intro is framing, not a numbered step
  const stepNo = stepIndex; // intro = 0; goal = 1; …

  return (
    <div className="audit-clinical relative flex min-h-screen flex-col bg-bg text-fg" onKeyDown={onKeyDown}>
      {step !== "intro" && (
        <header className="px-6 pt-8 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-baseline justify-between">
            <span className={labelCls}>Patina · Your Read</span>
            <span className={labelCls}>{String(stepNo).padStart(2, "0")} / {String(total).padStart(2, "0")}</span>
          </div>
          <div className="mx-auto mt-4 h-px max-w-2xl" style={{ background: "color-mix(in srgb, var(--fg) 15%, transparent)" }}>
            <motion.div className="h-px" style={{ background: "var(--fg)" }} initial={false}
              animate={{ width: `${(stepNo / total) * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: easeOut }} />
          </div>
        </header>
      )}

      <div className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {step === "intro" && (
              <motion.div key="intro" {...fade}>
                <span className={labelCls}>Patina · In Confidence</span>
                <h1 className="mt-8 max-w-2xl text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">
                  Thank you — now, tell us about you.
                </h1>
                <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
                  A few questions, the way a friend with a good eye would ask them.
                  There are no wrong answers — the more you share, the more useful and
                  personal your Read will be.
                </p>
                <p className="mt-6 max-w-md text-fg/55 leading-relaxed">
                  It takes a few minutes. Everything stays between us, and your Read
                  reaches you within 48 hours.
                </p>
                <div className="mt-12">
                  <button type="button" onClick={() => setStepIndex(1)}
                    className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4">Begin ▸</button>
                </div>
              </motion.div>
            )}

            {/* GOAL · the warm, forward-looking opener — sets a friendly tone. */}
            {step === "goal" && (
              <motion.div key="goal" ref={cardRef} {...fade}>
                <Field q="When this is all working — how do you want to feel?" hint="And who do you want to feel completely at ease around?">
                  <textarea rows={3} value={goal} onChange={(e) => setGoal(e.target.value)}
                    placeholder="At home in your own taste — easy in any room, with the people you most respect…"
                    className={`${inputCls} resize-none text-xl md:text-2xl`} />
                </Field>
              </motion.div>
            )}

            {/* OCCASION · a concrete anchor + a soft deadline. */}
            {step === "occasion" && (
              <motion.div key="occasion" ref={cardRef} {...fade}>
                <Field q="Is there a moment this is for?" hint="A move, an evening, a new chapter — tell us what, and roughly when.">
                  <textarea rows={3} value={occasion} onChange={(e) => setOccasion(e.target.value)}
                    placeholder="A new home in the spring, a dinner I'm hosting, the year I finally get this right…"
                    className={`${inputCls} resize-none text-xl md:text-2xl`} />
                </Field>
              </motion.div>
            )}

            {/* R1 · what changed — warm, curious. */}
            {step === "r1" && (
              <motion.div key="r1" ref={cardRef} {...fade}>
                <Field q="What made you want a fresh eye on this now?" hint="Tell it however you'd tell a friend — the real version.">
                  <textarea rows={3} value={about} onChange={(e) => setAbout(e.target.value)}
                    placeholder="A move, a new chapter, a room you can't quite finish, a feeling something's a little off…"
                    className={`${inputCls} resize-none text-xl md:text-2xl`} />
                </Field>
              </motion.div>
            )}

            {/* R2 · audience — ASPIRATION-framed, not fear-framed. */}
            {step === "r2" && (
              <motion.div key="r2" ref={cardRef} {...fade}>
                <Field q="Who do you most want to feel at ease around?" hint="Whose company would feel like a win to feel completely yourself in?">
                  <input type="text" value={audience} onChange={(e) => setAudience(e.target.value)}
                    placeholder="A partner's family, a circle you admire, a board, people whose taste you respect…"
                    className={inputCls} />
                </Field>
              </motion.div>
            )}

            {/* R3 · focus (multi-select) — moved BEFORE photos so it drives the prompts. */}
            {step === "r3" && (
              <motion.div key="r3" {...fade}>
                <Field q="Where would you like us to look first?" hint="Choose anything that matters to you — we'll ask for a few photos next.">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {FOCUS_OPTIONS.map((opt) => (
                      <button key={opt.label} type="button" aria-pressed={focus.includes(opt.label)}
                        onClick={() => toggleFocus(opt.label)}
                        className="ac-chip flex items-center justify-center px-6 py-6 text-lg font-light tracking-tight cursor-pointer select-none text-center">
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* R4 · budget band (single-select, auto-advance). */}
            {step === "r4" && (
              <motion.div key="r4" {...fade}>
                <Field q="When you bring in something you love these days —" hint="A real piece, not a coffee. Roughly what does it tend to cost?">
                  <div className="grid grid-cols-1 gap-3">
                    {BUDGET_BANDS.map((band) => (
                      <button key={band} type="button" aria-pressed={budget === band}
                        onClick={() => chooseBudget(band)}
                        className="ac-chip flex items-center justify-center px-6 py-6 text-lg font-light tracking-tight cursor-pointer select-none">
                        {band}
                      </button>
                    ))}
                  </div>
                </Field>
              </motion.div>
            )}

            {/* R5 · DYNAMIC captioned photos — one specific prompt per focus chosen at R3. */}
            {step === "r5" && (
              <motion.div key="r5" {...fade}>
                <Field q="Now, show us a little." hint={`Up to ${MAX_IMAGES} photos, in total. In confidence — no need to tidy first.`}>
                  {/* One prompt per focus area selected (or a single general prompt). */}
                  <div className="space-y-7">
                    {photoPrompts.map((p, pi) => (
                      <div key={pi}>
                        <p className="text-lg md:text-xl font-light leading-snug text-fg/80">{p.prompt}</p>
                        <input id={`r-photos-${pi}`} type="file" accept="image/*" multiple
                          onChange={(e) => { handleFiles(e.target.files, p.surface); e.target.value = ""; }}
                          className="mt-3 block w-full text-sm text-fg/50 file:mr-4 file:rounded-none file:border file:border-fg/25 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.1em] file:text-fg/70 hover:file:border-fg/60" />
                      </div>
                    ))}
                  </div>
                  {imgError && <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60">{imgError}</p>}
                  {images.length > 0 && (
                    <div className="mt-8 space-y-6">
                      {images.map((img, i) => (
                        <div key={i} className="flex gap-4">
                          <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-fg/15">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={img.previewUrl} alt={img.name} className="h-full w-full object-cover" />
                            <button type="button" onClick={() => removeImage(i)} aria-label="Remove photograph"
                              className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center border border-fg/20 bg-bg/80 text-xs leading-none text-fg">×</button>
                          </div>
                          <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap gap-2">
                              {SURFACES.map((s) => (
                                <button key={s} type="button" aria-pressed={img.surface === s}
                                  onClick={() => setSurface(i, s)}
                                  className="ac-chip px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] cursor-pointer select-none">
                                  {s}
                                </button>
                              ))}
                            </div>
                            <input type="text" value={img.caption} onChange={(e) => setCaption(i, e.target.value)}
                              placeholder="Want to add a note? (optional) — e.g. the one I'm unsure about"
                              className="w-full bg-transparent border-b border-fg/20 py-1.5 text-sm font-light text-fg placeholder:text-fg/25 focus:border-fg focus:outline-none transition-colors rounded-none" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Field>
              </motion.div>
            )}

            {/* R6 · the honest second opinion — warm, friendly, not a sting. */}
            {step === "r6" && (
              <motion.div key="r6" ref={cardRef} {...fade}>
                <Field q="Anything you've been wondering about?" hint="A piece, a choice — something you'd love an honest, friendly read on.">
                  <textarea rows={3} value={unsurePiece} onChange={(e) => setUnsurePiece(e.target.value)}
                    placeholder="The thing you keep going back and forth on — tell us what it is, and what drew you to it…"
                    className={`${inputCls} resize-none text-xl md:text-2xl`} />
                </Field>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {step !== "intro" && (
        <footer className="px-6 pb-12 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <button type="button" onClick={back} disabled={status === "submitting"}
              className="ac-link font-mono text-[12px] uppercase tracking-[0.15em] disabled:opacity-30">◂ Back</button>
            {showFooter && (
              <div className="flex items-center gap-6">
                {error && <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60 max-w-[16rem] text-right">{error}</span>}
                <button type="button" onClick={advance} disabled={status === "submitting"}
                  className="ac-btn font-mono text-[12px] uppercase tracking-[0.15em] px-7 py-3 disabled:opacity-25 disabled:pointer-events-none">
                  {step === "r6"
                    ? status === "submitting" ? "Sending…" : "Finish ▸"
                    : "Continue ▸"}
                </button>
              </div>
            )}
          </div>
        </footer>
      )}
    </div>
  );
}

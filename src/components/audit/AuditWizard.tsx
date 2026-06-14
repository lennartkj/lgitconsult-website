"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  easeOut,
} from "framer-motion";
import { compressImage, type UploadedImage } from "./compressImage";

const FOCUS_OPTIONS = [
  "Wardrobe",
  "Art",
  "Interiors & objects",
  "A collection",
  "Overall presence",
];

const BUDGET_OPTIONS = [
  "Just exploring",
  "€10k – €50k",
  "€50k – €250k",
  "€250k +",
];

const MAX_IMAGES = 5;

// The ordered intake steps (the cover + confirmation are separate "views").
type StepId =
  | "name"
  | "email"
  | "focus"
  | "budget"
  | "about"
  | "links"
  | "photos"
  | "consent";

const STEPS: { id: StepId; optional?: boolean }[] = [
  { id: "name" },
  { id: "email" },
  { id: "focus" },
  { id: "budget" },
  { id: "about" },
  { id: "links", optional: true },
  { id: "photos", optional: true },
  { id: "consent" },
];

type View = "cover" | "form" | "done";
type Status = "idle" | "submitting" | "error";

const labelCls =
  "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";
const inputCls =
  "w-full bg-transparent border-b border-fg/20 py-4 text-2xl md:text-3xl font-light text-fg placeholder:text-fg/20 focus:border-fg focus:outline-none transition-colors rounded-none";

export default function AuditWizard() {
  const reduce = useReducedMotion();

  const [view, setView] = useState<View>("cover");
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [about, setAbout] = useState("");
  const [links, setLinks] = useState("");
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [imgError, setImgError] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState(""); // honeypot

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const cardRef = useRef<HTMLDivElement>(null);

  const current = STEPS[step];

  // Move focus to the first field of each step.
  useEffect(() => {
    if (view !== "form") return;
    const t = setTimeout(() => {
      const el = cardRef.current?.querySelector<HTMLElement>(
        "input:not([type=checkbox]):not([tabindex='-1']), textarea, [data-autofocus]"
      );
      el?.focus();
    }, 60);
    return () => clearTimeout(t);
  }, [step, view]);

  const toggleFocus = (option: string) =>
    setFocus((prev) =>
      prev.includes(option)
        ? prev.filter((f) => f !== option)
        : [...prev, option]
    );

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setImgError("");
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      setImgError(`Up to ${MAX_IMAGES} photographs.`);
      return;
    }
    const incoming = Array.from(fileList);
    const toAdd = incoming.slice(0, room);
    try {
      const compressed = await Promise.all(toAdd.map((f) => compressImage(f)));
      setImages((prev) => [
        ...prev,
        ...compressed.map((c, i) => ({ ...c, name: toAdd[i].name })),
      ]);
      if (incoming.length > room) {
        setImgError(`Added the first ${room} — up to ${MAX_IMAGES}.`);
      }
    } catch {
      setImgError("Could not read one of those — try a different file.");
    }
  }

  const removeImage = (i: number) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  // Single-select → confirm with a beat, then advance (Typeform-style).
  function selectBudget(b: string) {
    setBudget(b);
    window.setTimeout(
      () => setStep((s) => (s < STEPS.length - 1 ? s + 1 : s)),
      240
    );
  }

  function canContinue(): boolean {
    switch (current.id) {
      case "name":
        return name.trim().length >= 2;
      case "email":
        return /\S+@\S+\.\S+/.test(email);
      case "focus":
        return focus.length >= 1;
      case "budget":
        return budget !== "";
      case "about":
        return about.trim().length >= 10;
      case "consent":
        return consent;
      default:
        return true; // optional steps (links, photos)
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
          name, email, focus, budget, about, links, consent, company,
          images: images.map(({ mediaType, dataBase64 }) => ({ mediaType, dataBase64 })),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please check your entries and try again.");
        return;
      }
      setStatus("idle");
      setView("done");
    } catch {
      setStatus("error");
      setError("There was an error sending your application. Please try again.");
    }
  }

  function next() {
    if (!canContinue()) return;
    if (step === STEPS.length - 1) {
      submit();
      return;
    }
    setStep((s) => s + 1);
  }

  function back() {
    setError("");
    if (step === 0) {
      setView("cover");
      return;
    }
    setStep((s) => s - 1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || view !== "form") return;
    const tag = (e.target as HTMLElement).tagName;
    if (tag === "TEXTAREA") return; // let textareas take newlines
    if (canContinue()) {
      e.preventDefault();
      next();
    }
  }

  const fade = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -12 },
        transition: { duration: 0.45, ease: easeOut },
      };

  return (
    <div className="audit-clinical relative flex min-h-screen flex-col bg-bg text-fg">
      {/* Honeypot — off-screen; humans never fill it. */}
      <div
        aria-hidden="true"
        className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="company">Company</label>
        <input
          id="company" type="text" tabIndex={-1} autoComplete="off"
          value={company} onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      {/* Screen-reader step announcements */}
      <span aria-live="polite" className="sr-only">
        {view === "form"
          ? `Step ${step + 1} of ${STEPS.length}`
          : view === "done"
          ? "Application received"
          : ""}
      </span>

      {/* System header + progress (only during the form) */}
      {view === "form" && (
        <header className="px-6 pt-8 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-baseline justify-between">
            <span className={labelCls}>Patina · Intake</span>
            <span className={labelCls}>
              Step {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
            </span>
          </div>
          <div className="mx-auto mt-4 h-px max-w-2xl bg-fg/15">
            <motion.div
              className="h-px bg-fg"
              initial={false}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={reduce ? { duration: 0 } : { duration: 0.45, ease: easeOut }}
            />
          </div>
        </header>
      )}

      {/* Body */}
      <div
        className="flex flex-1 items-center justify-center px-6 py-16 sm:px-10"
        onKeyDown={onKeyDown}
      >
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {view === "cover" && (
              <motion.div key="cover" {...fade}>
                <span className={labelCls}>Patina · Intake Protocol</span>
                <h1 className="mt-8 text-6xl md:text-8xl font-light tracking-tighter leading-[0.9]">
                  The Audit
                </h1>
                <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
                  A private assessment of where you stand — what reads as money,
                  what quietly gives you away, and what to acquire next. Eight
                  questions. Around two minutes.
                </p>
                <div className="mt-12">
                  <button
                    type="button"
                    onClick={() => { setView("form"); setStep(0); }}
                    className="font-mono text-[12px] uppercase tracking-[0.2em] border border-fg px-8 py-4 hover:bg-fg hover:text-bg transition-colors"
                  >
                    Begin ▸
                  </button>
                </div>
              </motion.div>
            )}

            {view === "form" && (
              <motion.div key={current.id} ref={cardRef} {...fade}>
                {renderStep()}
              </motion.div>
            )}

            {view === "done" && (
              <motion.div key="done" {...fade}>
                <span className={labelCls}>Patina · Intake Protocol</span>
                <h2 className="mt-8 text-5xl md:text-7xl font-light tracking-tighter leading-[0.95]">
                  Received.
                </h2>
                <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
                  Your file is in review. If it is a fit, you will hear from us —
                  and we will request anything else we need to begin.
                </p>
                <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/30">
                  Patina · Intake · Logged
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Controls (only during the form) */}
      {view === "form" && (
        <footer className="px-6 pb-12 sm:px-10">
          <div className="mx-auto flex max-w-2xl items-center justify-between">
            <button
              type="button"
              onClick={back}
              className="font-mono text-[12px] uppercase tracking-[0.15em] text-fg/40 hover:text-fg transition-colors"
            >
              ◂ Back
            </button>
            <div className="flex items-center gap-6">
              {error && (
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60 max-w-[16rem] text-right">
                  {error}
                </span>
              )}
              <button
                type="button"
                onClick={next}
                disabled={!canContinue() || status === "submitting"}
                className="font-mono text-[12px] uppercase tracking-[0.15em] border border-fg px-7 py-3 hover:bg-fg hover:text-bg transition-colors disabled:opacity-25 disabled:pointer-events-none"
              >
                {step === STEPS.length - 1
                  ? status === "submitting" ? "Sending…" : "Submit ▸"
                  : "Continue ▸"}
              </button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );

  function renderStep() {
    switch (current.id) {
      case "name":
        return (
          <Field q="What is your name?">
            <input
              type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="Your name" className={inputCls}
            />
          </Field>
        );
      case "email":
        return (
          <Field q="Where can we reach you?">
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputCls}
            />
          </Field>
        );
      case "focus":
        return (
          <Field q="What do you want the eye on?" hint="Select all that apply.">
            <div className="flex flex-wrap gap-3">
              {FOCUS_OPTIONS.map((option) => {
                const active = focus.includes(option);
                return (
                  <button
                    key={option} type="button" aria-pressed={active}
                    onClick={() => toggleFocus(option)}
                    className={`cursor-pointer select-none font-mono text-[12px] uppercase tracking-[0.1em] px-5 py-3 border transition-all active:translate-y-px ${
                      active
                        ? "bg-fg text-bg border-fg"
                        : "border-fg/30 text-fg/70 hover:border-fg hover:text-fg"
                    }`}
                  >
                    {active ? "✓ " : ""}{option}
                  </button>
                );
              })}
            </div>
          </Field>
        );
      case "budget":
        return (
          <Field q="What is your acquisition budget?" hint="Select one.">
            <div className="border-t border-fg/15">
              {BUDGET_OPTIONS.map((b) => {
                const active = budget === b;
                return (
                  <button
                    key={b} type="button" aria-pressed={active}
                    onClick={() => selectBudget(b)}
                    className={`group flex w-full cursor-pointer select-none items-center justify-between border-b border-fg/15 py-5 pl-4 text-left transition-all ${
                      active ? "bg-fg/[0.04] text-fg" : "text-fg/55 hover:pl-6 hover:text-fg"
                    }`}
                  >
                    <span className="text-xl font-light">{b}</span>
                    <span
                      className={`mr-4 h-2.5 w-2.5 rotate-45 border transition-colors ${
                        active ? "bg-fg border-fg" : "border-fg/30 group-hover:border-fg"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </Field>
        );
      case "about":
        return (
          <Field q="Tell us about you, and where you want to land.">
            <textarea
              rows={4} value={about} onChange={(e) => setAbout(e.target.value)}
              placeholder="Who you are, what you own now, what you want to read as."
              className={`${inputCls} resize-none text-xl md:text-2xl`}
            />
          </Field>
        );
      case "links":
        return (
          <Field q="Anything that shows your world?" hint="Optional — Instagram, references, what you own.">
            <textarea
              rows={3} value={links} onChange={(e) => setLinks(e.target.value)}
              placeholder="Paste any links."
              className={`${inputCls} resize-none text-xl md:text-2xl`}
            />
          </Field>
        );
      case "photos":
        return (
          <Field q="Photographs of you, your space, your pieces." hint={`Optional — up to ${MAX_IMAGES}.`}>
            <input
              id="photos" type="file" accept="image/*" multiple
              onChange={(e) => { handleFiles(e.target.files); e.target.value = ""; }}
              className="block w-full text-sm text-fg/50 file:mr-4 file:rounded-none file:border file:border-fg/25 file:bg-transparent file:px-4 file:py-2 file:font-mono file:text-[11px] file:uppercase file:tracking-[0.1em] file:text-fg/70 hover:file:border-fg/60"
            />
            {imgError && (
              <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60">{imgError}</p>
            )}
            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-5 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-square overflow-hidden border border-fg/15">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.previewUrl} alt={img.name} className="h-full w-full object-cover" />
                    <button
                      type="button" onClick={() => removeImage(i)} aria-label="Remove photograph"
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center border border-fg/20 bg-bg/80 text-xs leading-none text-fg"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Field>
        );
      case "consent":
        return (
          <Field q="One last thing." hint="By application · Fee quoted on inquiry.">
            <label className="flex items-start gap-4 cursor-pointer">
              <input
                type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                className="mt-1.5 accent-fg" data-autofocus
              />
              <span className="text-fg/60 text-lg leading-relaxed max-w-md">
                I agree that Patina may store and process this information to
                respond to my application, per the privacy policy.
              </span>
            </label>
          </Field>
        );
      default:
        return null;
    }
  }
}

function Field({
  q,
  hint,
  children,
}: {
  q: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl font-light tracking-tight leading-tight">
        {q}
      </h2>
      {hint && (
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/35">
          {hint}
        </p>
      )}
      <div className="mt-10">{children}</div>
    </div>
  );
}

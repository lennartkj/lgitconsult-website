"use client";

import { useEffect, useState } from "react";
import { motion, easeOut } from "framer-motion";
import { track } from "@/lib/track";

const labelCls = "font-mono text-[11px] uppercase tracking-[0.25em] text-fg/40";
const inputCls =
  "w-full bg-transparent border-b border-fg/20 py-3 text-xl font-light text-fg placeholder:text-fg/20 focus:border-fg focus:outline-none transition-colors rounded-none";
const fieldLabel =
  "font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40 block mb-2";

export type CaptureConfig = {
  /** Waitlist product tag. */
  product: string;
  /** Funnel event prefix, e.g. "gift" → gift_view / gift_submit. */
  trackPrefix: string;
  kicker: string;
  title: string;
  body: string;
  /** Optional single-line extra (e.g. recipient). */
  extraLabel?: string;
  extraPlaceholder?: string;
  /** Optional free-text note. */
  noteLabel?: string;
  notePlaceholder?: string;
  cta: string;
  success: string;
  successBody: string;
  consentText: string;
  backHref?: string;
  backLabel?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export default function ClinicalCapture({ config }: { config: CaptureConfig }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [extra, setExtra] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    track(`${config.trackPrefix}_view`);
  }, [config.trackPrefix]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const fullNote = [
        config.extraLabel && extra ? `${config.extraLabel} ${extra}` : null,
        note || null,
      ]
        .filter(Boolean)
        .join(" — ");
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: config.product,
          name,
          email,
          note: fullNote,
          consent,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please check the form and try again.");
        return;
      }
      track(`${config.trackPrefix}_submit`);
      setStatus("success");
    } catch {
      setStatus("error");
      setError("There was an error. Please try again.");
    }
  }

  const fade = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: easeOut },
  };

  return (
    <div className="audit-clinical flex min-h-screen flex-col items-center justify-center bg-bg text-fg px-6 py-16 sm:px-10">
      <div className="w-full max-w-xl">
        {status === "success" ? (
          <motion.div {...fade}>
            <span className={labelCls}>{config.kicker}</span>
            <h1 className="mt-8 text-5xl md:text-6xl font-light tracking-tighter leading-[0.95]">
              {config.success}
            </h1>
            <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
              {config.successBody}
            </p>
            <p className="mt-12 font-mono text-[11px] uppercase tracking-[0.25em] text-fg/30">
              {config.kicker} · Logged
            </p>
          </motion.div>
        ) : (
          <motion.div {...fade}>
            <span className={labelCls}>{config.kicker}</span>
            <h1 className="mt-8 text-5xl md:text-6xl font-light tracking-tighter leading-[0.95]">
              {config.title}
            </h1>
            <p className="mt-8 max-w-md text-fg/55 text-lg leading-relaxed">
              {config.body}
            </p>

            <form onSubmit={handleSubmit} className="mt-12 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <label className={fieldLabel} htmlFor="c-name">Your name</label>
                  <input
                    id="c-name" type="text" required value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputCls} placeholder="Your name"
                  />
                </div>
                <div>
                  <label className={fieldLabel} htmlFor="c-email">Your email</label>
                  <input
                    id="c-email" type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputCls} placeholder="you@example.com"
                  />
                </div>
              </div>

              {config.extraLabel && (
                <div>
                  <label className={fieldLabel} htmlFor="c-extra">
                    {config.extraLabel} <span className="text-fg/25">(optional)</span>
                  </label>
                  <input
                    id="c-extra" type="text" value={extra}
                    onChange={(e) => setExtra(e.target.value)}
                    className={inputCls} placeholder={config.extraPlaceholder}
                  />
                </div>
              )}

              {config.noteLabel && (
                <div>
                  <label className={fieldLabel} htmlFor="c-note">
                    {config.noteLabel} <span className="text-fg/25">(optional)</span>
                  </label>
                  <textarea
                    id="c-note" rows={2} value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${inputCls} resize-none`}
                    placeholder={config.notePlaceholder}
                  />
                </div>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={consent} required
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1.5 accent-fg"
                />
                <span className="text-fg/55 text-sm leading-relaxed max-w-md">
                  {config.consentText}
                </span>
              </label>

              {status === "error" && (
                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/60">
                  {error}
                </p>
              )}

              <div className="flex items-center gap-8 pt-2">
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="ac-btn font-mono text-[12px] uppercase tracking-[0.15em] px-7 py-3 disabled:opacity-25 disabled:pointer-events-none"
                >
                  {status === "submitting" ? "Sending…" : config.cta}
                </button>
                {config.backHref && (
                  <a href={config.backHref} className="ac-link font-mono text-[11px] uppercase tracking-[0.15em]">
                    {config.backLabel ?? "◂ Back"}
                  </a>
                )}
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}

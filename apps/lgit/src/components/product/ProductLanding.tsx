"use client";

import { useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@repo/ui/ui/Button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
  }),
};

const inputClass =
  "w-full bg-transparent border-b border-fg/20 py-3 text-fg placeholder:text-fg/30 focus:border-fg focus:outline-none transition-colors rounded-none";
const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40 block mb-3";

export type ProductLandingConfig = {
  /** Brand wordmark, e.g. "Coterie". */
  brand: string;
  /** Small mono kicker above the wordmark, e.g. "An LGIT venture". */
  kicker: string;
  /** Status line under the wordmark, e.g. "In development". */
  status: string;
  /** Big hero line. */
  headline: string;
  /** Hero supporting paragraph. */
  lede: string;
  /** Section label for the "what it is" block, e.g. "What it is". */
  pointsLabel: string;
  /** Title/body rows describing the product. */
  points: [string, string][];
  /** Small print under the points, e.g. "By invitation · In development". */
  meta: string;
  /** CTA: either link out to a live funnel, or capture a waitlist signup. */
  cta:
    | { mode: "link"; href: string; label: string }
    | {
        mode: "waitlist";
        /** Product identifier sent to /api/waitlist. */
        product: string;
        label: string;
        /** Headline shown after a successful signup. */
        success: string;
        /** Optional note-field prompt; omit to hide the note field. */
        notePrompt?: string;
      };
};

type Status = "idle" | "submitting" | "success" | "error";

function WaitlistForm({
  cta,
}: {
  cta: Extract<ProductLandingConfig["cta"], { mode: "waitlist" }>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: cta.product, name, email, note, consent }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setStatus("error");
        setError(data.message || "Please check the form and try again.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setError("There was an error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <motion.div initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <h2 className="text-3xl md:text-4xl font-light tracking-tighter leading-tight">
          {cta.success}
        </h2>
        <p className="mt-6 text-fg/60 leading-relaxed max-w-md">
          You&apos;re on the list. When we open the doors, you&apos;ll be among
          the first to hear — quietly, by email.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div>
          <label className={labelClass} htmlFor="wl-name">Name</label>
          <input
            id="wl-name" type="text" required value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass} placeholder="Your name"
          />
        </div>
        <div>
          <label className={labelClass} htmlFor="wl-email">Email</label>
          <input
            id="wl-email" type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass} placeholder="you@example.com"
          />
        </div>
      </div>

      {cta.notePrompt && (
        <div>
          <label className={labelClass} htmlFor="wl-note">
            {cta.notePrompt}{" "}
            <span className="text-fg/25">(optional)</span>
          </label>
          <textarea
            id="wl-note" rows={3} value={note}
            onChange={(e) => setNote(e.target.value)}
            className={`${inputClass} resize-none`}
            placeholder="A line about you and what you collect."
          />
        </div>
      )}

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox" checked={consent} required
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 accent-fg"
        />
        <span className="text-fg/50 text-sm leading-relaxed">
          I agree that LGIT may store and process this information to contact me
          about {cta.product}, per the privacy policy.
        </span>
      </label>

      {status === "error" && (
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/70">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" size="lg" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : cta.label}
      </Button>
    </form>
  );
}

export default function ProductLanding({ config }: { config: ProductLandingConfig }) {
  const { cta } = config;

  return (
    <>
      {/* Hero */}
      <section className="py-32 md:py-48 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
              className="col-span-12 md:col-span-9"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">
                {config.kicker}
              </span>
              <span className="font-mono text-[12px] uppercase tracking-[0.35em] text-fg/70 block mb-10">
                {config.brand} — {config.status}
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9]">
                {config.headline}
              </h1>
              <p className="mt-8 max-w-xl text-fg/60 text-lg leading-relaxed">
                {config.lede}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What it is */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="col-span-12 md:col-span-5"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-8">
                {config.pointsLabel}
              </span>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
              className="col-span-12 md:col-span-6"
            >
              <div className="border-t border-fg/10">
                {config.points.map(([title, body], i) => (
                  <div key={i} className="py-6 border-b border-fg/10">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-2">
                      {title}
                    </h3>
                    <p className="text-fg/70 text-sm leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40">
                {config.meta}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-8 lg:col-span-7">
              {cta.mode === "link" ? (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={0}
                >
                  <h2 className="text-3xl md:text-4xl font-light tracking-tighter leading-tight max-w-lg">
                    The way in is the Audit.
                  </h2>
                  <p className="mt-6 text-fg/60 leading-relaxed max-w-md">
                    A private verdict from the eye — what to keep, what to lose,
                    what to acquire. By application.
                  </p>
                  <div className="mt-10">
                    <Button href={cta.href} variant="primary" size="lg">
                      {cta.label}
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <>
                  <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-8">
                    Request an invitation
                  </span>
                  <WaitlistForm cta={cta} />
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

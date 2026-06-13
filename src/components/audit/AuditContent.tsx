"use client";

import { useState } from "react";
import { motion, easeOut } from "framer-motion";
import { Button } from "@/components/ui/Button";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: easeOut },
  }),
};

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

const inputClass =
  "w-full bg-transparent border-b border-fg/20 py-3 text-fg placeholder:text-fg/30 focus:border-fg focus:outline-none transition-colors rounded-none";
const labelClass =
  "font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40 block mb-3";

type Status = "idle" | "submitting" | "success" | "error";

export default function AuditContent() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [focus, setFocus] = useState<string[]>([]);
  const [budget, setBudget] = useState("");
  const [about, setAbout] = useState("");
  const [links, setLinks] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const toggleFocus = (option: string) =>
    setFocus((prev) =>
      prev.includes(option)
        ? prev.filter((f) => f !== option)
        : [...prev, option]
    );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, focus, budget, about, links, consent }),
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
      setError("There was an error sending your application. Please try again.");
    }
  }

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
              <span className="font-mono text-[12px] uppercase tracking-[0.35em] text-fg/70 block mb-10">
                Patina
              </span>
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">
                001 — The Audit
              </span>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9]">
                Look like money.
              </h1>
              <p className="mt-8 max-w-xl text-fg/60 text-lg leading-relaxed">
                A private verdict from the eye, for people with new wealth and no
                time to learn taste. What to keep, what to lose, what to acquire —
                so everything you own reads as effortless, not new-money.
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
                002 — What you get
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
                {[
                  ["The read", "An honest assessment of where you stand — what already works, and what quietly gives you away."],
                  ["The direction", "A keepable document, in our register, that tells you exactly where to take it."],
                  ["The starter list", "Specific pieces — what to acquire, where, and why each one earns its place."],
                ].map(([title, body], i) => (
                  <div key={i} className="py-6 border-b border-fg/10">
                    <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-2">
                      {title}
                    </h3>
                    <p className="text-fg/70 text-sm leading-relaxed">{body}</p>
                  </div>
                ))}
              </div>
              <p className="mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40">
                By application · Fee quoted on inquiry
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Application form */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-8 lg:col-span-7">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-8">
                003 — Apply
              </span>

              {status === "success" ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeIn}
                  custom={0}
                >
                  <h2 className="text-3xl md:text-4xl font-light tracking-tighter leading-tight">
                    Received.
                  </h2>
                  <p className="mt-6 text-fg/60 leading-relaxed max-w-md">
                    We read every application. If it&apos;s a fit, you&apos;ll hear
                    from us — and we&apos;ll ask for a few photographs to begin.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div>
                      <label className={labelClass} htmlFor="name">Name</label>
                      <input
                        id="name" type="text" required value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass} placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className={labelClass} htmlFor="email">Email</label>
                      <input
                        id="email" type="email" required value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass} placeholder="you@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>What do you want the eye on?</label>
                    <div className="flex flex-wrap gap-3">
                      {FOCUS_OPTIONS.map((option) => {
                        const active = focus.includes(option);
                        return (
                          <button
                            key={option} type="button"
                            onClick={() => toggleFocus(option)}
                            className={`font-mono text-[11px] uppercase tracking-[0.1em] px-4 py-2 border transition-colors rounded-none ${
                              active
                                ? "bg-fg text-bg border-fg"
                                : "border-fg/20 text-fg/60 hover:border-fg/50"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="budget">
                      Acquisition budget
                    </label>
                    <select
                      id="budget" required value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className={`${inputClass} appearance-none`}
                    >
                      <option value="" disabled>Select a range</option>
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="about">
                      Tell us about you and where you want to land
                    </label>
                    <textarea
                      id="about" required rows={4} value={about}
                      onChange={(e) => setAbout(e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="Who you are, what you own now, what you want to read as."
                    />
                  </div>

                  <div>
                    <label className={labelClass} htmlFor="links">
                      Links <span className="text-fg/25">(optional — Instagram, references, what you own)</span>
                    </label>
                    <textarea
                      id="links" rows={2} value={links}
                      onChange={(e) => setLinks(e.target.value)}
                      className={`${inputClass} resize-none`}
                      placeholder="Paste any links that show your world."
                    />
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox" checked={consent} required
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 accent-fg"
                    />
                    <span className="text-fg/50 text-sm leading-relaxed">
                      I agree that Patina may store and process this information to
                      respond to my application, per the privacy policy.
                    </span>
                  </label>

                  {status === "error" && (
                    <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/70">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit" variant="primary" size="lg"
                    disabled={status === "submitting"}
                  >
                    {status === "submitting" ? "Sending…" : "Request the Audit"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

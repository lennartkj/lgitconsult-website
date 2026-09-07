"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { track } from "@/lib/track";
import { BUDGETS, GRANT, INDUSTRIES, PROJECT_TYPES, REGIONS, type RegionValue } from "@/lib/auftritt/offer";

// The Erstgespräch form for /auftritt. Client-only piece of an otherwise
// server-rendered page. Captures ad attribution (gclid / utm_*) from the URL on
// first paint, keeps it in sessionStorage across the page, and sends it with the
// lead so the inbox can count the €500 probe's conversions.

type Attribution = Record<string, string>;
const ATTR_KEY = "auftritt_attr";
const ATTR_PARAMS = ["gclid", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

function readAttribution(): Attribution {
  if (typeof window === "undefined") return {};
  let stored: Attribution = {};
  try {
    stored = JSON.parse(sessionStorage.getItem(ATTR_KEY) || "{}") || {};
  } catch {
    stored = {};
  }
  const params = new URLSearchParams(window.location.search);
  const fresh: Attribution = {};
  for (const p of ATTR_PARAMS) {
    const v = params.get(p);
    if (v) fresh[p] = v.slice(0, 200);
  }
  const merged: Attribution = { ...stored, ...fresh };
  if (!merged.landing) merged.landing = (window.location.pathname + window.location.search).slice(0, 300);
  if (!merged.referrer && document.referrer) merged.referrer = document.referrer.slice(0, 300);
  try {
    sessionStorage.setItem(ATTR_KEY, JSON.stringify(merged));
  } catch {
    // storage may be unavailable; attribution is best-effort
  }
  return merged;
}

type Errors = Partial<Record<string, string[]>>;

const inputClass =
  "w-full bg-transparent border-b border-[color:var(--fg)]/25 focus:border-[color:var(--fg)] outline-none py-3 text-[15px] text-foreground placeholder:text-subtle transition-colors";
const labelClass = "block font-mono text-[10px] uppercase tracking-[0.18em] text-subtle mb-1";

export default function LeadForm() {
  const [attribution, setAttribution] = useState<Attribution>({});
  const [region, setRegion] = useState<RegionValue | "">("");
  const [project, setProject] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const started = useRef(false);

  useEffect(() => {
    setAttribution(readAttribution());
    track("auftritt_view");
  }, []);

  const regionInfo = useMemo(() => REGIONS.find((r) => r.value === region), [region]);

  const onFirstInteraction = () => {
    if (started.current) return;
    started.current = true;
    track("auftritt_form_start");
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrors({});
    setServerMessage("");

    const fd = new FormData(e.currentTarget);
    const payload = {
      company: String(fd.get("company") || ""),
      name: String(fd.get("name") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      industry: String(fd.get("industry") || ""),
      region,
      project,
      budget,
      message: String(fd.get("message") || ""),
      website: String(fd.get("website") || ""),
      attribution,
    };

    try {
      const res = await fetch("/api/auftritt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) {
        setStatus("done");
        setServerMessage(data.message || "Danke.");
        track("auftritt_lead", { region, project, budget });
      } else if (res.status === 400 && data?.errors) {
        setErrors(data.errors as Errors);
        setStatus("idle");
      } else {
        setStatus("error");
        setServerMessage(data?.message || "Da ist etwas schiefgelaufen. Bitte später noch einmal versuchen.");
      }
    } catch {
      setStatus("error");
      setServerMessage("Keine Verbindung. Bitte später noch einmal versuchen oder direkt an info@git-consult.group schreiben.");
    }
  }

  const err = (k: string) =>
    errors[k]?.[0] ? <p className="mt-1 text-[12px] text-foreground/70">{errors[k]![0]}</p> : null;

  if (status === "done") {
    return (
      <div className="border-t border-[color:var(--fg)] pt-8" aria-live="polite">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-subtle mb-4">Angekommen</p>
        <p className="text-xl md:text-2xl font-light tracking-tight leading-snug max-w-xl">{serverMessage}</p>
        <p className="mt-6 text-[15px] text-foreground/70 max-w-xl leading-relaxed">
          Bis dahin: Wenn Sie Ihr Vorhaben fördern lassen wollen, stellen Sie den Antrag bei der SAB{" "}
          <em>vor</em> dem Projektstart. Unser Angebot liefern wir Ihnen so, dass es als Anlage passt.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} onFocusCapture={onFirstInteraction} noValidate className="max-w-2xl">
      {/* honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-7">
        <div>
          <label htmlFor="company" className={labelClass}>Unternehmen</label>
          <input id="company" name="company" type="text" required autoComplete="organization" className={inputClass} />
          {err("company")}
        </div>
        <div>
          <label htmlFor="name" className={labelClass}>Ihr Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" className={inputClass} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>E-Mail</label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="phone" className={labelClass}>Telefon (optional)</label>
          <input id="phone" name="phone" type="tel" autoComplete="tel" className={inputClass} />
        </div>
        <div>
          <label htmlFor="industry" className={labelClass}>Branche</label>
          <select id="industry" name="industry" className={inputClass} defaultValue="">
            <option value="">Bitte wählen</option>
            {INDUSTRIES.map((i) => (
              <option key={i.name} value={i.name}>{i.name}</option>
            ))}
            <option value="Andere">Andere</option>
          </select>
        </div>
        <div>
          <label htmlFor="region" className={labelClass}>Standort des Unternehmens</label>
          <select
            id="region"
            name="region"
            required
            className={inputClass}
            value={region}
            onChange={(e) => setRegion(e.target.value as RegionValue)}
          >
            <option value="">Bitte wählen</option>
            {REGIONS.map((r) => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
          {err("region")}
          {regionInfo && (
            <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/70">
              {regionInfo.open
                ? `Für ${regionInfo.label} ist der SAB-Zuschuss nach unserem Stand vom ${GRANT.asOf} beantragbar. Über die Bewilligung entscheidet die SAB.`
                : `Für diese Region gilt derzeit ein Antragsstopp beim SAB-Zuschuss. Das Projekt geht trotzdem, ohne Förderung.`}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="project" className={labelClass}>Vorhaben</label>
          <select id="project" name="project" required className={inputClass} value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">Bitte wählen</option>
            {PROJECT_TYPES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
          {err("project")}
        </div>
        <div>
          <label htmlFor="budget" className={labelClass}>Rahmen</label>
          <select id="budget" name="budget" required className={inputClass} value={budget} onChange={(e) => setBudget(e.target.value)}>
            <option value="">Bitte wählen</option>
            {BUDGETS.map((b) => (
              <option key={b.value} value={b.value}>{b.label}</option>
            ))}
          </select>
          {err("budget")}
        </div>
        <div className="md:col-span-2">
          <label htmlFor="message" className={labelClass}>Worum geht es?</label>
          <textarea id="message" name="message" required rows={4} className={inputClass} placeholder="Ein, zwei Sätze genügen." />
          {err("message")}
        </div>
        <div className="md:col-span-2">
          <p className="text-[13px] leading-relaxed text-foreground/70">
            Wir verarbeiten Ihre Angaben ausschließlich zur Bearbeitung Ihrer Anfrage (Art. 6 Abs. 1 lit. b bzw. f
            DSGVO). Einzelheiten und Ihre Rechte:{" "}
            <Link href="/legal/privacy" className="underline underline-offset-4">Datenschutzerklärung</Link>.
          </p>
        </div>
      </div>

      <div className="mt-10 flex flex-col sm:flex-row sm:items-center gap-5">
        <button
          type="submit"
          disabled={status === "sending"}
          className="ac-btn font-mono text-[12px] uppercase tracking-[0.2em] px-8 py-4 disabled:opacity-50"
        >
          {status === "sending" ? "Wird gesendet …" : "Erstgespräch anfragen"}
        </button>
        <span className="text-[12.5px] text-subtle">30 Minuten, kostenlos und unverbindlich, per Telefon oder in der Mädler-Passage.</span>
      </div>
      {status === "error" && (
        <p className="mt-4 text-[13px] text-foreground/80" role="alert">{serverMessage}</p>
      )}
    </form>
  );
}

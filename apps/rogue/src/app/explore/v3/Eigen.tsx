"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import styles from "./v3.module.css";

/* ── ROGUE · EXPLORE V3 — "EIGEN" ───────────────────────────────────────────
   The signature synthesis, refined. COLD-electric collides with HOT-scorched
   along a single proprietary device: the SEAM — one precise redline where heat
   meets neon. Luxury-fashion-editorial register (032c / Arena Homme+ / Helmut
   Lang / LGIT house): deep refined black, considered off-white, restraint and
   negative space carry it. The hot/cold collision + a sparing wordmark glitch
   are the ONE loud moment — everything else is silence and discipline.
   noindex — sandbox.
   ──────────────────────────────────────────────────────────────────────────*/

// metadata (noindex) is exported from the sibling server page.tsx that renders
// this client component.

const DOCTRINE = [
  {
    no: "01",
    title: "Guerrilla",
    body: "We take a city by surprise. Unsanctioned, unmissable, gone before the permit office wakes up. The street is the medium; the crowd is the distribution.",
    tag: "Streets / Crowds / Surprise",
  },
  {
    no: "02",
    title: "Experiential",
    body: "Heat you can stand inside. We build temperatures — rooms, rituals, moments engineered so the body remembers the brand long after the phone is back in the pocket.",
    tag: "Spaces / Sense / Memory",
  },
  {
    no: "03",
    title: "Creative",
    body: "The idea before the channel. Film, sound, type, object — made to detonate, not to decorate. We share the vision and the outcome, never just the deck.",
    tag: "Film / Sound / Object",
  },
];

const STUNTS = [
  { no: "/01", title: "Cold Open, Hot City", meta: "Berlin · Beverage", kpi: "41M impressions" },
  { no: "/02", title: "The Heatwave Vault", meta: "Milan · Fashion", kpi: "9hr queue" },
  { no: "/03", title: "Static Bloom", meta: "Lisbon · Tech launch", kpi: "+312% search" },
  { no: "/04", title: "Midnight Solar", meta: "Paris · Spirits", kpi: "Sold out / 6 min" },
];

export default function EigenV3() {
  const heroRef = useRef<HTMLElement>(null);
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const [glitching, setGlitching] = useState(false);

  // SIGNATURE INTERACTION: the seam drives slowly off scroll — the hot/cold
  // collision line settles through the wordmark as you descend. The split %
  // is the brand's living value. Deliberate, weighted — not a slot-machine.
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const splitPct = useTransform(scrollYProgress, [0, 1], [52, 20]);
  const splitTemplate = useMotionTemplate`${splitPct}%`;

  // The glitch is a deliberate moment, not constant: it fires once on load and
  // on deliberate hover of the wordmark. No scroll-driven buzzing.
  function triggerGlitch() {
    setGlitching(false);
    // next frame so the animation restarts
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setGlitching(true));
    });
    window.setTimeout(() => setGlitching(false), 520);
  }

  return (
    <div className={styles.root}>
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.coldField} aria-hidden />
        <div className={styles.hotField} aria-hidden />
        <div className={styles.grain} aria-hidden />

        <div className={styles.heroInner}>
          <div className={styles.heroTopRow}>
            <span className={styles.mono}>ROGUE — A LGIT VENTURE</span>
            <span className={styles.mono}>EU · GUERRILLA / EXPERIENTIAL</span>
          </div>

          <motion.h1
            ref={wordmarkRef}
            className={`${styles.wordmark} ${glitching ? "eigen-glitching" : ""}`}
            initial={{ opacity: 0, filter: "blur(14px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={triggerGlitch}
            style={
              { ["--split" as string]: splitTemplate } as React.CSSProperties
            }
            onMouseEnter={triggerGlitch}
          >
            <span className={`${styles.layer} ${styles.coldType}`}>ROGUE</span>
            <span className={`${styles.layer} ${styles.hotType}`} aria-hidden>
              ROGUE
            </span>
            <span className={styles.glitchA} aria-hidden>
              ROGUE
            </span>
            <span className={styles.glitchB} aria-hidden>
              ROGUE
            </span>
            <motion.span
              className={styles.faultRule}
              aria-hidden
              style={{ top: splitTemplate }}
            />
          </motion.h1>

          <p className={styles.heroLede}>
            We work the seam where <b>cold electricity</b> meets{" "}
            <b>scorched heat</b> — the moment a campaign stops being seen and
            starts being <b>felt</b>. Guerrilla and experiential marketing for
            brands that would rather be unforgettable than safe.
          </p>

          <div className={styles.scrollHint}>
            <span className={styles.tick} aria-hidden />
            <span className={styles.mono}>SCROLL</span>
          </div>
        </div>
      </section>

      <div className={styles.seamBar} aria-hidden />

      {/* ── WHAT WE DO ────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.mono}>001 — DOCTRINE</span>
        </div>
        <h2 className={styles.sectionTitle}>
          Three ways we <span className={styles.hl}>burn</span> /{" "}
          <span className={styles.hlCold}>charge</span> a city.
        </h2>

        <div className={styles.doctrine} style={{ marginTop: "clamp(2.5rem,6vh,4.5rem)" }}>
          {DOCTRINE.map((d, i) => (
            <motion.div
              key={d.no}
              className={styles.cell}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className={styles.cellNo}>{d.no}</span>
              <div>
                <h3 className={styles.cellTitle}>{d.title}</h3>
                <p className={styles.cellBody}>{d.body}</p>
              </div>
              <span className={styles.cellTag}>{d.tag}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────────────────── */}
      <div className={styles.marqueeWrap} aria-hidden>
        <div className={styles.marquee}>
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span>UNSANCTIONED</span>
              <span className={styles.dot}>◆</span>
              <span>UNFORGETTABLE</span>
              <span className={styles.dot}>◆</span>
              <span>HOT &amp; COLD</span>
              <span className={styles.dot}>◆</span>
              <span>NO PERMITS</span>
              <span className={styles.dot}>◆</span>
              <span>FELT NOT SEEN</span>
              <span className={styles.dot}>◆</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── STUNT SHOWCASE ────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.mono}>002 — FIELD WORK</span>
        </div>
        <h2 className={styles.sectionTitle}>Selected detonations.</h2>
      </section>

      <div className={styles.stunts}>
        {STUNTS.map((s, i) => (
          <motion.div
            key={s.no}
            className={styles.stunt}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className={styles.stuntNo}>{s.no}</span>
            <span className={styles.stuntTitle}>{s.title}</span>
            <span className={styles.stuntMeta}>
              {s.meta}
              <span className={styles.stuntKpi}>{s.kpi}</span>
            </span>
          </motion.div>
        ))}
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────── */}
      <section className={styles.cta}>
        <div className={styles.ctaGlow} aria-hidden />
        <span className={styles.mono} style={{ marginBottom: "1.75rem" }}>
          003 — IGNITION
        </span>
        <h2 className={styles.ctaHead}>
          <span className={styles.a}>Brief</span> <span className={styles.b}>us</span>.
        </h2>
        <p className={styles.ctaSub}>
          Bring the budget and the nerve. We bring the collision. Tell us the
          city, the brand, and the reaction you want — we will tell you what we
          would set off.
        </p>

        <a className={styles.briefBtn} href="mailto:hello@git-consult.group?subject=ROGUE%20BRIEF">
          <span>Start a brief</span>
          <span className={`${styles.arrow}`} aria-hidden>→</span>
        </a>

        <div className={styles.footerLine}>
          <span>ROGUE</span>
          <span className={styles.sep}>◆</span>
          <span>LGIT CONSULT</span>
          <span className={styles.sep}>◆</span>
          <span>LEIPZIG / EU</span>
        </div>
      </section>
    </div>
  );
}

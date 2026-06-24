"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — EXPLORE V2  ·  "SCORCHED, COUTURE"
   Sandbox concept. Self-contained. Touches no shared files.
   Inherits the LGIT bones (mono labels, numbered sections, Geist type,
   restraint-as-structure, the glitch idea) but holds the heat to a single
   considered warm light source — luxury-fashion editorial, not a casino.
   Effects are sparing and slow; composition and type do the work.
   ────────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import styles from "./v2.module.css";

/* ── Ember field ──────────────────────────────────────────────────────────────
   A handful of dim, slow embers drifting upward like the last sparks off a
   fire — no connection lines, no index labels, no surveillance grid. A quiet
   warm presence behind the type. Local to the hero, respects reduced motion.
   ────────────────────────────────────────────────────────────────────────── */
function EmberField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Ember = { x: number; y: number; vy: number; drift: number; r: number; a: number; phase: number };
    let embers: Ember[] = [];

    const make = (): Ember => ({
      x: Math.random() * w,
      y: h + Math.random() * 40,
      vy: 0.12 + Math.random() * 0.18,   // slow, deliberate rise
      drift: (Math.random() - 0.5) * 0.06,
      r: 0.8 + Math.random() * 1.4,
      a: 0.12 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
    });

    const seed = () => {
      const count = w < 700 ? 7 : 12;       // sparse
      embers = Array.from({ length: count }, () => {
        const e = make();
        e.y = Math.random() * h;            // spread on first frame
        return e;
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    resize();
    window.addEventListener("resize", resize);

    const EMBER = "194, 84, 31"; // matches --ember, the single warm accent

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      for (const e of embers) {
        e.y -= e.vy;
        e.x += e.drift;
        if (e.y < -10) Object.assign(e, make());

        // gentle breathing glow, never flickering
        const glow = e.a * (0.7 + 0.3 * Math.sin(t * 0.0006 + e.phase));
        const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r * 6);
        g.addColorStop(0, `rgba(${EMBER}, ${glow})`);
        g.addColorStop(1, `rgba(${EMBER}, 0)`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r * 6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    if (reduce) {
      draw(0);
      cancelAnimationFrame(raf);
    } else {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={styles.heroCanvas} aria-hidden="true" />;
}

/* ── Wordmark ─────────────────────────────────────────────────────────────────
   The refined logo treatment the operator liked: a sparing chromatic/heat
   split on the ROGUE wordmark. Dead still at rest. Fires ONCE on mount, and
   briefly on hover — an expensive accent, never a constant effect.
   ────────────────────────────────────────────────────────────────────────── */
function Wordmark() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setTimeout(() => fire(), 650);
    return () => window.clearTimeout(id);
  }, []);

  const fire = () => {
    setOn(false);
    // retrigger the animation cleanly
    requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    window.setTimeout(() => setOn(false), 560);
  };

  return (
    <span
      className={`${styles.wordmark} ${on ? styles.glitching : ""}`}
      data-text="ROGUE"
      onMouseEnter={fire}
    >
      ROGUE
    </span>
  );
}

/* ── Motion presets — slowed, weighted, deliberate ─────────────────────────── */
const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

const DISCIPLINES = [
  {
    n: "01",
    name: "Guerrilla",
    desc:
      "Unsanctioned, unforgettable. We hit the street where the buyer least expects it and leave a mark the algorithm can't bury.",
  },
  {
    n: "02",
    name: "Experiential",
    desc:
      "Heat you can stand inside. Installations, takeovers and one-night-only worlds that turn a city block into a memory.",
  },
  {
    n: "03",
    name: "Creative",
    desc:
      "The idea before the medium. Art direction, film and sound built to detonate first and explain later.",
  },
];

const STUNTS = [
  { i: "001", name: "Midnight Harvest", meta: "Berlin · Spirits launch · 1 night" },
  { i: "002", name: "The Salt Mirror", meta: "Lisbon · Fashion takeover · 9 days" },
  { i: "003", name: "Forty Degrees", meta: "Marseille · Festival ambush · live" },
  { i: "004", name: "Last Light", meta: "Milan · Automotive reveal · invite-only" },
];

export default function V2Concept() {
  return (
    <div className={styles.root}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <header className={styles.hero}>
        <EmberField />
        <div className={styles.wrap}>
          <div className={styles.heroTop}>
            <Wordmark />
            <span className={styles.heroMeta}>EUROPE · ON THE GROUND</span>
          </div>

          <motion.h1
            className={styles.heroTitle}
            initial="hidden"
            animate="visible"
            variants={rise}
          >
            We don&apos;t
            <span className={styles.strike}>buy</span>
            attention.
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial="hidden"
            animate="visible"
            custom={1}
            variants={rise}
          >
            A European guerrilla and experiential agency for brands that refuse to
            be ignored. We <b>steal the moment</b> — on the street, after dark, in
            the heat — and hand you the part the feed can&apos;t fake.
          </motion.p>

          <motion.div
            className={styles.heroFoot}
            initial="hidden"
            animate="visible"
            custom={2}
            variants={rise}
          >
            <a className={styles.btnPrimary} href="#brief">
              Brief us →
            </a>
            <a className={styles.btnGhost} href="#work">
              See the damage
            </a>
          </motion.div>

          <div className={styles.scrollHint}>Scroll · 39°N</div>
        </div>
      </header>

      {/* ── WHAT WE DO ────────────────────────────────────────────────────── */}
      <section className={styles.section} id="do">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>001 — What we do</span>
            <motion.h2
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={rise}
            >
              Three ways to <em>burn through</em> the noise.
            </motion.h2>
          </div>

          <div className={styles.doGrid}>
            {DISCIPLINES.map((d, i) => (
              <motion.article
                key={d.n}
                className={styles.doCell}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                variants={rise}
              >
                <span className={styles.doNum}>{d.n}</span>
                <h3 className={styles.doName}>{d.name}</h3>
                <p className={styles.doDesc}>{d.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <div className={styles.wrap}>
          <span className={styles.labelDim}>002 — Position</span>
          <motion.p
            className={styles.manifestoText}
            style={{ marginTop: "2rem" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={rise}
          >
            Polished campaigns cool down. We make work that stays <b>hot</b> long
            after the budget runs out.
          </motion.p>
        </div>
      </section>

      {/* ── STUNT SHOWCASE ────────────────────────────────────────────────── */}
      <section className={styles.section} id="work">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>003 — Selected ground work</span>
            <motion.h2
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={rise}
            >
              The <em>damage</em>.
            </motion.h2>
          </div>

          <div className={styles.stunts}>
            {STUNTS.map((s, i) => (
              <motion.a
                key={s.i}
                href="#brief"
                className={styles.stunt}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                custom={i}
                variants={rise}
              >
                <span className={styles.stuntIndex}>{s.i}</span>
                <span className={styles.stuntName}>
                  {s.name}
                  <span className={styles.stuntMeta}>{s.meta}</span>
                </span>
                <span className={styles.stuntArrow}>↗</span>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className={styles.cta} id="brief">
        <div className={styles.ctaGlow} />
        <div className={styles.wrap}>
          <span className={styles.label}>004 — Brief us</span>
          <motion.h2
            className={styles.ctaTitle}
            style={{ marginTop: "1.5rem" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={rise}
          >
            Bring the heat.
          </motion.h2>
          <motion.p
            className={styles.ctaSub}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={rise}
          >
            Tell us the city, the brand, and the night you want people to remember.
            We&apos;ll tell you what we&apos;d set on fire.
          </motion.p>
          <div className={styles.ctaActions}>
            <a className={styles.btnPrimary} href="mailto:hello@git-consult.group">
              Start a brief →
            </a>
            <a className={styles.btnGhost} href="#do">
              How we work
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.wrap}>
        <div className={styles.footStrip}>
          <span>ROGUE © {new Date().getFullYear()} — A LGIT AGENCY</span>
          <span>EXPLORE / V2 — SCORCHED, COUTURE</span>
        </div>
      </footer>
    </div>
  );
}

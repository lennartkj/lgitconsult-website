"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — EXPLORE V2  ·  "EUROPEAN SUMMER, SCORCHED"
   Sandbox concept. Self-contained. Touches no shared files.
   Inherits the LGIT bones (mono labels, numbered sections, Geist type,
   restraint-as-structure, the glitch/annotation canvas idea) and pushes the
   palette/contrast/texture to a scorched-Mediterranean-at-3am edge.
   ────────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import styles from "./v2.module.css";

/* ── Heat-haze annotation canvas ──────────────────────────────────────────────
   The LGIT glitch idea, warmed: ember dots wander the hero and connect with
   thin amber lines and a mono index number — like surveillance markers seen
   through heat shimmer. Local to the hero, pointer-none, respects reduced motion.
   ────────────────────────────────────────────────────────────────────────── */
function HeatCanvas() {
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

    type Node = { x: number; y: number; vx: number; vy: number; r: number };
    let nodes: Node[] = [];

    const seed = () => {
      const count = w < 700 ? 9 : 16;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r: 2 + Math.random() * 4,
      }));
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

    const EMBER = "234, 90, 26";
    const AMBER = "245, 158, 11";

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);

      // advance
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }

      // connection lines between near nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          const max = w < 700 ? 160 : 240;
          if (dist < max) {
            const alpha = (1 - dist / max) * 0.22;
            ctx.strokeStyle = `rgba(${AMBER}, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // ember nodes + mono index, with a slow shimmer pulse
      nodes.forEach((n, idx) => {
        const pulse = 0.45 + 0.35 * Math.sin(t * 0.001 + idx);
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${EMBER}, ${0.18 + pulse * 0.25})`;
        ctx.fill();
        ctx.strokeStyle = `rgba(${AMBER}, ${0.25 + pulse * 0.3})`;
        ctx.lineWidth = 0.7;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '10px "Geist Mono", ui-monospace, monospace';
        ctx.fillStyle = `rgba(${AMBER}, ${0.3 + pulse * 0.25})`;
        ctx.fillText(String(idx + 1).padStart(2, "0"), n.x + n.r + 8, n.y - n.r - 4);
      });

      raf = requestAnimationFrame(draw);
    };

    if (reduce) {
      // single static frame
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

/* ── Motion presets ──────────────────────────────────────────────────────── */
const rise: Variants = {
  hidden: { opacity: 0, y: 34 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
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
        <HeatCanvas />
        <div className={styles.wrap}>
          <div className={styles.heroTop}>
            <span className={styles.heroMeta}>ROGUE — A LGIT AGENCY</span>
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
          <span>EXPLORE / V2 — SCORCHED</span>
        </div>
      </footer>
    </div>
  );
}

"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — home / landing  ·  "EUROPEAN SUMMER, SCORCHED"
   The promoted V2 identity, now the real Rogue front door (rogue.berlin).
   European, Berlin-coded register. Restraint in words, violence in art
   direction. Leipzig is the base, not the positioning.
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import { motion } from "framer-motion";
import styles from "./rogue.module.css";
import { EmberField, Wordmark, rise } from "./atmosphere";

const DISCIPLINES = [
  {
    n: "01",
    name: "Guerrilla",
    desc:
      "Unsanctioned, unforgettable. We move on the city where the buyer least expects it and leave a mark the algorithm can't bury.",
  },
  {
    n: "02",
    name: "Experiential",
    desc:
      "Heat you can stand inside. Installations, takeovers and one-night-only worlds that turn a European block into a memory.",
  },
  {
    n: "03",
    name: "Creative",
    desc:
      "The idea before the medium. Art direction, film and sound built to detonate first and explain later.",
  },
];

const WORK = [
  { i: "001", name: "Midnight Harvest", meta: "Berlin · Spirits launch · 1 night" },
  { i: "002", name: "The Salt Mirror", meta: "Lisbon · Fashion takeover · 9 days" },
  { i: "003", name: "Forty Degrees", meta: "Marseille · Festival ambush · live" },
  { i: "004", name: "Last Light", meta: "Milan · Automotive reveal · invite-only" },
];

export default function RogueHome() {
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
            the heat — and hand you the part the feed can&apos;t fake. Based in
            Leipzig, working Berlin to the Mediterranean.
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

          <div className={styles.scrollHint}>Scroll · 51°N</div>
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

      {/* ── SELECTED WORK ─────────────────────────────────────────────────── */}
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
            {WORK.map((s, i) => (
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
            <a className={styles.btnPrimary} href="mailto:hello@rogue.berlin?subject=ROGUE%20BRIEF">
              Start a brief →
            </a>
            <a className={styles.btnGhost} href="/creative">
              The creative line
            </a>
          </div>
        </div>
      </section>

      <footer className={styles.wrap}>
        <div className={styles.footStrip}>
          <span>ROGUE © {new Date().getFullYear()} — A LGIT AGENCY</span>
          <span>EUROPEAN SUMMER, SCORCHED</span>
        </div>
      </footer>
    </div>
  );
}

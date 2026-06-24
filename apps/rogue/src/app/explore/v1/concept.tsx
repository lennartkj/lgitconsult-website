"use client";

/* ─────────────────────────────────────────────────────────────────────────
   ROGUE — Explore V1 · "NOCTURNAL NEON / 5-Gum after dark"  (client concept)
   Self-contained sandbox concept. Styling is fully local (v1.module.css +
   inline). Shares the LGIT family DNA — mono labels, numbered sections,
   Geist type, restraint-as-structure, the glitch idea — but pushed dark,
   electric and aggressive. Eigen hue: VOLTAGE VIOLET #5B2BFF.
   (metadata/noindex lives in the server page.tsx that renders this.)
   ──────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import styles from "./v1.module.css";

const rise: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  }),
};

const cut: Variants = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: (i: number = 0) => ({
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { delay: i * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  }),
};

const DO = [
  {
    n: "01",
    title: "Guerrilla",
    desc: "Unsanctioned by default. We take a city block and make it the medium — projection, wild-posting, ambush, the thing that wasn't supposed to be there.",
    tags: ["Street takeover", "Projection", "Wild-posting", "Ambush"],
  },
  {
    n: "02",
    title: "Experiential",
    desc: "Spaces people queue for and can't stop filming. Pop-ups, installations, one-night-only rooms engineered for the share, not the brief.",
    tags: ["Pop-up", "Installation", "Live", "Activation"],
  },
  {
    n: "03",
    title: "Creative",
    desc: "The idea before the budget. Concept, art direction and the line that makes the stunt mean something — so it travels further than the city it ran in.",
    tags: ["Concept", "Art direction", "Film", "Copy"],
  },
];

const STUNTS = [
  {
    wide: true,
    city: "Berlin",
    year: "'25",
    title: "A building that screamed back at the traffic for one night.",
    figure: "11.2M",
    note: "Organic reach. Zero paid. One generator and a permit we'd rather not discuss.",
  },
  {
    wide: false,
    city: "Lisbon",
    year: "'25",
    title: "A vending machine that only took dares.",
    figure: "#1",
    note: "Trending nationally, 36 hours.",
  },
  {
    wide: false,
    city: "Leipzig",
    year: "'24",
    title: "We replaced a tram for an evening. Riders kept the ticket.",
    figure: "4.8M",
    note: "Earned video views in a week.",
  },
];

export default function RogueExploreV1Concept() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const titleY = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  // crosshair cursor to match the family, scoped to this concept only
  useEffect(() => {
    const prev = document.body.style.cursor;
    document.body.style.cursor = "crosshair";
    return () => {
      document.body.style.cursor = prev;
    };
  }, []);

  return (
    <div className={styles.root}>
      <div className={styles.veil} />
      <div className={styles.scan} />

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.wrap}>
          <motion.div
            className={styles.heroKicker}
            initial="hidden"
            animate="visible"
            variants={rise}
          >
            <span className={styles.label}>
              <span className={styles.labelDot} />
              R—01 / Guerrilla &amp; Experiential
            </span>
            <span className={`${styles.mono} ${styles.label}`}>
              An LGIT brand · Europe
            </span>
          </motion.div>

          <motion.h1
            className={styles.heroTitle}
            style={{ y: titleY, opacity: titleOpacity }}
          >
            <motion.span
              className={styles.heroLine}
              initial="hidden"
              animate="visible"
              variants={cut}
              custom={0}
            >
              <span
                className={styles.stamp}
                data-text="ROGUE"
              >
                ROGUE
              </span>
            </motion.span>
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial="hidden"
            animate="visible"
            variants={rise}
            custom={2}
          >
            We don&apos;t buy attention. <b>We hijack it.</b> A European
            guerrilla and experiential agency that turns streets, screens and
            silence into the campaign.
          </motion.p>

          <motion.div
            className={styles.heroFoot}
            initial="hidden"
            animate="visible"
            variants={rise}
            custom={3}
          >
            <a className={styles.btnPrimary + " " + styles.btn} href="#brief">
              Brief us <span className={styles.arrow}>→</span>
            </a>
            <a className={styles.btnGhost} href="#work">
              See the damage <span className={styles.arrow}>→</span>
            </a>
          </motion.div>

          <motion.div
            className={styles.tickerWrap}
            initial="hidden"
            animate="visible"
            variants={rise}
            custom={4}
          >
            <span className={styles.ticker}>
              UNSANCTIONED <span>/</span> UNFORGETTABLE <span>/</span> EARNED
              NOT BOUGHT <span>/</span> ONE NIGHT ONLY <span>/</span> NO
              MEDIA BUY <span>/</span> ALL SIGNAL <span>/</span> UNSANCTIONED{" "}
              <span>/</span> UNFORGETTABLE <span>/</span> EARNED NOT BOUGHT{" "}
              <span>/</span> ONE NIGHT ONLY <span>/</span> NO MEDIA BUY{" "}
              <span>/</span> ALL SIGNAL <span>/</span>
            </span>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT WE DO ─────────────────────────────────────────────────── */}
      <section className={styles.section} id="work">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>
              <span className={styles.labelDot} />
              002 — What we do
            </span>
            <h2 className={styles.sectionTitle}>
              Three ways to make a city <em>look up</em>.
            </h2>
          </div>

          <div className={styles.rows}>
            {DO.map((item, i) => (
              <motion.div
                key={item.n}
                className={styles.row}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                variants={rise}
                custom={i}
              >
                <div className={styles.rowNum}>{item.n}</div>
                <div className={styles.rowBody}>
                  <h3 className={styles.rowTitle}>{item.title}</h3>
                  <p className={styles.rowDesc}>{item.desc}</p>
                  <div className={styles.rowTags}>
                    {item.tags.map((t) => (
                      <span key={t} className={styles.tag}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STUNT SHOWCASE ─────────────────────────────────────────────── */}
      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>
              <span className={styles.labelDot} />
              003 — Field record
            </span>
            <h2 className={styles.sectionTitle}>
              Stunts that <em>outran their permits</em>.
            </h2>
          </div>

          <div className={styles.stunts}>
            {STUNTS.map((s, i) => (
              <motion.article
                key={s.title}
                className={`${styles.stunt} ${s.wide ? styles.stuntWide : ""}`}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                variants={rise}
                custom={i}
              >
                <div className={styles.stuntMeta}>
                  <span>
                    <b>{s.city}</b> {s.year}
                  </span>
                  <span>CASE / {String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className={styles.stuntTitle}>{s.title}</h3>
                <div>
                  <div className={styles.stuntFigure}>{s.figure}</div>
                  <div className={styles.stuntNote}>{s.note}</div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ──────────────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <div className={styles.wrap}>
          <motion.p
            className={styles.manifestoText}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
          >
            A media buy rents you a moment. <em>A stunt that earns its way
            into the feed</em> belongs to you forever. We build the second
            kind — loud enough to be remembered, sharp enough to be defended
            in the boardroom.
          </motion.p>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className={styles.cta} id="brief">
        <div className={styles.ctaGlow} />
        <div className={styles.wrap}>
          <motion.span
            className={styles.label}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
            style={{ marginBottom: "2rem", display: "inline-flex" }}
          >
            <span className={styles.labelDot} />
            004 — Set it off
          </motion.span>
          <motion.h2
            className={styles.ctaTitle}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
            custom={1}
          >
            Brief us.
          </motion.h2>
          <motion.p
            className={styles.ctaSub}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
            custom={2}
          >
            One paragraph. The brand, the city, the thing you&apos;re not
            allowed to say out loud. We&apos;ll tell you within a week whether
            we can make it dangerous.
          </motion.p>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
            custom={3}
            style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap", position: "relative" }}
          >
            <a className={styles.btnPrimary + " " + styles.btn} href="mailto:hello@rogue.example">
              Send the brief <span className={styles.arrow}>→</span>
            </a>
            <a className={styles.btn} href="#work">
              Or just watch <span className={styles.arrow}>→</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER MICRO ───────────────────────────────────────────────── */}
      <footer className={styles.wrap}>
        <div className={styles.foot}>
          <span className={styles.footMono}>ROGUE — An LGIT brand</span>
          <span className={styles.footMono}>Explore V1 · Nocturnal Neon</span>
        </div>
      </footer>
    </div>
  );
}

"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — Creative line  ·  "EUROPEAN SUMMER, SCORCHED"
   The creative pillar, dressed in the promoted V2 identity. European register.
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Service } from "@repo/content/types";
import styles from "@/components/rogue/rogue.module.css";
import { EmberField, Wordmark, rise } from "@/components/rogue/atmosphere";

interface CreativeContentProps {
  services: Service[];
}

export default function CreativeContent({ services }: CreativeContentProps) {
  return (
    <div className={styles.root}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <header className={`${styles.hero} ${styles.heroCompact}`}>
        <EmberField />
        <div className={styles.wrap}>
          <div className={styles.heroTop}>
            <Wordmark text="ROGUE / CREATIVE" />
            <span className={styles.heroMeta}>EUROPE · THE IDEA FIRST</span>
          </div>

          <motion.h1
            className={`${styles.heroTitle} ${styles.heroTitleSub}`}
            initial="hidden"
            animate="visible"
            variants={rise}
          >
            Creative
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial="hidden"
            animate="visible"
            custom={1}
            variants={rise}
          >
            For brands and artists who want more than the obvious. Art direction,
            film, sound and physical media — <b>built to detonate first and
            explain later.</b> A European creative network, run out of Leipzig.
          </motion.p>
        </div>
      </header>

      {/* ── APPROACH ──────────────────────────────────────────────────────── */}
      <section className={styles.section} id="approach">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>001 — Approach</span>
            <motion.h2
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={rise}
            >
              We don&apos;t take briefs. We <em>build partnerships.</em>
            </motion.h2>
          </div>
          <motion.p
            className={styles.heroSub}
            style={{ maxWidth: "62ch", marginTop: 0 }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={rise}
          >
            Shared vision, shared outcome. We assemble the right people for the
            work — directors, photographers, composers, designers, strategists —
            from a European network, then run it from concept to the final cut.
            From a single image to a continental rollout.
          </motion.p>
        </div>
      </section>

      {/* ── CAPABILITIES ──────────────────────────────────────────────────── */}
      <section className={styles.section} id="services">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>002 — Capabilities</span>
            <motion.h2
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={rise}
            >
              What we make.
            </motion.h2>
          </div>

          <div className={styles.stunts}>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                className={styles.svcRow}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                custom={index}
                variants={rise}
              >
                <span className={styles.stuntIndex}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className={styles.svcName}>{service.title}</h3>
                  <p className={styles.svcDesc}>{service.description}</p>
                </div>
                <ul className={styles.svcFeatures}>
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <a className={styles.btnGhost} href="mailto:hello@rogue.berlin?subject=ROGUE%20CREATIVE">
                  {service.cta}
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MANIFESTO ─────────────────────────────────────────────────────── */}
      <section className={styles.manifesto}>
        <div className={styles.wrap}>
          <span className={styles.labelDim}>003 — Position</span>
          <motion.p
            className={styles.manifestoText}
            style={{ marginTop: "2rem" }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={rise}
          >
            We don&apos;t make content. We build creative work that <b>earns its
            place</b> in the room.
          </motion.p>
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
            Got an idea?
          </motion.h2>
          <motion.p
            className={styles.ctaSub}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={rise}
          >
            A campaign, a shoot, a release, or something with no name yet —
            let&apos;s talk.
          </motion.p>
          <div className={styles.ctaActions}>
            <a className={styles.btnPrimary} href="mailto:hello@rogue.berlin?subject=ROGUE%20CREATIVE">
              Start a brief →
            </a>
            <NextLink className={styles.btnGhost} href="/">
              Back to Rogue
            </NextLink>
          </div>
        </div>
      </section>
    </div>
  );
}

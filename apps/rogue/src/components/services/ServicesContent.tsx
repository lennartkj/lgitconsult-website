"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — Services (digital)  ·  "EUROPEAN SUMMER, SCORCHED"
   The technical line, dressed in the promoted V2 identity.
   ────────────────────────────────────────────────────────────────────────── */

import React from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Service, ProcessStep } from "@repo/content/types";
import styles from "@/components/rogue/rogue.module.css";
import { EmberField, Wordmark, rise } from "@/components/rogue/atmosphere";

interface ServicesContentProps {
  services: Service[];
  processSteps: ProcessStep[];
}

export default function ServicesContent({ services, processSteps }: ServicesContentProps) {
  return (
    <div className={styles.root}>
      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <header className={`${styles.hero} ${styles.heroCompact}`}>
        <EmberField />
        <div className={styles.wrap}>
          <div className={styles.heroTop}>
            <Wordmark text="ROGUE / DIGITAL" />
            <span className={styles.heroMeta}>EUROPE · THE ENGINE</span>
          </div>

          <motion.h1
            className={`${styles.heroTitle} ${styles.heroTitleSub}`}
            initial="hidden"
            animate="visible"
            variants={rise}
          >
            Digital
          </motion.h1>

          <motion.p
            className={styles.heroSub}
            initial="hidden"
            animate="visible"
            custom={1}
            variants={rise}
          >
            Web, product, design and IT consulting — the <b>technical backbone</b>
            {" "}behind the work. Built so creative scales instead of breaking.
          </motion.p>
        </div>
      </header>

      {/* ── CAPABILITIES ──────────────────────────────────────────────────── */}
      <section className={styles.section} id="services">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>001 — Capabilities</span>
            <motion.h2
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={rise}
            >
              What we <em>build</em>.
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
                  <h3 className={styles.svcName}>
                    <NextLink href={`/services/${service.slug}`}>{service.title}</NextLink>
                  </h3>
                  <p className={styles.svcDesc}>{service.description}</p>
                </div>
                <ul className={styles.svcFeatures}>
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <NextLink className={styles.btnGhost} href={`/services/${service.slug}`}>
                  {service.cta}
                </NextLink>
              </motion.div>
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
            Technology is never the goal. It&apos;s the thing that lets the work
            {" "}<b>scale</b>.
          </motion.p>
        </div>
      </section>

      {/* ── PROCESS ───────────────────────────────────────────────────────── */}
      <section className={styles.section} id="process">
        <div className={styles.wrap}>
          <div className={styles.sectionHead}>
            <span className={styles.label}>003 — Process</span>
            <motion.h2
              className={styles.sectionTitle}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={rise}
            >
              How we work.
            </motion.h2>
          </div>

          <div className={styles.doGrid} style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {processSteps.map((step, index) => (
              <motion.article
                key={step.step}
                className={styles.doCell}
                style={{ minHeight: 240 }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={index}
                variants={rise}
              >
                <span className={styles.doNum}>{String(step.step).padStart(2, "0")}</span>
                <h3 className={styles.doName} style={{ fontSize: "1.4rem" }}>{step.title}</h3>
                <p className={styles.doDesc}>{step.description}</p>
              </motion.article>
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
            Building something?
          </motion.h2>
          <motion.p
            className={styles.ctaSub}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={1}
            variants={rise}
          >
            Tell us what you need — we&apos;ll figure out the best way to build it.
          </motion.p>
          <div className={styles.ctaActions}>
            <a className={styles.btnPrimary} href="mailto:hello@rogue.berlin?subject=ROGUE%20DIGITAL">
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

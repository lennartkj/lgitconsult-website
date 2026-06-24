"use client";

/* ──────────────────────────────────────────────────────────────────────────
   ROGUE — shared atmosphere primitives (promoted from explore/v2).
   EmberField, Wordmark and the motion presets used across the real Rogue pages.
   ────────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from "react";
import { type Variants } from "framer-motion";
import styles from "./rogue.module.css";

/* ── Ember field ────────────────────────────────────────────────────────────
   A handful of dim, slow embers drifting upward — no grid, no labels. A quiet
   warm presence behind the type. Respects reduced motion. */
export function EmberField() {
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
      vy: 0.12 + Math.random() * 0.18,
      drift: (Math.random() - 0.5) * 0.06,
      r: 0.8 + Math.random() * 1.4,
      a: 0.12 + Math.random() * 0.22,
      phase: Math.random() * Math.PI * 2,
    });

    const seed = () => {
      const count = w < 700 ? 7 : 12;
      embers = Array.from({ length: count }, () => {
        const e = make();
        e.y = Math.random() * h;
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

    const EMBER = "194, 84, 31"; // matches --ember

    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.y -= e.vy;
        e.x += e.drift;
        if (e.y < -10) Object.assign(e, make());
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

/* ── Wordmark ───────────────────────────────────────────────────────────────
   Sparing chromatic/heat split on the ROGUE wordmark. Dead still at rest.
   Fires ONCE on mount, and briefly on hover — an expensive accent. */
export function Wordmark({ text = "ROGUE", className = "" }: { text?: string; className?: string }) {
  const [on, setOn] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = window.setTimeout(() => fire(), 650);
    return () => window.clearTimeout(id);
  }, []);

  const fire = () => {
    setOn(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    window.setTimeout(() => setOn(false), 560);
  };

  return (
    <span
      className={`${styles.wordmark} ${on ? styles.glitching : ""} ${className}`}
      data-text={text}
      onMouseEnter={fire}
    >
      {text}
    </span>
  );
}

/* ── Motion presets — slowed, weighted, deliberate ── */
export const rise: Variants = {
  hidden: { opacity: 0, y: 26 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

"use client";

import { motion, easeOut } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: easeOut,
    },
  }),
};

export default function ContactPage() {
  return (
    <>
      {/* Hero Section — left-aligned, generous whitespace */}
      <section className="py-32 md:py-48 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
              className="col-span-12 md:col-span-7"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">Contact</span>
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9]">
                Get in Touch
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Details — asymmetric 12-col grid */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-12">
            {/* Details column */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="col-span-12 md:col-span-5"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-8">Details</span>
              <div className="border-t border-fg/10">
                <div className="py-6 border-b border-fg/10">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-2">Address</h3>
                  <p className="text-fg/70 text-sm leading-relaxed">Mädler-Passage, Aufgang B<br />Grimmaische Str. 2-4<br />04109 Leipzig</p>
                </div>
                <div className="py-6 border-b border-fg/10">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-2">Email</h3>
                  <p className="text-fg/70 text-sm">info@git-consult.group</p>
                </div>
                <div className="py-6 border-b border-fg/10">
                  <h3 className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-2">Phone</h3>
                  <p className="text-fg/70 text-sm">+49 179 126 7379</p>
                </div>
              </div>
            </motion.div>

            {/* Hours column — offset */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={2}
              className="col-span-12 md:col-span-4 md:col-start-8"
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-8">Hours</span>
              <div className="border-t border-fg/10">
                <div className="flex justify-between py-5 border-b border-fg/10">
                  <span className="text-sm text-fg/50">Monday — Friday</span>
                  <span className="font-mono text-sm text-fg/70">09:00 — 18:00</span>
                </div>
                <div className="flex justify-between py-5 border-b border-fg/10">
                  <span className="text-sm text-fg/50">Saturday</span>
                  <span className="font-mono text-sm text-fg/70">10:00 — 14:00</span>
                </div>
                <div className="flex justify-between py-5 border-b border-fg/10">
                  <span className="text-sm text-fg/50">Sunday</span>
                  <span className="font-mono text-sm text-fg/70">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

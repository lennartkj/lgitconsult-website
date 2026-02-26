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
      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0}
            className="max-w-3xl"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">Contact</span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.95]">
              Get in Touch
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-4xl">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="space-y-10"
            >
              <div>
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">Details</span>
                <div className="space-y-6">
                  <div className="border-t border-fg/10 pt-4">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/40 mb-1">Address</h3>
                    <p className="text-fg/70 text-sm leading-relaxed">Mädler-Passage, Aufgang B<br />Grimmaische Str. 2-4<br />04109 Leipzig</p>
                  </div>
                  <div className="border-t border-fg/10 pt-4">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/40 mb-1">Email</h3>
                    <p className="text-fg/70 text-sm">info@git-consult.group</p>
                  </div>
                  <div className="border-t border-fg/10 pt-4">
                    <h3 className="font-mono text-[11px] uppercase tracking-[0.1em] text-fg/40 mb-1">Phone</h3>
                    <p className="text-fg/70 text-sm">+49 179 126 7379</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={2}
            >
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">Hours</span>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-t border-fg/10 pt-3">
                  <span className="text-fg/50">Monday — Friday</span>
                  <span className="font-mono text-fg/70">09:00 — 18:00</span>
                </div>
                <div className="flex justify-between border-t border-fg/10 pt-3">
                  <span className="text-fg/50">Saturday</span>
                  <span className="font-mono text-fg/70">10:00 — 14:00</span>
                </div>
                <div className="flex justify-between border-t border-fg/10 pt-3">
                  <span className="text-fg/50">Sunday</span>
                  <span className="font-mono text-fg/70">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { motion } from "framer-motion";

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

export default function ImpressumPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={0}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Impressum
            </h1>
            <p className="text-lg text-fg/70">

            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={1}
            className="max-w-3xl mx-auto prose prose-lg"
          >
            <h2>Company Information</h2>
            <p>
              <strong>LGIT Consult</strong><br />
              Mädler-Passage, Aufgang B Grimmaische Str. 2-4
              04109 Leipzig <br />
              <br />
              Eigentümer: Lennart Karl Janis Gründel <br/>
              W-IdNr: DE453183691-00001
            </p>

            <h2>Contact</h2>
            <p>
              Phone: +49 179 126 7379<br />
              Email: info@git-consult.group<br />

            </p>


          </motion.div>
        </div>
      </section>
    </>
  );
}

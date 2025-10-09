"use client";

import { motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Card, CardContent } from "@/components/ui/Card";

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

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
              className="flex flex-col gap-6"
            >
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                About LGIT Consult
              </h1>
              <p className="text-lg text-fg/70">
                We are a team of passionate IT professionals dedicated to helping businesses succeed in the digital world.
              </p>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="relative h-[300px] rounded-lg overflow-hidden"
            >
              <Placeholder 
                text="About Us" 
                bgColor="#6366f1" 
                textColor="#ffffff"
                className="w-full h-full rounded-lg"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg text-fg/70">
              To empower businesses with innovative technology solutions that drive growth, efficiency, and competitive advantage.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Values</h2>
            <p className="text-fg/70 max-w-2xl mx-auto">
              These core principles guide everything we do.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Innovation", icon: "💡", description: "We embrace new technologies and approaches." },
              { title: "Quality", icon: "✨", description: "We are committed to excellence in everything we do." },
              { title: "Collaboration", icon: "🤝", description: "We work closely with our clients as partners." },
              { title: "Integrity", icon: "🛡️", description: "We operate with honesty and transparency." }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={index + 1}
              >
                <Card className="h-full">
                  <CardContent className="pt-6">
                    <div className="text-4xl mb-4">{value.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-fg/70">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { motion, type Variants, type Easing } from "framer-motion";

// Animation variants
const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as Easing,
        },
    }),
};

export default function AboutContent() {
    const values = [
        { title: "Creative First", number: "01", description: "Every project starts with an idea. Technology is how we bring it to life." },
        { title: "Leipzig Rooted", number: "02", description: "Local talent, global standards. Our network of Leipzig creatives is what sets us apart." },
        { title: "Joint Ventures", number: "03", description: "We work with clients, not just for them. Shared vision, shared outcome." },
        { title: "Craft Over Hype", number: "04", description: "Photography, code, campaigns — everything is built to last." }
    ];

    return (
        <>
            {/* Hero Section — left-aligned, no image */}
            <section className="py-32 md:py-48 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-8 lg:col-span-7"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">001 — About</span>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                LGIT Consult
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                                A Leipzig-based agency at the intersection of technology and creative culture. We build digital products, design campaigns, and work with artists and brands in joint ventures — drawing from a pool of bonafide Leipzig creatives.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission Section — asymmetric two-column */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 gap-12">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-3"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block">002 — Mission</span>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={1}
                            className="col-span-12 md:col-span-7"
                        >
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-8">Why We Exist</h2>
                            <p className="text-base text-fg/50 leading-relaxed">
                                To bridge the gap between creative vision and execution. We bring together technology, design, and Leipzig&apos;s creative scene to help artists, advertisers, and brands turn ideas into reality — from digital platforms to physical media and everything in between.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section — ruled-line list, no cards */}
            <section className="py-24 md:py-32 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-6"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">003 — Values</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter">What We Stand For</h2>
                        </motion.div>
                    </div>

                    <div className="border-t border-fg/10">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                custom={index + 1}
                                className="border-b border-fg/10 py-8 md:py-10"
                            >
                                <div className="grid grid-cols-12 gap-4 md:gap-12">
                                    <div className="col-span-2 md:col-span-1">
                                        <span className="font-mono text-[11px] text-fg/30">{value.number}</span>
                                    </div>
                                    <div className="col-span-10 md:col-span-3">
                                        <h3 className="text-lg font-medium">{value.title}</h3>
                                    </div>
                                    <div className="col-span-12 md:col-span-5 md:col-start-6">
                                        <p className="text-sm text-fg/50 leading-relaxed">{value.description}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Full-bleed statement — rhythm break */}
            <section className="py-20 md:py-28 border-t border-fg/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        custom={0}
                        className="grid grid-cols-12"
                    >
                        <p className="col-span-12 md:col-span-8 md:col-start-3 text-2xl md:text-4xl font-light tracking-tight leading-snug text-fg/70">
                            &ldquo;Restraint as luxury. Systems as aesthetic. The tension between analog and digital — that&apos;s where we live.&rdquo;
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
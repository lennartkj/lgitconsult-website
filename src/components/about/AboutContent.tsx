"use client";

import { Placeholder } from "@/components/ui/Placeholder";
import { Card, CardContent } from "@/components/ui/Card";
import { motion, type Variants, type Easing } from "framer-motion";
import { ReactNode } from "react";

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

interface ValuesSectionProps {
    values: {
        title: string;
        icon: string;
        description: string;
    }[];
}

function ValuesSection({ values }: ValuesSectionProps) {
    return (
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
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-3">003 — Values</span>
                    <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">What We Stand For</h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value, index) => (
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
                                    <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">{value.icon}</div>
                                    <h3 className="text-lg font-medium mb-2">{value.title}</h3>
                                    <p className="text-sm text-fg/50 leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default function AboutContent() {
    const values = [
        { title: "Creative First", icon: "01", description: "Every project starts with an idea. Technology is how we bring it to life." },
        { title: "Leipzig Rooted", icon: "02", description: "Local talent, global standards. Our network of Leipzig creatives is what sets us apart." },
        { title: "Joint Ventures", icon: "03", description: "We work with clients, not just for them. Shared vision, shared outcome." },
        { title: "Craft Over Hype", icon: "04", description: "Photography, code, campaigns — everything is built to last." }
    ];

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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">About</span>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.95]">
                                LGIT Consult
                            </h1>
                            <p className="text-base text-fg/60 leading-relaxed">
                                A Leipzig-based agency at the intersection of technology and creative culture. We build digital products, design campaigns, and work with artists and brands in joint ventures — drawing from a pool of bonafide Leipzig creatives.
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
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-3">002 — Mission</span>
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-6">Why We Exist</h2>
                        <p className="text-base text-fg/60 leading-relaxed">
                            To bridge the gap between creative vision and execution. We bring together technology, design, and Leipzig&apos;s creative scene to help artists, advertisers, and brands turn ideas into reality — from digital platforms to physical media and everything in between.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <ValuesSection values={values} />
        </>
    );
}
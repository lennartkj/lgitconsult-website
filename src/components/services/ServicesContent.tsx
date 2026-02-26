"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Service, ProcessStep } from "@/lib/data/types";

interface ServicesContentProps {
    services: Service[];
    processSteps: ProcessStep[];
}

const fadeIn: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            ease: "easeOut" as const,
        },
    }),
};

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function ServicesContent({ services, processSteps }: ServicesContentProps) {
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">001 — Digital Services</span>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                Digital
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                                Web development, mobile apps, design, and IT consulting. The technical backbone for your digital presence.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Services — ruled-line editorial layout */}
            <section className="py-24 md:py-32">
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">002 — Capabilities</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter">What We Build</h2>
                        </motion.div>
                    </div>

                    <div className="border-t border-fg/10">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                custom={index}
                                className="border-b border-fg/10 py-12 md:py-16"
                            >
                                <div className="grid grid-cols-12 gap-6 md:gap-12">
                                    <div className="col-span-12 md:col-span-1">
                                        <span className="font-mono text-[11px] text-fg/30">{String(index + 1).padStart(2, "0")}</span>
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-3">{service.icon}</div>
                                        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-3">{service.title}</h2>
                                        <p className="text-sm text-fg/50 leading-relaxed">{service.description}</p>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 md:col-start-7">
                                        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 block mb-4">Capabilities</span>
                                        <ul className="space-y-3">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="text-sm text-fg/60 border-t border-fg/5 pt-3 first:border-t-0 first:pt-0">
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="col-span-12 md:col-span-2 md:col-start-11 flex md:items-end md:justify-end">
                                        <Button href="/contact" variant="outline" size="sm">
                                            {service.cta}
                                        </Button>
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
                        variants={slideFromRight}
                        className="grid grid-cols-12"
                    >
                        <p className="col-span-12 md:col-span-8 md:col-start-3 text-2xl md:text-4xl font-light tracking-tight leading-snug text-fg/70">
                            &ldquo;Technology is never the goal — it&apos;s the enabler. We build digital systems that let creative work scale.&rdquo;
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Process Section — horizontal ruled list, no cards */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">003 — Process</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-4">How We Work</h2>
                            <p className="text-fg/50 leading-relaxed">
                                Every project is different, but our approach stays consistent.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-0 border-t border-fg/10">
                        {processSteps.map((step, index) => (
                            <motion.div
                                key={step.step}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                custom={index + 1}
                                className="py-8 md:pr-8 border-b md:border-b-0 md:border-r border-fg/10 last:border-b-0 last:border-r-0"
                            >
                                <span className="font-mono text-[11px] text-fg/30 block mb-4">{String(step.step).padStart(2, "0")}</span>
                                <h3 className="text-base font-medium mb-2">{step.title}</h3>
                                <p className="text-sm text-fg/40 leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section — left-aligned, ruled */}
            <section className="py-24 md:py-32 border-t border-fg/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-8"
                        >
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">Have a Digital Project in Mind?</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed mb-10">
                                Tell us what you need — we&apos;ll figure out the best way to build it.
                            </p>
                            <Button href="/contact">
                                Get in Touch
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

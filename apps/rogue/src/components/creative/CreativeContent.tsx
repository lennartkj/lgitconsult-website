"use client";

import React from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { Button } from "@repo/ui/ui/Button";
import { Service } from "@repo/content/types";

interface CreativeContentProps {
    services: Service[];
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

export default function CreativeContent({ services }: CreativeContentProps) {
    return (
        <>
            {/* Hero Section — left-aligned */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">001 — Creative Consulting</span>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                Creative
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                                For artists, brands, and advertisers who want more than the obvious. Campaigns, photography, music, video, and creative direction — powered by Leipzig&apos;s creative scene.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Full-bleed image — film negative, the analog process */}
            <section className="relative w-full h-[40vh] md:h-[60vh] overflow-hidden img-editorial">
                <Image
                    src="/images/film-negative.jpg"
                    alt="Film negative — analog photography process"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </section>

            {/* Approach — asymmetric two-column */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block">002 — Approach</span>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={1}
                            className="col-span-12 md:col-span-7"
                        >
                            <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-8">How We Work</h2>
                            <p className="text-base text-fg/50 mb-6 leading-relaxed">
                                We don&apos;t just take briefs — we build partnerships. Our creative consulting model is built on joint ventures with artists and brands, where we share the vision and the outcome.
                            </p>
                            <p className="text-base text-fg/50 leading-relaxed">
                                Our pool of Leipzig-based creatives — photographers, videographers, musicians, designers, and strategists — means we can assemble the right team for any project, from a single shoot to a full campaign rollout.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Full-bleed statement — rhythm break */}
            <section className="py-20 md:py-28 border-t border-b border-fg/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideFromRight}
                        className="grid grid-cols-12"
                    >
                        <p className="col-span-12 md:col-span-8 md:col-start-3 text-2xl md:text-4xl font-light tracking-tight leading-snug text-fg/70">
                            &ldquo;We don&apos;t make content — we build creative partnerships. Shared vision, shared outcome.&rdquo;
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services — ruled-line editorial layout */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">003 — Services</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter">What We Offer</h2>
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
                                custom={index + 1}
                                className="border-b border-fg/10 py-12 md:py-16"
                            >
                                <div className="grid grid-cols-12 gap-6 md:gap-12">
                                    <div className="col-span-12 md:col-span-1">
                                        <span className="font-mono text-[11px] text-fg/30">{String(index + 1).padStart(2, "0")}</span>
                                    </div>
                                    <div className="col-span-12 md:col-span-4">
                                        <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 mb-3">{service.icon}</div>
                                        <h3 className="text-2xl md:text-3xl font-light tracking-tight mb-3">{service.title}</h3>
                                        <p className="text-sm text-fg/50 leading-relaxed">{service.description}</p>
                                    </div>
                                    <div className="col-span-12 md:col-span-4 md:col-start-7">
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

            {/* Full-bleed texture — visual break */}
            <section className="relative w-full h-[30vh] md:h-[40vh] overflow-hidden img-editorial">
                <Image
                    src="/images/texture-macro.jpg"
                    alt="Surface texture detail"
                    fill
                    className="object-cover"
                    sizes="100vw"
                />
            </section>

            {/* CTA Section — left-aligned */}
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
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">Got a Creative Project?</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed mb-10">
                                Whether it&apos;s a campaign, a shoot, a release, or something entirely new — let&apos;s talk.
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

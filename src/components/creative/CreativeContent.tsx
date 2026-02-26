"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Service } from "@/lib/data/types";

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

export default function CreativeContent({ services }: CreativeContentProps) {
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
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">Services — Creative</span>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.95] mb-6">
                            Creative
                        </h1>
                        <p className="text-base text-fg/60 leading-relaxed">
                            For artists, brands, and advertisers who want more than the obvious. Campaigns, photography, music, video, and creative direction — powered by Leipzig&apos;s creative scene.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Intro Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        custom={0}
                        className="max-w-3xl mx-auto"
                    >
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-3">Approach</span>
                        <h2 className="text-2xl md:text-3xl font-light tracking-tight mb-6">How We Work</h2>
                        <p className="text-base text-fg/60 mb-4 leading-relaxed">
                            We don&apos;t just take briefs — we build partnerships. Our creative consulting model is built on joint ventures with artists and brands, where we share the vision and the outcome.
                        </p>
                        <p className="text-base text-fg/60 leading-relaxed">
                            Our pool of Leipzig-based creatives — photographers, videographers, musicians, designers, and strategists — means we can assemble the right team for any project, from a single shoot to a full campaign rollout.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        custom={0}
                        className="mb-12"
                    >
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-3">Services</span>
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-2">What We Offer</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {services.map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                custom={index + 1}
                            >
                                <Card className="h-full flex flex-col">
                                    <CardContent className="p-8 flex-grow">
                                        <div className="text-xs font-semibold uppercase tracking-widest text-accent mb-4">{service.icon}</div>
                                        <h3 className="text-xl font-medium mb-2">{service.title}</h3>
                                        <p className="text-sm text-fg/50 mb-6 leading-relaxed">{service.description}</p>

                                        <ul className="space-y-2 mb-6">
                                            {service.features.map((feature) => (
                                                <li key={feature} className="flex items-start">
                                                    <span className="text-accent mr-2">✓</span>
                                                    <span>{feature}</span>
                                                </li>
                                            ))}
                                        </ul>

                                        <div className="mt-auto pt-4">
                                            <Button href="/contact" variant="primary">
                                                {service.cta}
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-accent text-accent-contrast">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                        >
                            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">Got a Creative Project?</h2>
                            <p className="text-accent-contrast/70 mb-8 leading-relaxed">
                                Whether it&apos;s a campaign, a shoot, a release, or something entirely new — let&apos;s talk.
                            </p>
                            <Button
                                href="/contact"
                                className="bg-accent-contrast text-accent hover:bg-accent-contrast/90"
                            >
                                Get in Touch
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

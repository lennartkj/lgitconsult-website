"use client";

import React, { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Button } from "@repo/ui/ui/Button";
import { Project } from "@repo/content/types";

// /work: every project is a section on this page, anchored by its slug
// (there is no /work/<slug> route). The write-ups themselves are in English;
// the shell is German.

interface WorkContentProps {
    projects: Project[];
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

const slideFromLeft: Variants = {
    hidden: { opacity: 0, x: -40 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1],
        },
    }),
};

function ProjectHeroImage({ src, alt }: { src: string; alt: string }) {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

    return (
        <div ref={ref} className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden img-editorial">
            <motion.div style={{ y: imageY }} className="absolute inset-0 scale-[1.15]">
                <Image
                    src={src}
                    alt={alt}
                    fill
                    className="object-cover img-bw"
                    sizes="100vw"
                />
            </motion.div>
        </div>
    );
}

function ProjectShowcase({ project, index, reversed }: { project: Project; index: number; reversed?: boolean }) {
    const isInDevelopment = project.status === "In Development";

    return (
        <section id={project.slug} className="py-0 scroll-mt-12">
            {/* Project image — full bleed with parallax */}
            {project.image && (
                <ProjectHeroImage src={project.image} alt={project.title} />
            )}

            {/* Project details */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                <div className="grid grid-cols-12 gap-8 md:gap-12">
                    {/* Left column — title & meta */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={reversed ? slideFromRight : slideFromLeft}
                        custom={0}
                        className={`col-span-12 md:col-span-5 ${reversed ? "md:col-start-8 md:order-2" : ""}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <span className="font-mono text-[11px] text-fg/30">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            {isInDevelopment && (
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-accent border border-accent/30 px-2 py-0.5">
                                    In Entwicklung
                                </span>
                            )}
                        </div>
                        <h2 className="text-3xl md:text-5xl font-light tracking-tighter leading-[0.95] mb-4">
                            {project.title}
                        </h2>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-6">
                            {project.client && (
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/40" lang="en">
                                    {project.client}
                                </span>
                            )}
                            {project.year && (
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30">
                                    {project.year}
                                </span>
                            )}
                        </div>
                        {project.services && project.services.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-6" lang="en">
                                {project.services.map((service) => (
                                    <span
                                        key={service}
                                        className="text-[11px] border border-fg/10 text-fg/40 px-2 py-0.5 rounded-full"
                                    >
                                        {service}
                                    </span>
                                ))}
                            </div>
                        )}
                        {project.website && (
                            <div className="mt-6">
                                <Button
                                    href={`https://${project.website}`}
                                    variant="outline"
                                    size="sm"
                                >
                                    Zur Seite
                                </Button>
                            </div>
                        )}
                    </motion.div>

                    {/* Right column — description */}
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-80px" }}
                        variants={reversed ? slideFromLeft : slideFromRight}
                        custom={1}
                        className={`col-span-12 md:col-span-5 ${reversed ? "md:col-start-1 md:order-1" : "md:col-start-7"}`}
                    >
                        <div className="border-t border-fg/10 pt-8" lang="en">
                            <p className="text-base md:text-lg text-fg/60 leading-relaxed">
                                {project.description}
                            </p>
                            <div className="flex flex-wrap gap-3 mt-8">
                                {project.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg/30"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}

export default function WorkContent({ projects }: WorkContentProps) {
    return (
        <>
            {/* Hero Section */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">001 — Projekte</span>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                Projekte
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                                Ein Kundenprojekt, das gebaut, abgenommen und in Betrieb ist, und ein eigenes Produkt. Ausführliche Fallstudien zeigen wir im Gespräch.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Project Showcases */}
            {projects.map((project, index) => (
                <ProjectShowcase
                    key={project.slug}
                    project={project}
                    index={index}
                    reversed={index % 2 !== 0}
                />
            ))}

            {/* Divider */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="border-t border-fg/10" />
            </div>

            {/* CTA Section */}
            <section className="py-24 md:py-32">
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
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">Details auf Anfrage.</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed mb-10">
                                Technische Einblicke, Abläufe und Ergebnisse zeigen wir im Erstgespräch, zugeschnitten auf Ihr Vorhaben.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Button href="/auftritt#erstgespraech">
                                    Erstgespräch anfragen
                                </Button>
                                <Button href="/contact" variant="outline">
                                    Kontakt
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

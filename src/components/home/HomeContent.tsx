"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Project } from "@/lib/data/types";

interface HomeContentProps {
    projects: Project[];
}

// Animation variants
const fadeIn: Variants = {
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

export default function HomeContent({ projects }: HomeContentProps) {
    return (
        <>
            {/* Hero Section — left-aligned, text owns the space */}
            <section className="py-32 md:py-48">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-8 lg:col-span-7"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">LGIT Consult</span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                Where Technology Meets Creative Vision
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 max-w-lg leading-relaxed mb-10">
                                Leipzig-based creative consulting and digital agency. We work with artists, brands, and businesses — building campaigns, digital products, and everything in between.
                            </p>
                            <div className="flex gap-4">
                                <Button href="/contact" size="lg">
                                    Get Started
                                </Button>
                                <Button href="/work" variant="outline" size="lg">
                                    View Our Work
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Full-bleed hero image */}
            <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
                <Image
                    src="/hero_image_1.png"
                    alt="LGIT Consult"
                    fill
                    className="object-cover"
                    priority
                />
            </section>

            {/* Featured Projects — editorial list layout */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-7"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">001 — Featured Work</span>
                            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4">Selected Projects</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed">
                                From e-learning platforms to artist campaigns — a look at what we&apos;ve been building.
                            </p>
                        </motion.div>
                    </div>

                    {/* Ruled-line project list */}
                    <div className="border-t border-fg/10">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.slug}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                custom={index}
                            >
                                <Link href={`/work/${project.slug}`} className="block group">
                                    <div className="grid grid-cols-12 gap-4 py-8 border-b border-fg/10 items-center">
                                        <div className="col-span-1 hidden md:block">
                                            <span className="font-mono text-[11px] text-fg/30">{String(index + 1).padStart(2, "0")}</span>
                                        </div>
                                        <div className="col-span-12 md:col-span-5">
                                            <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-fg/70 transition-colors">{project.title}</h3>
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <p className="text-sm text-fg/40 leading-relaxed">{project.description}</p>
                                        </div>
                                        <div className="col-span-12 md:col-span-2 flex flex-wrap gap-2">
                                            {(project.tags ?? []).slice(0, 2).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12">
                        <Button href="/work" variant="outline">
                            View All Projects
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section — full-bleed, minimal */}
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
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">Let&apos;s Build Something Together</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed mb-10">
                                Whether it&apos;s a digital product, a campaign, or a joint venture — we&apos;re ready to talk.
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
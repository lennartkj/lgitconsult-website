"use client";

import Image from "next/image";
import React from "react";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardLink } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";
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
            {/* Hero Section */}
            <section className="relative py-20 md:py-28 overflow-hidden">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={0}
                            className="flex flex-col gap-6"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 mb-4 block">LGIT Consult</span>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.95]">
                                Where Technology Meets Creative Vision
                            </h1>
                            <p className="text-base md:text-lg text-fg/60 max-w-md leading-relaxed">
                                Leipzig-based creative consulting and digital agency. We work with artists, brands, and businesses — building campaigns, digital products, and everything in between.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <Button href="/contact" size="lg">
                                    Get Started
                                </Button>
                                <Button href="/work" variant="outline" size="lg">
                                    View Our Work
                                </Button>
                            </div>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={1}
                            className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden"
                        >
                            <div className="w-full h-full">
                                <Image
                                    src="/hero_image_1.png"
                                    alt="Hero Image"
                                    className="w-full h-full rounded-lg"
                                    layout="fill"
                                    objectFit="cover"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Projects Section */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        custom={0}
                        className="text-center mb-12"
                    >
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-3">001 — Featured Work</span>
                        <h2 className="text-3xl md:text-4xl font-light tracking-tight mb-4">Selected Projects</h2>
                        <p className="text-fg/50 max-w-2xl mx-auto leading-relaxed">
                            From e-learning platforms to artist campaigns — a look at what we&apos;ve been building.
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.slug}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true, margin: "-50px" }}
                                variants={fadeIn}
                                custom={index + 1}
                            >
                                <CardLink href={`/work/${project.slug}`} className="h-full flex flex-col">
                                    <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                                        <Placeholder
                                            text={project.title}
                                            bgColor={index % 2 === 0 ? "#0070f3" : "#6366f1"}
                                            textColor="#ffffff"
                                            seed={index}
                                            className="w-full h-full transition-transform duration-500 hover:scale-105"
                                        />
                                    </div>
                                    <CardHeader>
                                        <CardTitle>{project.title}</CardTitle>
                                        <CardDescription>{project.description}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {(project.tags ?? []).map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="text-xs bg-fg/10 text-fg/80 px-2 py-1 rounded-full"
                                                >
                          {tag}
                        </span>
                                            ))}
                                        </div>
                                    </CardContent>
                                    <CardFooter>
                                        {/* FIX: Link wurde entfernt, da die gesamte Karte bereits ein Link ist */}
                                    </CardFooter>
                                </CardLink>
                            </motion.div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button href="/work" variant="outline">
                            View All Projects
                        </Button>
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
                            <h2 className="text-3xl md:text-5xl font-light tracking-tight mb-6">Let&apos;s Build Something Together</h2>
                            <p className="text-accent-contrast/70 mb-8 leading-relaxed">
                                Whether it&apos;s a digital product, a campaign, or a joint venture — we&apos;re ready to talk.
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
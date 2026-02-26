"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Project } from "@/lib/data/types";

interface HomeContentProps {
    projects: Project[];
}

// Standard fade-up
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

// Slide from left
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

// Slide from right
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

// Staggered container for hero text lines
const staggerContainer: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.12,
            delayChildren: 0.1,
        },
    },
};

const staggerLine: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
        },
    },
};

export default function HomeContent({ projects }: HomeContentProps) {
    const heroImageRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: heroImageRef,
        offset: ["start end", "end start"],
    });
    const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <>
            {/* Hero Section — staggered line-by-line reveal */}
            <section className="py-32 md:py-48">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="col-span-12 md:col-span-8 lg:col-span-7"
                        >
                            <motion.span variants={staggerLine} className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">LGIT Consult</motion.span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                <motion.span variants={staggerLine} className="block">Where Technology</motion.span>
                                <motion.span variants={staggerLine} className="block">Meets Creative Vision</motion.span>
                            </h1>
                            <motion.p variants={staggerLine} className="text-base md:text-lg text-fg/50 max-w-lg leading-relaxed mb-10">
                                Leipzig-based creative consulting and digital agency. We work with artists, brands, and businesses — building campaigns, digital products, and everything in between.
                            </motion.p>
                            <motion.div variants={staggerLine} className="flex gap-4">
                                <Button href="/contact" size="lg">
                                    Get Started
                                </Button>
                                <Button href="/work" variant="outline" size="lg">
                                    View Our Work
                                </Button>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Full-bleed hero image — parallax, grain overlay */}
            <section ref={heroImageRef} className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden img-editorial">
                <motion.div style={{ y: imageY }} className="absolute inset-0 scale-[1.15]">
                    <Image
                        src="/images/snow-reflection.jpg"
                        alt="Leipzig at night — where we work"
                        fill
                        className="object-cover img-bw"
                        priority
                        sizes="100vw"
                    />
                </motion.div>
            </section>

            {/* Featured Projects — slide from left, hover shift on rows */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-100px" }}
                            variants={slideFromLeft}
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
                                    <div className="grid grid-cols-12 gap-4 py-8 border-b border-fg/10 items-center transition-transform duration-300 group-hover:translate-x-2">
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

            {/* Two Pillars — slide from opposite sides */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">002 — What We Do</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter">Two Pillars</h2>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-12 gap-12 md:gap-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideFromLeft}
                            custom={1}
                            className="col-span-12 md:col-span-5"
                        >
                            <div className="border-t border-fg/10 pt-8">
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 block mb-4">Digital</span>
                                <h3 className="text-xl font-light tracking-tight mb-4">IT Consulting & Web Development</h3>
                                <p className="text-sm text-fg/50 leading-relaxed mb-6">
                                    Web platforms, mobile apps, UI/UX design, and technical consulting. The infrastructure that makes everything else possible.
                                </p>
                                <Button href="/services" variant="outline" size="sm">
                                    Digital Services
                                </Button>
                            </div>
                        </motion.div>

                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideFromRight}
                            custom={1}
                            className="col-span-12 md:col-span-5 md:col-start-8"
                        >
                            <div className="border-t border-fg/10 pt-8">
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 block mb-4">Creative</span>
                                <h3 className="text-xl font-light tracking-tight mb-4">Creative Consulting & Joint Ventures</h3>
                                <p className="text-sm text-fg/50 leading-relaxed mb-6">
                                    Campaigns, photography, music, video — built with Leipzig&apos;s creative scene. We work with artists and brands as partners, not vendors.
                                </p>
                                <Button href="/creative" variant="outline" size="sm">
                                    Creative Services
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Full-bleed statement — slide from right */}
            <section className="py-20 md:py-28">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={slideFromRight}
                        custom={0}
                        className="grid grid-cols-12"
                    >
                        <p className="col-span-12 md:col-span-8 md:col-start-3 text-2xl md:text-4xl font-light tracking-tight leading-snug text-fg/70">
                            &ldquo;Leipzig-rooted, globally minded. We bridge the gap between creative vision and technical execution.&rdquo;
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 md:py-32 border-t border-fg/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={slideFromLeft}
                            custom={0}
                            className="col-span-12 md:col-span-8"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">003 — Connect</span>
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

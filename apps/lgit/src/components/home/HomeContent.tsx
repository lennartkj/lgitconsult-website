"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { Button } from "@repo/ui/ui/Button";
import { Project } from "@repo/content/types";
import { GRANT, OFFERS } from "@/lib/auftritt/offer";

// The home page of a one-offer site (2026-09-07): it says what /auftritt sells,
// shows the two projects that exist, and sends the visitor to the Erstgespräch.
// Grant wording is hedged and dated from GRANT (offer.ts owns the facts).

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
            {/* Hero — staggered line-by-line reveal */}
            <section className="py-32 md:py-48">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={staggerContainer}
                            className="col-span-12 md:col-span-9 lg:col-span-8"
                        >
                            <motion.span variants={staggerLine} className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">LGIT Consult · Leipzig</motion.span>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                <motion.span variants={staggerLine} className="block">Der Auftritt,</motion.span>
                                <motion.span variants={staggerLine} className="block">der nach Ihnen aussieht.</motion.span>
                            </h1>
                            <motion.p variants={staggerLine} className="text-base md:text-lg text-fg/50 max-w-xl leading-relaxed mb-4">
                                Websites, Webanwendungen und KI-Integration zum Festpreis. Für Kanzleien, Praxen, Architekten, Immobilien und Manufakturen in Leipzig, bei denen der Auftritt das Vertrauenssignal ist.
                            </motion.p>
                            <motion.p variants={staggerLine} className="text-sm text-fg/40 max-w-xl leading-relaxed mb-10">
                                In Stadt und Landkreis Leipzig sowie Nordsachsen derzeit mit 35 bis 60 % der förderfähigen Kosten über die SAB bezuschussbar. Über die Förderung entscheidet allein die SAB, ein Rechtsanspruch besteht nicht. Stand {GRANT.asOf}.
                            </motion.p>
                            <motion.div variants={staggerLine} className="flex flex-wrap gap-4">
                                <Button href="/auftritt" size="lg">
                                    Zum Angebot
                                </Button>
                                <Button href="/work" variant="outline" size="lg">
                                    Projekte ansehen
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
                        alt="Leipzig bei Nacht"
                        fill
                        className="object-cover img-bw"
                        priority
                        sizes="100vw"
                    />
                </motion.div>
            </section>

            {/* Projects — ruled-line list, anchors into /work */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">001 — Projekte</span>
                            <h2 className="text-4xl md:text-5xl font-light tracking-tighter mb-4">Gebaut und in Betrieb</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed">
                                Eine Lernplattform für die HTWK Leipzig, als externer Auftragnehmer zum Festpreis gebaut. Und ein eigenes Produkt, von der Marke bis zur Anwendung selbst entwickelt.
                            </p>
                        </motion.div>
                    </div>

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
                                <Link href={`/work#${project.slug}`} className="block group">
                                    <div className="grid grid-cols-12 gap-4 py-8 border-b border-fg/10 items-center transition-transform duration-300 group-hover:translate-x-2">
                                        <div className="col-span-1 hidden md:block">
                                            <span className="font-mono text-[11px] text-fg/30">{String(index + 1).padStart(2, "0")}</span>
                                        </div>
                                        <div className="col-span-12 md:col-span-5">
                                            <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-fg/70 transition-colors">{project.title}</h3>
                                        </div>
                                        <div className="col-span-12 md:col-span-4">
                                            <p className="text-sm text-fg/40 leading-relaxed" lang="en">{project.description}</p>
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
                            Alle Projekte
                        </Button>
                    </div>
                </div>
            </section>

            {/* The offer — three formats, one fixed price each */}
            <section className="py-24 md:py-32 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 mb-16">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-7"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">002 — Angebot</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-4">Drei Formate, jeweils zum Festpreis.</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed">
                                Sie kennen den Preis, bevor es losgeht. Änderungen am Umfang vereinbaren wir vorher schriftlich, nie hinterher auf der Rechnung.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid grid-cols-12 gap-12 md:gap-10">
                        {OFFERS.map((o, i) => (
                            <motion.div
                                key={o.key}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                custom={i + 1}
                                className="col-span-12 md:col-span-4"
                            >
                                <div className="border-t border-fg/10 pt-8 h-full">
                                    <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-fg/30 block mb-4">{o.what}</span>
                                    <h3 className="text-xl font-light tracking-tight mb-3">{o.name}</h3>
                                    <p className="text-sm text-fg/50 leading-relaxed mb-4">{o.lead}</p>
                                    <p className="font-mono text-[11px] text-fg/40">{o.duration}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-14 flex flex-wrap items-center gap-6">
                        <Button href="/auftritt" variant="outline">
                            Zum Angebot mit Preisen
                        </Button>
                        <p className="text-[13px] text-fg/40 max-w-md leading-relaxed">
                            Angebot für Unternehmer im Sinne von § 14 BGB. Preise netto zuzüglich gesetzlicher Umsatzsteuer. Die SAB fördert Anwendungen mit unmittelbarem Mehrwert für die betrieblichen Abläufe; eine reine Präsentationsseite fördert sie nicht.
                        </p>
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
                            &bdquo;Der Auftritt ist das erste Vertrauenssignal. Er sollte so aussehen, wie Sie arbeiten.&ldquo;
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Erstgespräch */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">003 — Erstgespräch</span>
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">Sagen Sie uns, worum es geht.</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed mb-10">
                                30 Minuten, kostenlos, per Telefon oder in der Mädler-Passage. Wir sagen Ihnen, ob es passt, und ob Ihr Vorhaben in das Förderfenster fällt.
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

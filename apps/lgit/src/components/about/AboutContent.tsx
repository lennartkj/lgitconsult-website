"use client";

import Image from "next/image";
import { motion, type Variants, type Easing } from "framer-motion";

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

const slideFromRight: Variants = {
    hidden: { opacity: 0, x: 40 },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.6,
            ease: [0.16, 1, 0.3, 1] as unknown as Easing,
        },
    },
};

export default function AboutContent() {
    const values = [
        { title: "Festpreis", number: "01", description: "Sie kennen den Preis, bevor es losgeht. Änderungen am Umfang vereinbaren wir vorher schriftlich, nie hinterher auf der Rechnung." },
        { title: "Zurückhaltung", number: "02", description: "Das Objekt spricht, die Seite hält den Mund. Keine Effekte, die vom Inhalt ablenken, keine Vorlage, die nach Vorlage aussieht." },
        { title: "Betrieb statt Demo", number: "03", description: "Was wir bauen, läuft: Hosting, Dokumentation, Einweisung und Übergabe gehören zum Auftrag, nicht zum Kleingedruckten." },
        { title: "Leipzig", number: "04", description: "Erstgespräch in der Mädler-Passage, feste Abnahmepunkte, kurze Wege. Gebaut und in Betrieb: der XTE Webcourse der HTWK Leipzig." }
    ];

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
                            className="col-span-12 md:col-span-8 lg:col-span-7"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">001 — Über uns</span>
                            <h1 className="text-5xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                LGIT Consult
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                                Das Büro von Lennart Gründel in der Leipziger Mädler-Passage. Websites, Webanwendungen und KI-Integration für Unternehmen, bei denen der Auftritt das Vertrauenssignal ist. Zum Festpreis, mit festen Abnahmepunkten, in Betrieb übergeben.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Full-bleed image — camera collection, grain overlay */}
            <section className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden img-editorial">
                <Image
                    src="/images/camera-collection.jpg"
                    alt="Eine Sammlung alter Kameras"
                    fill
                    className="object-cover img-bw"
                    sizes="100vw"
                />
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block">002 — Haltung</span>
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={1}
                            className="col-span-12 md:col-span-7"
                        >
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter mb-8">Der Auftritt ist das Vertrauenssignal.</h2>
                            <p className="text-base text-fg/50 leading-relaxed mb-6">
                                Kanzleien, Praxen, Architekten, Immobilien, Manufakturen: Mandate und Aufträge kommen über Vertrauen, und das erste Vertrauenssignal ist heute die Website. Wir bauen sie so, dass sie zeigt, wie Sie arbeiten. Und wir binden an, was dahinter Zeit frisst: Terminbuchung, Mandantenportal, Bestand, die Dokumente, die ein Sprachmodell besser vorsortiert als ein Postfach.
                            </p>
                            <p className="text-base text-fg/50 leading-relaxed">
                                Für Fotografie und Text holen wir bei Bedarf Partner aus Leipzig dazu. Die Verantwortung für das Ergebnis bleibt bei uns.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mixed-scale image grid — editorial rhythm break */}
            <section className="py-0">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 gap-4">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-7 relative h-[40vh] md:h-[50vh] img-editorial"
                        >
                            <Image
                                src="/images/leica-engraving.jpg"
                                alt="Gravur einer Leica, Ernst Leitz Wetzlar"
                                fill
                                className="object-cover img-bw"
                                sizes="(max-width: 768px) 100vw, 58vw"
                            />
                        </motion.div>
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={1}
                            className="col-span-12 md:col-span-5 relative h-[40vh] md:h-[50vh] img-editorial"
                        >
                            <Image
                                src="/images/leica-lens.jpg"
                                alt="Objektivdeckel einer Leica"
                                fill
                                className="object-cover img-bw"
                                sizes="(max-width: 768px) 100vw, 42vw"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Values Section — ruled-line list */}
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
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">003 — Arbeitsweise</span>
                            <h2 className="text-3xl md:text-4xl font-light tracking-tighter">Wofür wir stehen</h2>
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
                        variants={slideFromRight}
                        className="grid grid-cols-12"
                    >
                        <p className="col-span-12 md:col-span-8 md:col-start-3 text-2xl md:text-4xl font-light tracking-tight leading-snug text-fg/70">
                            &bdquo;Zurückhaltung als Luxus. Systeme als Ästhetik. Die Spannung zwischen analog und digital: dort arbeiten wir.&ldquo;
                        </p>
                    </motion.div>
                </div>
            </section>
        </>
    );
}

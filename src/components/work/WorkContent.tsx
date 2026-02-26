"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Project } from "@/lib/data/types";

interface WorkContentProps {
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
            ease: "easeOut" as const,
        },
    }),
};

const categories = [
    { id: "all", name: "All" },
    { id: "web", name: "Web" },
    { id: "mobile", name: "Mobile" },
    { id: "design", name: "Design" },
];

export default function WorkContent({ projects: initialProjects }: WorkContentProps) {
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);

    const handleFilter = (filterId: string) => {
        setActiveFilter(filterId);
        if (filterId === 'all') {
            setFilteredProjects(initialProjects);
        } else {
            setFilteredProjects(
                initialProjects.filter(project =>
                    project.tags.some(tag => tag.toLowerCase().includes(filterId))
                )
            );
        }
    };

    return (
        <>
            {/* Hero Section — left-aligned */}
            <section className="py-24 md:py-32 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-7"
                        >
                            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">Portfolio</span>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tighter leading-[0.95] mb-6">
                                Our Work
                            </h1>
                            <p className="text-base text-fg/50 leading-relaxed max-w-lg">
                                Selected projects and case studies across digital products, campaigns, and creative ventures.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Filters — left-aligned, mono */}
            <section className="py-6 border-b border-fg/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap gap-6">
                        {categories.map((category, index) => (
                            <motion.button
                                key={category.id}
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                custom={index}
                                onClick={() => handleFilter(category.id)}
                                className={`font-mono text-[11px] uppercase tracking-[0.15em] transition-colors ${
                                    activeFilter === category.id
                                        ? "text-fg"
                                        : "text-fg/30 hover:text-fg/60"
                                }`}
                            >
                                {category.name}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects — ruled-line list */}
            <section className="py-24 md:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    {filteredProjects.length > 0 ? (
                        <div className="border-t border-fg/10">
                            {filteredProjects.map((project, index) => (
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
                                                <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-fg/70 transition-colors">
                                                    {project.title}
                                                    {project.featured && (
                                                        <span className="ml-3 font-mono text-[10px] uppercase tracking-[0.1em] text-fg/30 align-middle">Featured</span>
                                                    )}
                                                </h3>
                                            </div>
                                            <div className="col-span-12 md:col-span-4">
                                                <p className="text-sm text-fg/40 leading-relaxed">{project.description}</p>
                                            </div>
                                            <div className="col-span-12 md:col-span-2 flex flex-wrap gap-2">
                                                {project.tags.slice(0, 3).map((tag) => (
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
                    ) : (
                        <div className="text-center py-24 text-fg/40 font-mono text-sm">
                            No projects found for the current filter.
                        </div>
                    )}
                </div>
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
                            <h2 className="text-4xl md:text-6xl font-light tracking-tighter mb-6">Ready to Start Your Project?</h2>
                            <p className="text-fg/50 max-w-lg leading-relaxed mb-10">
                                Tell us about your vision — we&apos;ll figure out the best way to bring it to life.
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

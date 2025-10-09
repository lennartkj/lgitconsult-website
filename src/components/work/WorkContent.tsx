"use client";

import React, { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardLink } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Project } from "@/lib/data/types"; // Import types

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
            ease: "easeOut" as const, // Fixes Framer Motion type error
        },
    }),
};

// Vordefinierte Filter-Kategorien (statisch, da die Filterlogik hier nicht implementiert wird)
const categories = [
    { id: "all", name: "All Projects" },
    { id: "web", name: "Web Development" },
    { id: "mobile", name: "Mobile Apps" },
    { id: "design", name: "UI/UX Design" },
];

export default function WorkContent({ projects: initialProjects }: WorkContentProps) {
    // State für die Filterung
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(initialProjects);

    // Filter-Funktion (nutzt client-seitige Daten)
    const handleFilter = (filterId: string) => {
        setActiveFilter(filterId);
        if (filterId === 'all') {
            setFilteredProjects(initialProjects);
        } else {
            // Filtert Projekte basierend auf dem Tag
            setFilteredProjects(
                initialProjects.filter(project =>
                    project.tags.some(tag => tag.toLowerCase().includes(filterId))
                )
            );
        }
    };

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
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                            Our Work
                        </h1>
                        <p className="text-lg text-fg/70">
                            Explore our portfolio of projects and case studies showcasing our expertise in web development and IT consulting.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Filters Section */}
            <section className="py-8 border-b border-fg/10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {categories.map((category, index) => (
                            <motion.div
                                key={category.id}
                                initial="hidden"
                                animate="visible"
                                variants={fadeIn}
                                custom={index}
                            >
                                <Button
                                    onClick={() => handleFilter(category.id)}
                                    variant={activeFilter === category.id ? "primary" : "outline"}
                                    size="sm"
                                >
                                    {category.name}
                                </Button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project, index) => (
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
                                                className="w-full h-full transition-transform duration-500 hover:scale-105"
                                            />
                                            {project.featured && (
                                                <div className="absolute top-2 right-2 bg-accent text-accent-contrast text-xs px-2 py-1 rounded-full">
                                                    Featured
                                                </div>
                                            )}
                                        </div>
                                        <CardHeader>
                                            <CardTitle>{project.title}</CardTitle>
                                            <CardDescription>{project.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow">
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {project.tags.map((tag) => (
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
                                            <Link href={`/work/${project.slug}`} variant="underline">
                                                View Case Study
                                            </Link>
                                        </CardFooter>
                                    </CardLink>
                                </motion.div>
                            ))
                        ) : (
                            <div className="md:col-span-3 text-center py-12 text-fg/70">
                                No projects found for the current filter.
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                        >
                            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
                            <p className="text-fg/70 mb-8">
                                Contact us today to discuss how we can help bring your vision to life.
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

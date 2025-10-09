"use client";

import React from "react";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Card, CardContent } from "@/components/ui/Card";
import {
    ProjectHero,
    ProjectHeroImage,
    ProjectDetails,
    ProjectSidebar,
    RelatedProjectsHeader,
    RelatedProjectCard,
    CTASection
} from "@/components/motion/MotionSection";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Project } from "@/lib/data/types"; // Stellen Sie sicher, dass Sie die Typen aus types.ts importieren

interface ProjectContentProps {
    project: Project;
    mdxSource: MDXRemoteSerializeResult;
    relatedProjects: Project[];
}

export default function ProjectContent({ project, mdxSource, relatedProjects }: ProjectContentProps) {
    return (
        <>
            {/* Hero Section */}
            <section className="py-16 md:py-24 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <ProjectHero custom={0}>
                            <div className="flex flex-wrap gap-2 mb-4">
                                {(project.tags ?? []).map((tag) => (
                                    <span
                                        key={tag}
                                        className="text-xs bg-fg/10 text-fg/80 px-2 py-1 rounded-full"
                                    >
                    {tag}
                  </span>
                                ))}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                                {project.title}
                            </h1>
                            <p className="text-lg text-fg/70">
                                {project.description}
                            </p>
                        </ProjectHero>
                        <ProjectHeroImage custom={1}>
                            <Placeholder
                                text={project.title}
                                bgColor="#0070f3"
                                textColor="#ffffff"
                                className="w-full h-full rounded-lg"
                            />
                        </ProjectHeroImage>
                    </div>
                </div>
            </section>

            {/* Project Details */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-lg max-w-none">
                        {/* MDXRemote ist hier sicher, da es sich um einen Client-Component handelt */}
                        <MDXRemote {...mdxSource} />
                    </div>
                </div>
            </section>

            {/* Related Projects */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <RelatedProjectsHeader custom={0}>
                        <h2 className="text-3xl font-bold mb-4">Related Projects</h2>
                        <p className="text-fg/70 max-w-2xl mx-auto">
                            Explore more of our work in similar areas.
                        </p>
                    </RelatedProjectsHeader>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {relatedProjects.map((relatedProject, index) => (
                            <RelatedProjectCard
                                key={relatedProject.id}
                                custom={index + 1}
                            >
                                <Card href={`/work/${relatedProject.slug}`} className="h-full">
                                    <div className="relative h-48 w-full mb-4 rounded overflow-hidden">
                                        <Placeholder
                                            text={relatedProject.title}
                                            bgColor={index % 2 === 0 ? "#0070f3" : "#6366f1"}
                                            textColor="#ffffff"
                                            className="w-full h-full"
                                        />
                                    </div>
                                    <CardContent>
                                        <h3 className="text-xl font-bold mb-2">{relatedProject.title}</h3>
                                        <p className="text-fg/70 mb-4">{relatedProject.description}</p>
                                        <Link href={`/work/${relatedProject.slug}`} variant="underline">
                                            View Case Study
                                        </Link>
                                    </CardContent>
                                </Card>
                            </RelatedProjectCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <CTASection custom={0}>
                            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
                            <p className="text-fg/70 mb-8">
                                Contact us today to discuss how we can help bring your vision to life.
                            </p>
                            <Button href="/contact">
                                Get in Touch
                            </Button>
                        </CTASection>
                    </div>
                </div>
            </section>
        </>
    );
}
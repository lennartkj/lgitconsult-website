"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
// WICHTIG: Importiere CardLink für klickbare Elemente
import { Card, CardContent, CardLink } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Post, Category } from "@/lib/data/types"; // Import types

interface JournalContentProps {
    featuredPosts: Post[];
    allPosts: Post[]; // Alle Posts (Featured & Regular)
    categories: Category[];
}

// Animation variants
const fadeIn = {
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

export default function JournalContent({ allPosts: initialAll, categories }: JournalContentProps) {
    // Filtere Featured Posts für den Featured Bereich
    const featuredPosts = initialAll.filter(post => post.featured);

    // Initialer State für die Anzeige: alle NICHT-Featured Posts
    const initialRegular = initialAll.filter(post => !post.featured);
    const [regularPosts, setRegularPosts] = useState<Post[]>(initialRegular);

    const [activeCategory, setActiveCategory] = useState("All");

    const filterPosts = (categoryName: string) => {
        setActiveCategory(categoryName);

        // Filtere basierend auf der initialen, vom Server geladenen Liste
        if (categoryName === "All") {
            setRegularPosts(initialRegular);
        } else {
            setRegularPosts(initialRegular.filter(post => post.category.toLowerCase() === categoryName.toLowerCase()));
        }
    };


    return (
        <>
            {/* Hero Section with Placeholder */}
            <section className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        custom={0}
                        className="mx-auto"
                    >
                        <Placeholder
                            width={1200}
                            height={300}
                            text="Our Journal"
                            pattern="random"
                            randomColors={true}
                            className="w-full rounded-lg shadow-md"
                        />
                    </motion.div>
                </div>
            </section>

            {/* Featured Posts */}
            {featuredPosts.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="mb-12"
                        >
                            <h2 className="text-3xl font-bold mb-4">Featured Articles</h2>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {featuredPosts.map((post, index) => (
                                <motion.div
                                    key={post.slug} // Verwende slug als key
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeIn}
                                    custom={index + 1}
                                >
                                    {/* FIX: Card durch CardLink ersetzt */}
                                    <CardLink href={`/journal/${post.slug}`} className="h-full flex flex-col">
                                        <div className="relative h-64 w-full mb-4 rounded-lg overflow-hidden">
                                            <Placeholder
                                                text={post.title}
                                                pattern="random"
                                                randomColors={true}
                                                className="w-full h-full transition-transform duration-500 hover:scale-105"
                                            />
                                            <div className="absolute top-4 left-4 bg-accent text-accent-contrast text-xs px-2 py-1 rounded-full">
                                                Featured
                                            </div>
                                        </div>
                                        <CardContent className="flex-grow">
                                            <div className="flex items-center text-sm text-fg/60 mb-2">
                                                <span>{post.date}</span>
                                                <span className="mx-2">•</span>
                                                <span>{post.category}</span>
                                            </div>
                                            <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                                            <p className="text-fg/70 mb-4">{post.excerpt}</p>
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs bg-fg/10 text-fg/80 px-2 py-1 rounded-full"
                                                    >
                            {tag}
                          </span>
                                                ))}
                                            </div>
                                            <div className="mt-auto pt-4">
                                                <Link href={`/journal/${post.slug}`} variant="underline">
                                                    Read More
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </CardLink>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts */}
            <section className="py-16 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="lg:col-span-1"
                        >
                            <Card>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-4">Categories</h3>
                                    <ul className="space-y-2">
                                        {categories.map((category) => (
                                            <li key={category.name}>
                                                <button
                                                    onClick={() => filterPosts(category.name)}
                                                    className={`flex justify-between items-center w-full py-1 text-left transition-colors 
                                ${activeCategory === category.name ? 'text-accent font-bold' : 'text-fg hover:text-accent'}`}
                                                >
                                                    <span>{category.name}</span>
                                                    <span className={`text-sm px-2 py-0.5 rounded-full 
                              ${activeCategory === category.name ? 'bg-accent text-accent-contrast' : 'bg-fg/10 text-fg/70'}`}
                                                    >
                            {category.count}
                          </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </motion.div>

                        {/* Posts Grid */}
                        <div className="lg:col-span-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {regularPosts.length > 0 ? (
                                    regularPosts.map((post, index) => (
                                        <motion.div
                                            key={post.slug} // Verwende slug als key
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-50px" }}
                                            variants={fadeIn}
                                            custom={index + 1}
                                        >
                                            {/* FIX: Card durch CardLink ersetzt */}
                                            <CardLink href={`/journal/${post.slug}`} className="h-full flex flex-col">
                                                <div className="relative h-48 w-full mb-4 rounded-lg overflow-hidden">
                                                    <Placeholder
                                                        text={post.title}
                                                        pattern="random"
                                                        randomColors={true}
                                                        className="w-full h-full transition-transform duration-500 hover:scale-105"
                                                    />
                                                </div>
                                                <CardContent className="flex-grow">
                                                    <div className="flex items-center text-sm text-fg/60 mb-2">
                                                        <span>{post.date}</span>
                                                        <span className="mx-2">•</span>
                                                        <span>{post.category}</span>
                                                    </div>
                                                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                                                    <p className="text-fg/70 mb-4">{post.excerpt}</p>
                                                    <div className="mt-auto pt-4">
                                                        <Link href={`/journal/${post.slug}`} variant="underline">
                                                            Read More
                                                        </Link>
                                                    </div>
                                                </CardContent>
                                            </CardLink>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="md:col-span-2 text-center py-12 text-fg/70">
                                        No articles found in this category.
                                    </div>
                                )}
                            </div>

                            <div className="mt-12 flex justify-center">
                                <Button variant="outline">
                                    Load More Articles
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
}

"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import { motion } from "framer-motion";
import { Post, Category } from "@/lib/data/types";

interface JournalContentProps {
    featuredPosts: Post[];
    allPosts: Post[];
    categories: Category[];
}

const fadeIn = {
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

export default function JournalContent({ allPosts: initialAll, categories }: JournalContentProps) {
    const featuredPosts = initialAll.filter(post => post.featured);
    const initialRegular = initialAll.filter(post => !post.featured);
    const [regularPosts, setRegularPosts] = useState<Post[]>(initialRegular);
    const [activeCategory, setActiveCategory] = useState("All");

    const filterPosts = (categoryName: string) => {
        setActiveCategory(categoryName);
        if (categoryName === "All") {
            setRegularPosts(initialRegular);
        } else {
            setRegularPosts(initialRegular.filter(post => post.category.toLowerCase() === categoryName.toLowerCase()));
        }
    };

    return (
        <>
            {/* Hero Section — left-aligned, editorial */}
            <section className="py-24 md:py-32 lg:py-48 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-7"
                        >
                            <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">001 — Journal</span>
                            <h1 className="text-4xl md:text-6xl lg:text-8xl font-light tracking-tighter leading-[0.9] mb-8">
                                Thoughts & Work
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                                Notes on technology, creative work, and the intersection of both.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Featured Posts — ruled-line */}
            {featuredPosts.length > 0 && (
                <section className="py-16 md:py-24 lg:py-32">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-12 mb-12">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                custom={0}
                                className="col-span-12 md:col-span-6"
                            >
                                <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-4">002 — Featured</span>
                            </motion.div>
                        </div>

                        <div className="border-t border-fg/10">
                            {featuredPosts.map((post, index) => (
                                <motion.div
                                    key={post.slug}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeIn}
                                    custom={index + 1}
                                >
                                    <NextLink href={`/journal/${post.slug}`} className="block group">
                                        <div className="grid grid-cols-12 gap-4 py-6 md:py-8 border-b border-fg/10 items-baseline transition-transform duration-300 group-hover:translate-x-2">
                                            <div className="col-span-12 md:col-span-2">
                                                <span className="font-mono text-xs md:text-[11px] text-fg/30">{post.date}</span>
                                            </div>
                                            <div className="col-span-12 md:col-span-5">
                                                <h3 className="text-xl md:text-2xl font-light tracking-tight group-hover:text-fg/70 transition-colors">{post.title}</h3>
                                            </div>
                                            <div className="col-span-12 md:col-span-4">
                                                <p className="text-sm text-fg/40 leading-relaxed">{post.excerpt}</p>
                                            </div>
                                            <div className="col-span-12 md:col-span-1 text-right hidden md:block">
                                                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg/30">{post.category}</span>
                                            </div>
                                        </div>
                                    </NextLink>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All Posts — with category filters */}
            <section className="py-16 md:py-24 lg:py-32 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 gap-12">
                        {/* Sidebar — categories as text list */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-3"
                        >
                            <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">003 — Archive</span>
                            <div className="border-t border-fg/10">
                                {categories.map((category) => (
                                    <button
                                        key={category.name}
                                        onClick={() => filterPosts(category.name)}
                                        className={`flex justify-between items-center w-full py-3 border-b border-fg/10 text-left text-sm transition-colors ${
                                            activeCategory === category.name
                                                ? "text-fg"
                                                : "text-fg/40 hover:text-fg/70"
                                        }`}
                                    >
                                        <span>{category.name}</span>
                                        <span className="font-mono text-[10px] text-fg/30">{category.count}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Posts list — ruled-line */}
                        <div className="col-span-12 md:col-span-9">
                            {regularPosts.length > 0 ? (
                                <div className="border-t border-fg/10">
                                    {regularPosts.map((post, index) => (
                                        <motion.div
                                            key={post.slug}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true, margin: "-50px" }}
                                            variants={fadeIn}
                                            custom={index}
                                        >
                                            <NextLink href={`/journal/${post.slug}`} className="block group">
                                                <div className="py-8 border-b border-fg/10 transition-transform duration-300 group-hover:translate-x-2">
                                                    <div className="flex items-baseline gap-4 mb-2">
                                                        <span className="font-mono text-xs md:text-[11px] text-fg/30">{post.date}</span>
                                                        <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg/30">{post.category}</span>
                                                    </div>
                                                    <h3 className="text-xl font-light tracking-tight group-hover:text-fg/70 transition-colors mb-2">{post.title}</h3>
                                                    <p className="text-sm text-fg/40 leading-relaxed max-w-2xl">{post.excerpt}</p>
                                                </div>
                                            </NextLink>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-24 text-fg/40 font-mono text-sm">
                                    No articles found in this category.
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

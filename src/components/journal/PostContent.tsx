"use client";

import React from "react";
import NextLink from "next/link";
import { Post } from "@/lib/data/types";
import { motion, type Easing, type Variants } from "framer-motion";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

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

interface PostContentProps {
    post: Post;
    mdxSource: MDXRemoteSerializeResult;
    relatedPosts: Post[];
}

export default function PostContent({ post, mdxSource, relatedPosts }: PostContentProps) {
    const tocEntries = post.content
        ? [...post.content.matchAll(/^## (.+)$/gm)].map((match) => {
            const title = match[1];
            const anchor = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
            return { title, anchor };
        })
        : [];

    const postIndex = post.id?.toString().padStart(3, '0') ?? '001';

    return (
        <>
            {/* Hero — left-aligned, editorial */}
            <section className="py-24 md:py-32 lg:py-48 bg-muted">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12">
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 md:col-span-8 lg:col-span-7"
                        >
                            <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">
                                {postIndex} — Article
                            </span>
                            <h1 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tighter leading-[0.95] mb-8">
                                {post.title}
                            </h1>
                            <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg mb-8">
                                {post.excerpt}
                            </p>
                            <div className="flex items-baseline gap-6 font-mono text-xs md:text-[11px] text-fg/40">
                                <span>{post.date}</span>
                                <span className="uppercase tracking-[0.1em]">{post.author}</span>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Article body + sidebar */}
            <section className="py-16 md:py-24 lg:py-32">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-12 gap-x-8 lg:gap-x-12">
                        {/* Article */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="col-span-12 lg:col-span-7"
                        >
                            <article className="prose prose-sm md:prose-lg max-w-none">
                                <MDXRemote {...mdxSource} />
                            </article>

                            {/* Tags */}
                            {post.tags.length > 0 && (
                                <div className="mt-16 pt-8 border-t border-fg/10">
                                    <div className="flex flex-wrap gap-4">
                                        {post.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="font-mono text-xs md:text-[11px] uppercase tracking-[0.15em] text-fg/40"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Author */}
                            {post.authorBio && (
                                <div className="mt-12 pt-8 border-t border-fg/10">
                                    <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-3">Author</span>
                                    <h3 className="text-lg font-light tracking-tight mb-2">{post.author}</h3>
                                    <p className="text-sm text-fg/50 leading-relaxed max-w-lg">{post.authorBio}</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Sidebar TOC — desktop only */}
                        {tocEntries.length > 0 && (
                            <motion.aside
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeIn}
                                custom={1}
                                className="hidden lg:block lg:col-span-3 lg:col-start-9"
                            >
                                <div className="sticky top-24">
                                    <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">Contents</span>
                                    <nav className="border-t border-fg/10">
                                        {tocEntries.map((entry, index) => (
                                            <a
                                                key={index}
                                                href={`#${entry.anchor}`}
                                                className="block py-3 border-b border-fg/10 text-sm text-fg/50 hover:text-fg transition-colors"
                                            >
                                                {entry.title}
                                            </a>
                                        ))}
                                    </nav>
                                </div>
                            </motion.aside>
                        )}
                    </div>
                </div>
            </section>

            {/* Related — ruled-line list */}
            {relatedPosts.length > 0 && (
                <section className="py-16 md:py-24 lg:py-32 bg-muted">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="mb-12"
                        >
                            <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40">Related</span>
                        </motion.div>

                        <div className="border-t border-fg/10">
                            {relatedPosts.map((relatedPost, index) => (
                                <motion.div
                                    key={relatedPost.slug}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true, margin: "-50px" }}
                                    variants={fadeIn}
                                    custom={index + 1}
                                >
                                    <NextLink href={`/journal/${relatedPost.slug}`} className="block group">
                                        <div className="py-6 md:py-8 border-b border-fg/10 transition-transform duration-300 group-hover:translate-x-2 md:grid md:grid-cols-12 md:gap-4 md:items-baseline">
                                            <div className="md:col-span-2 mb-1 md:mb-0">
                                                <span className="font-mono text-xs md:text-[11px] text-fg/30">{relatedPost.date}</span>
                                            </div>
                                            <div className="md:col-span-5">
                                                <h3 className="text-lg md:text-2xl font-light tracking-tight group-hover:text-fg/70 transition-colors">{relatedPost.title}</h3>
                                            </div>
                                            <div className="hidden md:block md:col-span-4">
                                                <p className="text-sm text-fg/40 leading-relaxed">{relatedPost.excerpt}</p>
                                            </div>
                                            <div className="hidden md:block md:col-span-1 text-right">
                                                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fg/30">{relatedPost.category}</span>
                                            </div>
                                        </div>
                                    </NextLink>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </>
    );
}

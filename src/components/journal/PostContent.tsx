"use client";

import React from "react";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Card, CardContent, CardLink } from "@/components/ui/Card"; // CardLink für Related Posts hinzugefügt
import { Post, Category } from "@/lib/data/types";
import { motion, type Easing, type Variants } from "framer-motion"; // Easing und Variants importiert
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

// Animation variants
const fadeIn: Variants = { // Typisierung zu Variants geändert
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: {
            delay: i * 0.1,
            duration: 0.5,
            // FIX: Verwendung des String-Literals mit expliziter Easing-Typisierung
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
    // Generiere Inhaltsverzeichnis-Ankerpunkte
    const tocEntries = post.content
        ? post.content.match(/<h2>(.*?)<\/h2>/g)?.map((match) => {
            const title = match.replace(/<h2>|<\/h2>/g, '');
            // Ersetzt Leerzeichen durch Bindestriche und konvertiert zu Kleinbuchstaben
            const anchor = title.toLowerCase().replace(/\s+/g, '-');
            return { title, anchor };
        })
        : [];

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
                        <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-sm bg-accent text-accent-contrast px-3 py-1 rounded-full">
                {post.category}
              </span>
                            <span className="text-sm text-fg/60">
                                {post.date}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
                            {post.title}
                        </h1>
                        <p className="text-lg text-fg/70 mb-6">
                            {post.excerpt}
                        </p>
                        <div className="flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-accent/20 mr-3 flex items-center justify-center">
                                {post.author.charAt(0)}
                            </div>
                            <span className="font-medium">{post.author}</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Featured Image */}
            <section className="py-8">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        custom={1}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative h-[400px] rounded-lg overflow-hidden">
                            <Placeholder
                                text={post.title}
                                bgColor="#0070f3"
                                textColor="#ffffff"
                                className="w-full h-full rounded-lg"
                            />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Article Content and Sidebar */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Main Content (MDX Render) */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="lg:col-span-3"
                        >
                            <article className="prose prose-lg max-w-none">
                                <MDXRemote {...mdxSource} />
                            </article>

                            {/* Share Section */}
                            <div className="mt-12 pt-8 border-t border-fg/10">
                                <h3 className="text-2xl font-bold mb-4">Share this article</h3>
                                <div className="flex gap-4">
                                    <Button variant="outline" size="sm">
                                        Twitter
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        LinkedIn
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        Facebook
                                    </Button>
                                </div>
                            </div>

                            {/* Author Bio */}
                            <div className="mt-12 pt-8 border-t border-fg/10">
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-xl">
                                        {post.author.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold">{post.author}</h3>
                                        <p className="text-fg/70 mt-1">{post.authorBio}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Sidebar / Table of Contents */}
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={1}
                            className="lg:col-span-1"
                        >
                            <div className="sticky top-24">
                                <Card>
                                    <CardContent>
                                        <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                                        <nav className="space-y-2 text-sm">
                                            {tocEntries?.map((entry, index) => (
                                                <div key={index} className="hover:text-accent">
                                                    <a href={`#${entry.anchor}`}>{entry.title}</a>
                                                </div>
                                            ))}
                                        </nav>

                                        <div className="mt-8">
                                            <h3 className="text-xl font-bold mb-4">Tags</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {post.tags.map((tag) => (
                                                    <span
                                                        key={tag}
                                                        className="text-xs bg-fg/10 text-fg/80 px-2 py-1 rounded-full"
                                                    >
                            {tag}
                          </span>
                                                ))}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
                <section className="py-16 bg-muted">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                            className="text-center mb-12"
                        >
                            <h2 className="text-3xl font-bold mb-4">Related Articles</h2>
                            <p className="text-fg/70 max-w-2xl mx-auto">
                                Continue exploring topics related to {post.category}.
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedPosts.map((relatedPost, index) => (
                                <motion.div
                                    key={relatedPost.slug} // key auf slug geändert (stabiler)
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeIn}
                                    custom={index + 1}
                                >
                                    {/* FIX: CardLink anstelle von Card, da verlinkt */}
                                    <CardLink href={`/journal/${relatedPost.slug}`} className="h-full">
                                        <div className="relative h-48 w-full mb-4 rounded overflow-hidden">
                                            <Placeholder
                                                text={relatedPost.title}
                                                bgColor={index % 2 === 0 ? "#6366f1" : "#0070f3"}
                                                textColor="#ffffff"
                                                className="w-full h-full"
                                            />
                                        </div>
                                        <CardContent>
                                            <div className="flex items-center text-sm text-fg/60 mb-2">
                                                <span>{relatedPost.date}</span>
                                                <span className="mx-2">•</span>
                                                <span>{relatedPost.category}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{relatedPost.title}</h3>
                                            <p className="text-fg/70 mb-4">{relatedPost.excerpt}</p>
                                            <Link href={`/journal/${relatedPost.slug}`} variant="underline">
                                                Read More
                                            </Link>
                                        </CardContent>
                                    </CardLink>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter Section */}
            <section className="py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto text-center">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeIn}
                            custom={0}
                        >
                            <h2 className="text-3xl font-bold mb-4">Enjoyed this article?</h2>
                            <p className="text-fg/70 mb-8">
                                Subscribe to our newsletter to receive more insights and articles like this directly in your inbox.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                <input
                                    type="email"
                                    placeholder="Your email address"
                                    className="flex-grow px-4 py-2 border border-fg/20 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                />
                                <Button>
                                    Subscribe
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </>
    );
}

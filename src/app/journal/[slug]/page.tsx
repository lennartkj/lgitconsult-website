"use client";

import { useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";
import { Card, CardContent } from "@/components/ui/Card";

// Animation variants
const fadeIn = {
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


export default function BlogPostPage({ params }: { params: { slug: string } }) {
  // State for post and related posts
  const [post, setPost] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch post by slug
        const postResponse = await fetch(`/api/content?type=posts&slug=${params.slug}`);

        // If post not found, show 404 page
        if (!postResponse.ok) {
          notFound();
        }

        const postData = await postResponse.json();

        // Fetch related posts (posts in the same category)
        const category = postData.content.category;
        const relatedResponse = await fetch(`/api/content?type=posts&category=${category}`);
        const relatedData = await relatedResponse.json();

        // Filter out the current post and limit to 3 related posts
        const filteredRelatedPosts = relatedData
          .filter(relatedPost => relatedPost.slug !== params.slug)
          .slice(0, 3);

        // Update state
        setPost(postData.content);
        setRelatedPosts(filteredRelatedPosts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching post:', error);
        notFound();
      }
    };

    fetchData();
  }, [params.slug]);

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

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

      {/* Article Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={0}
              className="lg:col-span-3"
            >
              <article className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </article>

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
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-4">Table of Contents</h3>
                    <nav className="space-y-2 text-sm">
                      {post.content.match(/<h2>(.*?)<\/h2>/g)?.map((match, index) => {
                        const title = match.replace(/<h2>|<\/h2>/g, '');
                        const anchor = title.toLowerCase().replace(/\s+/g, '-');
                        return (
                          <div key={index} className="hover:text-accent">
                            <a href={`#${anchor}`}>{title}</a>
                          </div>
                        );
                      })}
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
                  key={relatedPost.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeIn}
                  custom={index + 1}
                >
                  <Card href={`/journal/${relatedPost.slug}`} className="h-full">
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
                  </Card>
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
                  className="flex-grow px-4 py-2 border border-fg/20 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
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

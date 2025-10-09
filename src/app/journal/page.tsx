"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Link } from "@/components/ui/Link";

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

export default function JournalPage() {
  // State for posts and categories
  const [posts, setPosts] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [regularPosts, setRegularPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all posts
        const postsResponse = await fetch('/api/content?type=posts');
        const postsData = await postsResponse.json();

        // Separate featured and regular posts
        const featured = postsData.filter(post => post.featured);
        const regular = postsData.filter(post => !post.featured);

        // Generate categories from posts
        const categoryMap = {};
        postsData.forEach(post => {
          if (!categoryMap[post.category]) {
            categoryMap[post.category] = 0;
          }
          categoryMap[post.category]++;
        });

        const categoryList = [
          { name: "All", count: postsData.length },
          ...Object.entries(categoryMap).map(([name, count]) => ({
            name,
            count
          }))
        ];

        // Update state
        setPosts(postsData);
        setFeaturedPosts(featured);
        setRegularPosts(regular);
        setCategories(categoryList);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching posts:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                  key={post.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={fadeIn}
                  custom={index + 1}
                >
                  <Card href={`/journal/${post.slug}`} className="h-full flex flex-col">
                    <div className="relative h-64 w-full mb-4 rounded overflow-hidden">
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
                  </Card>
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
                    {categories.map((category, index) => (
                      <li key={category.name}>
                        <Link 
                          href={`/journal?category=${category.name === "All" ? "" : category.name}`}
                          className="flex justify-between items-center py-1 hover:text-accent"
                        >
                          <span>{category.name}</span>
                          <span className="text-sm bg-fg/10 text-fg/70 px-2 py-0.5 rounded-full">
                            {category.count}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>

                </CardContent>
              </Card>
            </motion.div>

            {/* Posts Grid */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularPosts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeIn}
                    custom={index + 1}
                  >
                    <Card href={`/journal/${post.slug}`} className="h-full flex flex-col">
                      <div className="relative h-48 w-full mb-4 rounded overflow-hidden">
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
                    </Card>
                  </motion.div>
                ))}
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

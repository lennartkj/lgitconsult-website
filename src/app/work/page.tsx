"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
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

// Filter categories
const categories = [
  { id: "all", name: "All Projects" },
  { id: "web", name: "Web Development" },
  { id: "mobile", name: "Mobile Apps" },
  { id: "design", name: "UI/UX Design" },
];

export default function WorkPage() {
  // State for projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Fetch all projects
        const response = await fetch('/api/content?type=projects');
        const data = await response.json();

        // Update state
        setProjects(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setLoading(false);
      }
    };

    fetchProjects();
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
                  variant={category.id === "all" ? "primary" : "outline"}
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
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                custom={index + 1}
              >
                <Card href={`/work/${project.slug}`} className="h-full flex flex-col">
                  <div className="relative h-48 w-full mb-4 rounded overflow-hidden">
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
                </Card>
              </motion.div>
            ))}
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

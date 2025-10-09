"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/Card";
import { Link } from "@/components/ui/Link";
import { Placeholder } from "@/components/ui/Placeholder";

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

export default function Home() {
  // State for projects and services
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch featured projects
        const projectsResponse = await fetch('/api/content?type=projects&featured=true');
        const projectsData = await projectsResponse.json();

        // Fetch services
        const servicesResponse = await fetch('/api/content?type=services');
        const servicesData = await servicesResponse.json();

        // Update state
        setProjects(projectsData.slice(0, 3)); // Limit to 3 projects
        setServices(servicesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
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
      {/* Hero Section */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={0}
              className="flex flex-col gap-6"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Transform Your Digital Presence
              </h1>
              <p className="text-lg md:text-xl text-fg/70 max-w-lg">
                We build modern, high-performance websites and applications that help businesses grow and succeed in the digital world.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button href="/contact" size="lg">
                  Get Started
                </Button>
                <Button href="/work" variant="outline" size="lg">
                  View Our Work
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden"
            >
              <div className="w-full h-full">
                <Image
                    src="/hero_image_1.png"
                    alt="Hero Image"
                    className="w-full h-full rounded-lg"
                    layout="fill"
                    objectFit="cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
            <p className="text-fg/70 max-w-2xl mx-auto">
              Take a look at some of our recent work that showcases our expertise and capabilities.
            </p>
          </motion.div>

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

          <div className="text-center mt-12">
            <Button href="/work" variant="outline">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Services</h2>
            <p className="text-fg/70 max-w-2xl mx-auto">
              We offer a wide range of services to help your business succeed in the digital world.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                custom={index + 1}
              >
                <Card className="h-full flex flex-col">
                  <CardHeader>
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <CardTitle>{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-fg/70">{service.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button href="/services" variant="outline">
              Learn More About Our Services
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent text-accent-contrast">
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
              <p className="text-accent-contrast/90 mb-8">
                Contact us today to discuss your project and how we can help you achieve your goals.
              </p>
              <Button 
                href="/contact" 
                className="bg-accent-contrast text-accent hover:bg-accent-contrast/90"
              >
                Get in Touch
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

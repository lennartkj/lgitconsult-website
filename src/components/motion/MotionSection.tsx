"use client"

import { motion } from "framer-motion";
import { ReactNode } from "react";

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

// Project Hero Section
export function ProjectHero({ 
  children, 
  custom = 0,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={custom}
      className={`flex flex-col gap-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Project Hero Image
export function ProjectHeroImage({ 
  children, 
  custom = 1,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      custom={custom}
      className={`relative h-[300px] md:h-[400px] rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Project Details
export function ProjectDetails({ 
  children, 
  custom = 0,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Project Sidebar
export function ProjectSidebar({ 
  children, 
  custom = 1,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Related Projects Header
export function RelatedProjectsHeader({ 
  children, 
  custom = 0,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      custom={custom}
      className={`text-center mb-12 ${className}`}
    >
      {children}
    </motion.div>
  );
}

// Related Project Card
export function RelatedProjectCard({ 
  children, 
  custom = 0,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// CTA Section
export function CTASection({ 
  children, 
  custom = 0,
  className = ""
}: { 
  children: ReactNode; 
  custom?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeIn}
      custom={custom}
      className={className}
    >
      {children}
    </motion.div>
  );
}
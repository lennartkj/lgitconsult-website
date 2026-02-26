"use client";

import { motion, type Variants, type Easing } from "framer-motion";
import { ReactNode } from "react";

// Animation variants (FIXED: Added Easing type assertion)
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut" as Easing, // FIX: Explizite Zuweisung des Easing-Typs
    },
  }),
};

// --- Interfaces (Generisch) ---

interface MotionWrapperProps {
  children: ReactNode;
  custom?: number;
  className?: string;
}

// --- Projekt Hero Section ---
export function ProjectHero({
                              children,
                              custom = 0,
                              className = ""
                            }: MotionWrapperProps) {
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

// --- Project Hero Image ---
export function ProjectHeroImage({
                                   children,
                                   custom = 1,
                                   className = ""
                                 }: MotionWrapperProps) {
  return (
      <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          custom={custom}
          className={`relative h-[300px] md:h-[400px] overflow-hidden ${className}`}
      >
        {children}
      </motion.div>
  );
}

// --- Project Details ---
export function ProjectDetails({
                                 children,
                                 custom = 0,
                                 className = ""
                               }: MotionWrapperProps) {
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

// --- Project Sidebar ---
export function ProjectSidebar({
                                 children,
                                 custom = 1,
                                 className = ""
                               }: MotionWrapperProps) {
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

// --- Related Projects Header ---
export function RelatedProjectsHeader({
                                        children,
                                        custom = 0,
                                        className = ""
                                      }: MotionWrapperProps) {
  return (
      <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeIn}
          custom={custom}
          className={`mb-12 ${className}`}
      >
        {children}
      </motion.div>
  );
}

// --- Related Project Card ---
export function RelatedProjectCard({
                                     children,
                                     custom = 0,
                                     className = ""
                                   }: MotionWrapperProps) {
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

// --- CTA Section ---
export function CTASection({
                             children,
                             custom = 0,
                             className = ""
                           }: MotionWrapperProps) {
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

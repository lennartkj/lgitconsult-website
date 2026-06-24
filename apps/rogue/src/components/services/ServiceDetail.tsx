"use client";

import React from "react";
import NextLink from "next/link";
import { motion, type Easing, type Variants } from "framer-motion";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";
import { Service } from "@repo/content/types";
import { Button } from "@repo/ui/ui/Button";

const fadeIn: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as Easing },
  }),
};

interface ServiceDetailProps {
  service: Service;
  mdxSource: MDXRemoteSerializeResult;
}

export default function ServiceDetail({ service, mdxSource }: ServiceDetailProps) {
  const backHref = service.pillar === "creative" ? "/creative" : "/services";

  return (
    <>
      {/* Hero */}
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
                Service · {service.icon}
              </span>
              <h1 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tighter leading-[0.95] mb-8">
                {service.title}
              </h1>
              <p className="text-base md:text-lg text-fg/50 leading-relaxed max-w-lg">
                {service.description}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Body + capabilities sidebar */}
      <section className="py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-12 gap-x-8 lg:gap-x-12">
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
              <div className="mt-12 pt-8 border-t border-fg/10">
                <Button href="/contact" variant="primary" size="lg">
                  {service.cta}
                </Button>
              </div>
            </motion.div>

            <motion.aside
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeIn}
              custom={1}
              className="col-span-12 lg:col-span-3 lg:col-start-9 mt-12 lg:mt-0"
            >
              <div className="lg:sticky lg:top-24">
                <span className="font-mono text-xs md:text-[11px] uppercase tracking-[0.2em] text-fg/40 block mb-6">
                  Capabilities
                </span>
                <ul className="border-t border-fg/10">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="py-3 border-b border-fg/10 text-sm text-fg/60 leading-relaxed"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
                <NextLink
                  href={backHref}
                  className="inline-block mt-8 font-mono text-[11px] uppercase tracking-[0.15em] text-fg/40 hover:text-fg transition-colors"
                >
                  ← All services
                </NextLink>
              </div>
            </motion.aside>
          </div>
        </div>
      </section>
    </>
  );
}

"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/forms/ContactForm";
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

export default function ContactPage() {
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
              Get in Touch
            </h1>
            <p className="text-lg text-fg/70">
              Have a project in mind or want to learn more about our services? Fill out the form below and we&apos;ll get back to you as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={1}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold mb-4">Contact Information</h2>
                <p className="text-fg/70 mb-6">
                  Feel free to reach out to us through any of the following channels:
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-accent text-xl">📍</div>
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-fg/70">123 Business Street, Suite 100, City, Country</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-accent text-xl">📧</div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-fg/70">info@lgitconsult.com</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-accent text-xl">📱</div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-fg/70">+1 (555) 123-4567</p>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Business Hours</h2>
                <ul className="space-y-2 text-fg/70">
                  <li className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Saturday:</span>
                    <span>10:00 AM - 2:00 PM</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Sunday:</span>
                    <span>Closed</span>
                  </li>
                </ul>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeIn}
              custom={2}
            >
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                  <ContactForm />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

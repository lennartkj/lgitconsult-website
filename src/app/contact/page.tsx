"use client";

import { Card, CardContent } from "@/components/ui/Card";
import { Placeholder } from "@/components/ui/Placeholder";


import { motion, easeOut } from "framer-motion";

// Then use it in your fadeIn object
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: easeOut,  // Using the imported easing function
    },
  }),
};

export default function ContactPage() {
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
              text="Get in Touch"
              pattern="random"
              randomColors={true}
              className="w-full rounded-lg shadow-md"
            />
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
                      <p className="text-fg/70">Mädler-Passage, Aufgang B Grimmaische Str. 2-4
                        04109 Leipzig</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-accent text-xl">📧</div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-fg/70">info@git-consult.group</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="text-accent text-xl">📱</div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-fg/70">+49 0179 126 7379</p>
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


          </div>
        </div>
      </section>
    </>
  );
}

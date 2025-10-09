"use client";

import { motion } from "framer-motion";

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

export default function PrivacyPolicyPage() {
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
              Privacy Policy
            </h1>
            <p className="text-lg text-fg/70">
              Last updated: November 15, 2024
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={1}
            className="max-w-3xl mx-auto prose prose-lg"
          >
            <h2>Introduction</h2>
            <p>
              LGIT Consult (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
            </p>
            <p>
              Please read this Privacy Policy carefully. If you do not agree with the terms of this Privacy Policy, please do not access the site.
            </p>

            <h2>Information We Collect</h2>
            <p>
              We may collect information about you in a variety of ways. The information we may collect includes:
            </p>
            <h3>Personal Data</h3>
            <p>
              While using our service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. This may include, but is not limited to:
            </p>
            <ul>
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Company name</li>
              <li>Job title</li>
            </ul>

            <h3>Usage Data</h3>
            <p>
              We may also collect information on how the service is accessed and used. This may include:
            </p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Pages visited</li>
              <li>Time and date of your visit</li>
              <li>Time spent on pages</li>
              <li>Unique device identifiers</li>
            </ul>

            <h2>How We Use Your Information</h2>
            <p>
              We may use the information we collect from you for various purposes, including to:
            </p>
            <ul>
              <li>Provide, operate, and maintain our website</li>
              <li>Improve, personalize, and expand our website</li>
              <li>Understand and analyze how you use our website</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>Communicate with you, either directly or through one of our partners, for customer service, updates, and other information relating to the website</li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              Our website uses only one strictly necessary cookie called "isPreviewMode". This cookie is essential for the proper functioning of our content management system's preview functionality and is only set when using the preview feature. This cookie does not track user activity or collect personal information.
            </p>
            <p>
              As this cookie is strictly necessary for the functioning of our website, it is exempt from the consent requirement under applicable data protection laws. The cookie is automatically removed when you exit the preview mode or expires after 24 hours.
            </p>

            <h2>Third-Party Services</h2>
            <p>
              We may employ third-party companies and individuals due to the following reasons:
            </p>
            <ul>
              <li>To facilitate our service</li>
              <li>To provide the service on our behalf</li>
              <li>To perform service-related services</li>
              <li>To assist us in analyzing how our service is used</li>
            </ul>
            <p>
              These third parties have access to your personal information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>

            <h2>Data Security</h2>
            <p>
              The security of your data is important to us, but remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
            </p>

            <h2>Your Data Protection Rights</h2>
            <p>
              Depending on your location, you may have certain rights regarding your personal information, such as:
            </p>
            <ul>
              <li>The right to access, update, or delete the information we have on you</li>
              <li>The right of rectification</li>
              <li>The right to object</li>
              <li>The right of restriction</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>

            <h2>Children&apos;s Privacy</h2>
            <p>
              Our service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children under 13. If you are a parent or guardian and you are aware that your child has provided us with personal data, please contact us.
            </p>

            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>

            <h2>Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul>
              <li>By email: privacy@lgitconsult.com</li>
              <li>By phone: +1 (555) 123-4567</li>
              <li>By mail: 123 Business Street, Suite 100, City, Country</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}

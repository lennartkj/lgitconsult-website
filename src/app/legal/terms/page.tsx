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

export default function TermsOfServicePage() {
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
              Terms of Service
            </h1>
            <p className="text-lg text-fg/70">
              Last updated: January 1, 2024
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
            <h2>1. Introduction</h2>
            <p>
              Welcome to LGIT Consult (&quot;Company&quot;, &quot;we&quot;, &quot;our&quot;, &quot;us&quot;). These Terms of Service (&quot;Terms&quot;, &quot;Terms of Service&quot;) govern your use of our website located at www.lgitconsult.com (the &quot;Service&quot;) operated by LGIT Consult.
            </p>
            <p>
              Our Privacy Policy also governs your use of our Service and explains how we collect, safeguard and disclose information that results from your use of our web pages. Please read it here: <a href="/legal/privacy">Privacy Policy</a>.
            </p>
            <p>
              Your agreement with us includes these Terms and our Privacy Policy (&quot;Agreements&quot;). You acknowledge that you have read and understood Agreements, and agree to be bound by them.
            </p>

            <h2>2. Communications</h2>
            <p>
              By using our Service, you agree to subscribe to newsletters, marketing or promotional materials and other information we may send. However, you may opt out of receiving any, or all, of these communications from us by following the unsubscribe link or instructions provided in any email we send.
            </p>

            <h2>3. Purchases</h2>
            <p>
              If you wish to purchase any product or service made available through the Service (&quot;Purchase&quot;), you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
            </p>
            <p>
              You represent and warrant that: (i) you have the legal right to use any credit card(s) or other payment method(s) in connection with any Purchase; and that (ii) the information you supply to us is true, correct and complete.
            </p>

            <h2>4. Content</h2>
            <p>
              Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material (&quot;Content&quot;). You are responsible for the Content that you post on or through the Service, including its legality, reliability, and appropriateness.
            </p>
            <p>
              We reserve the right to terminate the account of anyone found to be infringing on a copyright.
            </p>

            <h2>5. Prohibited Uses</h2>
            <p>
              You may use the Service only for lawful purposes and in accordance with Terms. You agree not to use the Service in any way that violates any applicable national or international law or regulation.
            </p>

            <h2>6. Termination</h2>
            <p>
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the country in which the Company is established, without regard to its conflict of law provisions.
            </p>

            <h2>8. Changes to Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will provide at least 30 days&apos; notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </p>

            <h2>9. Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us:
            </p>
            <ul>
              <li>By email: legal@lgitconsult.com</li>
              <li>By phone: +1 (555) 123-4567</li>
              <li>By mail: 123 Business Street, Suite 100, City, Country</li>
            </ul>
          </motion.div>
        </div>
      </section>
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Placeholder } from "@/components/ui/Placeholder";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

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

export default function ServicesPage() {
  // State for services, pricing tiers, and process steps
  const [services, setServices] = useState([]);
  const [pricingTiers, setPricingTiers] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services
        const servicesResponse = await fetch('/api/content?type=services');
        const servicesData = await servicesResponse.json();

        // Fetch pricing tiers
        const pricingResponse = await fetch('/api/content?type=pricing');
        const pricingData = await pricingResponse.json();

        // Fetch process steps
        const processResponse = await fetch('/api/content?type=process');
        const processData = await processResponse.json();

        // Update state
        setServices(servicesData);
        setPricingTiers(pricingData);
        setProcessSteps(processData);
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
              Our Services
            </h1>
            <p className="text-lg text-fg/70">
              We offer a comprehensive range of IT consulting and development services to help your business succeed in the digital world.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeIn}
                custom={index}
              >
                <Card className="h-full flex flex-col">
                  <CardContent className="p-8 flex-grow">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                    <p className="text-fg/70 mb-6">{service.description}</p>

                    <h3 className="text-lg font-semibold mb-3">What we offer:</h3>
                    <ul className="space-y-2 mb-6">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className="text-accent mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <Button href="/contact" variant="primary">
                        {service.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Our Process</h2>
            <p className="text-fg/70 max-w-2xl mx-auto">
              We follow a proven methodology to ensure your project is delivered on time, on budget, and exceeds your expectations.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={index + 1}
                className="relative"
              >
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-accent text-accent-contrast rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-fg/70">{step.description}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 text-2xl text-fg/30">
                    →
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
            custom={0}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Pricing Plans</h2>
            <p className="text-fg/70 max-w-2xl mx-auto">
              Transparent pricing options to fit businesses of all sizes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <motion.div
                key={tier.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeIn}
                custom={index + 1}
                className="relative"
              >
                <Card className={`h-full flex flex-col ${tier.popular ? 'border-accent shadow-lg' : ''}`}>
                  {tier.popular && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-contrast text-xs px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-8 flex-grow">
                    <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                    <p className="text-fg/70 mb-4">{tier.description}</p>
                    <div className="text-3xl font-bold mb-6">{tier.price}</div>

                    <ul className="space-y-3 mb-8">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-start">
                          <span className="text-accent mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto pt-4">
                      <Button 
                        href="/contact" 
                        variant={tier.popular ? "primary" : "outline"}
                        className="w-full"
                      >
                        {tier.cta}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-accent-contrast/90 mb-8">
                Contact us today to discuss your project and how we can help you achieve your goals.
              </p>
              <Button 
                href="/contact" 
                className="bg-accent-contrast text-accent hover:bg-accent-contrast/90"
              >
                Schedule a Consultation
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}

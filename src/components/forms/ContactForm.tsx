"use client";

import { useState } from "react";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

// Define the form schema with Zod
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  // Form state
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    message: "",
  });

  // Form submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form data
    try {
      contactFormSchema.parse(formData);
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
        return;
      }
    }

    // Submit form if validation passes
    setIsSubmitting(true);

    try {
      // Call the API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from the API
        if (data.errors) {
          const apiErrors: Record<string, string> = {};

          // Convert API errors to our format
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              apiErrors[field] = messages[0];
            }
          });

          setErrors(apiErrors);
          return;
        }

        throw new Error(data.message || 'Something went wrong');
      }

      // Show success state
      setIsSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors({ 
        form: error instanceof Error 
          ? error.message 
          : "There was an error submitting the form. Please try again." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success message
  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
      >
        <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent!</h3>
        <p className="text-green-700 mb-4">
          Thank you for contacting us. We&apos;ll get back to you as soon as possible.
        </p>
        <Button
          onClick={() => setIsSubmitted(false)}
          variant="outline"
        >
          Send Another Message
        </Button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
            errors.name ? "border-red-500" : "border-fg/20"
          }`}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
            errors.email ? "border-red-500" : "border-fg/20"
          }`}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={formData.message}
          onChange={handleChange}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-accent ${
            errors.message ? "border-red-500" : "border-fg/20"
          }`}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-red-600">{errors.message}</p>
        )}
      </div>

      {errors.form && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-sm text-red-600">{errors.form}</p>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

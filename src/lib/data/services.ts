// This file centralizes all service data used throughout the website
// to avoid duplication and ensure consistency
import { getAllServices as getServices, getAllPricingTiers as getPricingTiers, getAllProcessSteps as getProcessSteps } from '../content';

// Service interface
export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  features: string[];
  cta: string;
}

// Pricing tier interface
export interface PricingTier {
  id: number;
  name: string;
  description: string;
  price: string;
  features: string[];
  cta: string;
  popular: boolean;
}

// Process step interface
export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

// Cache for data
let servicesCache: Service[] = [];
let pricingTiersCache: PricingTier[] = [];
let processStepsCache: ProcessStep[] = [];

// For client-side rendering, we need to provide synchronous versions
// that return the cached data or fallback to static data
export const services: Service[] = servicesCache.length > 0 ? servicesCache : [
  {
    id: 1,
    title: "Web Development",
    description: "Custom websites and web applications built with modern technologies.",
    icon: "💻",
    features: [
      "Responsive design for all devices",
      "Performance optimization",
      "SEO-friendly architecture",
      "Content management systems",
      "E-commerce solutions",
      "Progressive Web Apps (PWAs)"
    ],
    cta: "Start Your Web Project",
  },
  {
    id: 2,
    title: "Mobile Development",
    description: "Native and cross-platform mobile applications for iOS and Android.",
    icon: "📱",
    features: [
      "iOS and Android development",
      "Cross-platform solutions",
      "UI/UX design for mobile",
      "App Store optimization",
      "Push notifications",
      "Offline functionality"
    ],
    cta: "Build Your Mobile App",
  },
  {
    id: 3,
    title: "UI/UX Design",
    description: "User-centered design that enhances user experience and engagement.",
    icon: "🎨",
    features: [
      "User research and personas",
      "Wireframing and prototyping",
      "Visual design and branding",
      "Usability testing",
      "Interaction design",
      "Design systems"
    ],
    cta: "Enhance Your User Experience",
  },
  {
    id: 4,
    title: "IT Consulting",
    description: "Strategic technology consulting to help your business grow.",
    icon: "🔍",
    features: [
      "Technology strategy",
      "Digital transformation",
      "System architecture",
      "Cloud migration",
      "Security audits",
      "Performance optimization"
    ],
    cta: "Get Expert Advice",
  },
];

// Pricing tiers data
export const pricingTiers: PricingTier[] = pricingTiersCache.length > 0 ? pricingTiersCache : [
  {
    id: 1,
    name: "Basic",
    description: "For small businesses and startups",
    price: "$1,999",
    features: [
      "Custom website design",
      "Mobile responsive",
      "Content management system",
      "Basic SEO setup",
      "Contact form",
      "3 months of support"
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    id: 2,
    name: "Professional",
    description: "For growing businesses",
    price: "$4,999",
    features: [
      "Everything in Basic",
      "E-commerce functionality",
      "User authentication",
      "Advanced SEO optimization",
      "Performance optimization",
      "6 months of support"
    ],
    cta: "Choose Professional",
    popular: true,
  },
  {
    id: 3,
    name: "Enterprise",
    description: "For large organizations",
    price: "Custom",
    features: [
      "Everything in Professional",
      "Custom integrations",
      "Advanced analytics",
      "High-performance architecture",
      "Security audits",
      "12 months of priority support"
    ],
    cta: "Contact Us",
    popular: false,
  },
];

// Process steps data
export const processSteps: ProcessStep[] = processStepsCache.length > 0 ? processStepsCache : [
  { 
    step: 1, 
    title: "Discovery", 
    description: "We learn about your business, goals, and requirements." 
  },
  { 
    step: 2, 
    title: "Planning", 
    description: "We create a detailed roadmap and technical specifications." 
  },
  { 
    step: 3, 
    title: "Development", 
    description: "Our team builds your solution with regular updates and feedback." 
  },
  { 
    step: 4, 
    title: "Launch & Support", 
    description: "We deploy your solution and provide ongoing maintenance." 
  },
];

// Helper function to get all services
export const getAllServices = async (): Promise<Service[]> => {
  try {
    // Use the content library to get all services
    const allServices = await getServices();

    // Cache the services
    servicesCache = allServices;

    return allServices;
  } catch (error) {
    console.error('Error fetching services:', error);
    // Fallback to local data
    return services;
  }
};

// Helper function to get all pricing tiers
export const getAllPricingTiers = async (): Promise<PricingTier[]> => {
  try {
    // Use the content library to get all pricing tiers
    const allPricingTiers = await getPricingTiers();

    // Cache the pricing tiers
    pricingTiersCache = allPricingTiers;

    return allPricingTiers;
  } catch (error) {
    console.error('Error fetching pricing tiers:', error);
    // Fallback to local data
    return pricingTiers;
  }
};

// Helper function to get all process steps
export const getAllProcessSteps = async (): Promise<ProcessStep[]> => {
  try {
    // Use the content library to get all process steps
    const allProcessSteps = await getProcessSteps();

    // Cache the process steps
    processStepsCache = allProcessSteps;

    return allProcessSteps;
  } catch (error) {
    console.error('Error fetching process steps:', error);
    // Fallback to local data
    return processSteps;
  }
};

// Helper function to get a service by ID
export const getServiceById = async (id: number): Promise<Service | undefined> => {
  try {
    // Get all services and find the one with the matching ID
    const allServices = await getAllServices();
    return allServices.find(service => service.id === id);
  } catch (error) {
    console.error(`Error fetching service with ID ${id}:`, error);
    // Fallback to local data
    return services.find(service => service.id === id);
  }
};

// Helper function to get a pricing tier by ID
export const getPricingTierById = async (id: number): Promise<PricingTier | undefined> => {
  try {
    // Get all pricing tiers and find the one with the matching ID
    const allPricingTiers = await getAllPricingTiers();
    return allPricingTiers.find(tier => tier.id === id);
  } catch (error) {
    console.error(`Error fetching pricing tier with ID ${id}:`, error);
    // Fallback to local data
    return pricingTiers.find(tier => tier.id === id);
  }
};

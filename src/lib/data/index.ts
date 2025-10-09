// This file serves as a unified data layer for the entire website.
// All components should import data access functions from here.

// Re-export Project-related functions and types
export {
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getRelatedProjects,
} from './projects';
export type { Project } from './types';

// Re-export Post-related functions and types
export {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getRelatedPosts,
  getCategories,
    getPostsByCategory,
} from './posts';
export type { Post, Category } from './types';

// Re-export Service/Pricing/Process-related functions and types
export {
  getAllServices,
  getServiceById,
  getAllPricingTiers,
  getPricingTierById,
  getAllProcessSteps,
} from './services';
export type { Service, PricingTier, ProcessStep } from './types';
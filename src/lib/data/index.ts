// This file centralizes all data access functions for the website
// It re-exports functions from the unified content library

import {
  // Projects
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getRelatedProjects,
  
  // Posts
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getRelatedPosts,
  getPostsByCategory,
  
  // Services
  getAllServices,
  getServiceById,
  
  // Pricing
  getAllPricingTiers,
  getPricingTierById,
  
  // Process
  getAllProcessSteps,
  
  // Generic content functions
  getContentByType,
  getContentBySlug,
  ContentType,
  ContentOptions
} from '../content';

// Re-export all functions
export {
  // Projects
  getAllProjects,
  getFeaturedProjects,
  getProjectBySlug,
  getRelatedProjects,
  
  // Posts
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
  getRelatedPosts,
  getPostsByCategory,
  
  // Services
  getAllServices,
  getServiceById,
  
  // Pricing
  getAllPricingTiers,
  getPricingTierById,
  
  // Process
  getAllProcessSteps,
  
  // Generic content functions
  getContentByType,
  getContentBySlug,
  ContentType,
  ContentOptions
};

// Export types from the existing data files
export { Project } from './projects';
export { Post } from './posts';
export { Service, PricingTier, ProcessStep } from './services';
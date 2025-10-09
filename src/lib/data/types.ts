// src/lib/data/types.ts

// Projects
export interface Project {
    id: number;
    title: string;
    description: string;
    fullDescription?: string;
    challenge?: string;
    solution?: string;
    results?: string;
    image: string;
    tags: string[];
    slug: string;
    client?: string;
    year?: string;
    services?: string[];
    website?: string;
    featured: boolean;
}

// Posts
export interface Post {
    id: number;
    title: string;
    excerpt: string;
    content?: string;
    date: string;
    author: string;
    authorBio?: string;
    authorImage?: string;
    category: string;
    tags: string[];
    slug: string;
    featured: boolean;
}

export interface Category {
    name: string;
    count: number;
}

// Services
export interface Service {
    id: number;
    title: string;
    description: string;
    icon: string;
    features: string[];
    cta: string;
}

// Pricing
export interface PricingTier {
    id: number;
    name: string;
    description: string;
    price: string;
    features: string[];
    cta: string;
    popular: boolean;
}

// Process
export interface ProcessStep {
    step: number;
    title: string;
    description: string;
}
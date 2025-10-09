// This file centralizes all blog post data used throughout the website
// to avoid duplication and ensure consistency
import { getAllPosts as getPosts } from '../content';

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

// Cache for posts
let postsCache: Post[] = [];

// For client-side rendering, we need to provide a synchronous version
// that returns the cached data or empty array
export const posts: Post[] = postsCache.length > 0 ? postsCache : [
  {
    id: 1,
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt: "Explore the emerging technologies and methodologies that will shape web development in the coming year.",
    content: `
      <p>The web development landscape is constantly evolving, with new technologies, frameworks, and methodologies emerging at a rapid pace. As we look ahead to 2024, several key trends are poised to shape the future of web development.</p>

      <h2>1. AI-Powered Development Tools</h2>
      <p>Artificial intelligence is revolutionizing how developers work. From code completion to automated testing, AI tools are enhancing productivity and code quality. In 2024, we expect to see more sophisticated AI assistants that can generate entire components or suggest architectural improvements based on best practices.</p>

      <h2>2. WebAssembly Goes Mainstream</h2>
      <p>WebAssembly (Wasm) has been gaining traction, allowing developers to run high-performance code in the browser. In 2024, we anticipate more frameworks and tools that leverage Wasm, enabling more complex applications to run efficiently in browsers.</p>

      <h2>3. Edge Computing Expands</h2>
      <p>The edge computing paradigm is transforming how web applications are deployed and served. By running code closer to users, edge functions reduce latency and improve performance. Frameworks like Next.js are already embracing this approach, and we expect this trend to accelerate in 2024.</p>

      <h2>4. Sustainability in Web Development</h2>
      <p>As awareness of digital carbon footprints grows, sustainable web development practices are becoming more important. In 2024, we'll see more tools and methodologies focused on creating energy-efficient websites and applications.</p>

      <h2>5. Continued Evolution of No-Code/Low-Code</h2>
      <p>No-code and low-code platforms will continue to evolve, making web development more accessible to non-developers while providing professional developers with tools to accelerate routine tasks.</p>

      <h2>Conclusion</h2>
      <p>The web development field remains dynamic and exciting. By staying informed about these trends and embracing new technologies thoughtfully, developers can create better, more efficient, and more accessible web experiences for users worldwide.</p>
    `,
    date: "January 15, 2024",
    author: "Jane Doe",
    authorBio: "Jane is a senior web developer with over 10 years of experience in building modern web applications.",
    authorImage: "/jane-doe.jpg",
    category: "Web Development",
    tags: ["Next.js", "React", "Web Trends"],
    slug: "future-web-development-trends-2024",
    featured: true,
  },
  {
    id: 2,
    title: "How to Optimize Your Website for Core Web Vitals",
    excerpt: "A comprehensive guide to improving your site's performance metrics and boosting your search rankings.",
    content: `
      <p>Core Web Vitals have become crucial metrics for website performance and user experience. In this guide, we'll explore practical strategies to optimize your website for these important metrics.</p>

      <h2>Understanding Core Web Vitals</h2>
      <p>Core Web Vitals consist of three main metrics:</p>
      <ul>
        <li><strong>Largest Contentful Paint (LCP)</strong>: Measures loading performance. To provide a good user experience, LCP should occur within 2.5 seconds of when the page first starts loading.</li>
        <li><strong>First Input Delay (FID)</strong>: Measures interactivity. Pages should have a FID of less than 100 milliseconds.</li>
        <li><strong>Cumulative Layout Shift (CLS)</strong>: Measures visual stability. Pages should maintain a CLS of less than 0.1.</li>
      </ul>

      <h2>Optimizing LCP</h2>
      <p>To improve LCP, focus on the following:</p>
      <ul>
        <li>Optimize server response times</li>
        <li>Implement efficient caching policies</li>
        <li>Optimize and compress images</li>
        <li>Minimize render-blocking resources</li>
        <li>Use content delivery networks (CDNs)</li>
      </ul>

      <h2>Improving FID</h2>
      <p>To enhance interactivity, consider these strategies:</p>
      <ul>
        <li>Break up long tasks into smaller ones</li>
        <li>Optimize JavaScript execution</li>
        <li>Implement code splitting</li>
        <li>Use web workers for complex calculations</li>
        <li>Minimize main thread work</li>
      </ul>

      <h2>Reducing CLS</h2>
      <p>To minimize layout shifts, implement these practices:</p>
      <ul>
        <li>Always include size attributes on images and videos</li>
        <li>Reserve space for ads and embeds</li>
        <li>Avoid inserting content above existing content</li>
        <li>Use transform animations instead of animations that trigger layout changes</li>
        <li>Preload critical fonts</li>
      </ul>

      <h2>Measuring and Monitoring</h2>
      <p>Use tools like Lighthouse, PageSpeed Insights, and Chrome User Experience Report to measure and monitor your Core Web Vitals. Implement continuous monitoring to catch regressions early.</p>

      <h2>Conclusion</h2>
      <p>Optimizing for Core Web Vitals not only improves search rankings but also enhances user experience. By focusing on these metrics, you can create faster, more responsive, and more stable websites that users will love.</p>
    `,
    date: "December 10, 2023",
    author: "John Smith",
    authorBio: "John specializes in web performance optimization and has helped numerous companies improve their Core Web Vitals scores.",
    authorImage: "/john-smith.jpg",
    category: "Performance",
    tags: ["SEO", "Performance", "Core Web Vitals"],
    slug: "optimize-website-core-web-vitals",
    featured: true,
  },
  {
    id: 3,
    title: "Building Accessible Web Applications: A Complete Guide",
    excerpt: "Learn how to create inclusive web experiences that work for everyone, regardless of ability.",
    content: `
      <p>Web accessibility is not just a nice-to-have feature—it's a necessity. This guide covers the essential principles and practices for building accessible web applications.</p>

      <h2>Why Accessibility Matters</h2>
      <p>Accessibility ensures that people with disabilities can perceive, understand, navigate, and interact with websites and tools. It also benefits users without disabilities, such as those using mobile devices or those with temporary limitations.</p>

      <h2>Key Accessibility Guidelines</h2>
      <p>The Web Content Accessibility Guidelines (WCAG) provide a framework for accessibility. The main principles are:</p>
      <ul>
        <li><strong>Perceivable</strong>: Information must be presentable to users in ways they can perceive.</li>
        <li><strong>Operable</strong>: User interface components must be operable by all users.</li>
        <li><strong>Understandable</strong>: Information and operation must be understandable.</li>
        <li><strong>Robust</strong>: Content must be robust enough to be interpreted by a wide variety of user agents.</li>
      </ul>

      <h2>Practical Implementation Tips</h2>
      <p>Here are some practical ways to improve accessibility:</p>
      <ul>
        <li>Use semantic HTML elements</li>
        <li>Provide alternative text for images</li>
        <li>Ensure keyboard navigation works properly</li>
        <li>Maintain sufficient color contrast</li>
        <li>Use ARIA attributes when necessary</li>
        <li>Create a logical tab order</li>
        <li>Make forms accessible with proper labels</li>
      </ul>

      <h2>Testing for Accessibility</h2>
      <p>Regular testing is crucial. Use a combination of automated tools (like Lighthouse or axe) and manual testing. Include testing with screen readers and keyboard-only navigation.</p>

      <h2>Conclusion</h2>
      <p>Building accessible web applications is not just about compliance—it's about creating inclusive experiences that work for everyone. By following these guidelines and practices, you can ensure your web applications are accessible to all users.</p>
    `,
    date: "November 28, 2023",
    author: "Emily Johnson",
    authorBio: "Emily is an accessibility specialist who advocates for inclusive design practices in web development.",
    authorImage: "/emily-johnson.jpg",
    category: "Accessibility",
    tags: ["Accessibility", "WCAG", "Inclusive Design"],
    slug: "building-accessible-web-applications",
    featured: false,
  },
  {
    id: 4,
    title: "The Rise of Headless CMS: Benefits and Implementation",
    excerpt: "Discover why headless content management systems are becoming the preferred choice for modern websites.",
    content: `
      <p>Headless CMS architecture is revolutionizing how we build and manage websites. This article explores the benefits and implementation strategies of headless CMS solutions.</p>

      <h2>What is a Headless CMS?</h2>
      <p>A headless CMS is a back-end only content management system that acts as a content repository, making content accessible via an API for display on any device. Unlike traditional CMS platforms, a headless CMS doesn't care about how and where your content gets displayed.</p>

      <h2>Benefits of Headless CMS</h2>
      <ul>
        <li><strong>Flexibility</strong>: Content can be used across multiple platforms and devices.</li>
        <li><strong>Future-proof</strong>: As new channels emerge, your content can be adapted without restructuring.</li>
        <li><strong>Performance</strong>: Websites built with headless architecture are typically faster and more secure.</li>
        <li><strong>Developer experience</strong>: Developers can use their preferred tools and frameworks.</li>
        <li><strong>Scalability</strong>: Easier to scale as your content and traffic grow.</li>
      </ul>

      <h2>Popular Headless CMS Options</h2>
      <p>Several headless CMS platforms have gained popularity:</p>
      <ul>
        <li>Contentful</li>
        <li>Sanity.io</li>
        <li>Strapi</li>
        <li>Prismic</li>
        <li>Headless WordPress</li>
      </ul>

      <h2>Implementation Strategies</h2>
      <p>When implementing a headless CMS, consider these strategies:</p>
      <ul>
        <li>Define your content model carefully</li>
        <li>Plan your API usage and caching strategy</li>
        <li>Choose the right front-end framework (Next.js, Gatsby, etc.)</li>
        <li>Set up proper preview environments for content editors</li>
        <li>Implement a robust deployment pipeline</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Headless CMS architecture offers significant advantages for modern web development. By separating content from presentation, organizations can create more flexible, performant, and future-proof digital experiences.</p>
    `,
    date: "November 15, 2023",
    author: "Michael Brown",
    authorBio: "Michael is a full-stack developer specializing in modern CMS implementations and JAMstack architecture.",
    authorImage: "/michael-brown.jpg",
    category: "CMS",
    tags: ["Headless CMS", "Content Management", "JAMstack"],
    slug: "rise-of-headless-cms",
    featured: false,
  },
  {
    id: 5,
    title: "Securing Your Web Application: Best Practices",
    excerpt: "Essential security measures every web developer should implement to protect user data and prevent breaches.",
    content: `
      <p>Web application security is more important than ever. This guide covers essential security practices to protect your applications and user data.</p>

      <h2>Common Security Vulnerabilities</h2>
      <p>Understanding common vulnerabilities is the first step in prevention:</p>
      <ul>
        <li>Cross-Site Scripting (XSS)</li>
        <li>SQL Injection</li>
        <li>Cross-Site Request Forgery (CSRF)</li>
        <li>Broken Authentication</li>
        <li>Security Misconfigurations</li>
        <li>Sensitive Data Exposure</li>
      </ul>

      <h2>Authentication and Authorization</h2>
      <p>Implement robust authentication and authorization:</p>
      <ul>
        <li>Use strong password policies</li>
        <li>Implement multi-factor authentication</li>
        <li>Use secure session management</li>
        <li>Apply the principle of least privilege</li>
        <li>Consider OAuth 2.0 and OpenID Connect for authentication</li>
      </ul>

      <h2>Data Protection</h2>
      <p>Protect sensitive data with these measures:</p>
      <ul>
        <li>Always use HTTPS</li>
        <li>Encrypt sensitive data at rest</li>
        <li>Implement proper key management</li>
        <li>Be careful with data in logs and error messages</li>
        <li>Apply data minimization principles</li>
      </ul>

      <h2>Input Validation and Output Encoding</h2>
      <p>Never trust user input:</p>
      <ul>
        <li>Validate all input on the server side</li>
        <li>Use parameterized queries for database operations</li>
        <li>Encode output to prevent XSS</li>
        <li>Use Content Security Policy (CSP)</li>
      </ul>

      <h2>Security Headers and Configurations</h2>
      <p>Implement these security headers and configurations:</p>
      <ul>
        <li>Content-Security-Policy</li>
        <li>X-Content-Type-Options</li>
        <li>X-Frame-Options</li>
        <li>Strict-Transport-Security</li>
        <li>Keep software and dependencies updated</li>
      </ul>

      <h2>Conclusion</h2>
      <p>Security is an ongoing process, not a one-time implementation. Regular security audits, penetration testing, and staying informed about new vulnerabilities are essential practices for maintaining secure web applications.</p>
    `,
    date: "October 22, 2023",
    author: "Sarah Wilson",
    authorBio: "Sarah is a cybersecurity expert specializing in web application security and compliance.",
    authorImage: "/sarah-wilson.jpg",
    category: "Security",
    tags: ["Cybersecurity", "Web Security", "HTTPS"],
    slug: "securing-web-application-best-practices",
    featured: false,
  },
  {
    id: 6,
    title: "The Impact of AI on Web Development",
    excerpt: "How artificial intelligence is changing the way we build and interact with websites and applications.",
    content: `
      <p>Artificial intelligence is transforming web development in numerous ways. This article explores the current and future impact of AI on how we build and interact with web applications.</p>

      <h2>AI-Powered Development Tools</h2>
      <p>AI is enhancing developer productivity through:</p>
      <ul>
        <li>Intelligent code completion and suggestions</li>
        <li>Automated code review and bug detection</li>
        <li>UI generation from design mockups</li>
        <li>Natural language to code conversion</li>
        <li>Automated testing and quality assurance</li>
      </ul>

      <h2>Personalization and User Experience</h2>
      <p>AI enables more personalized web experiences:</p>
      <ul>
        <li>Content recommendations based on user behavior</li>
        <li>Dynamic UI adjustments for individual users</li>
        <li>Predictive analytics for anticipating user needs</li>
        <li>Chatbots and virtual assistants for customer support</li>
      </ul>

      <h2>Accessibility Improvements</h2>
      <p>AI is making the web more accessible:</p>
      <ul>
        <li>Automated alt text generation for images</li>
        <li>Real-time captioning and transcription</li>
        <li>Voice navigation and control</li>
        <li>Readability enhancements for different user needs</li>
      </ul>

      <h2>Performance Optimization</h2>
      <p>AI helps optimize web performance:</p>
      <ul>
        <li>Predictive loading of content</li>
        <li>Automated image and asset optimization</li>
        <li>Smart caching strategies</li>
        <li>Server resource allocation based on usage patterns</li>
      </ul>

      <h2>Challenges and Ethical Considerations</h2>
      <p>The rise of AI in web development also brings challenges:</p>
      <ul>
        <li>Privacy concerns with data collection for AI training</li>
        <li>Potential for algorithmic bias</li>
        <li>Accessibility of AI tools across the industry</li>
        <li>Balancing automation with human creativity and oversight</li>
      </ul>

      <h2>Conclusion</h2>
      <p>AI is not replacing web developers but rather augmenting their capabilities. By embracing AI tools and techniques, developers can create more intelligent, personalized, and accessible web experiences while focusing their human creativity on solving complex problems.</p>
    `,
    date: "October 5, 2023",
    author: "David Lee",
    authorBio: "David is a technology researcher and consultant focusing on the intersection of AI and web technologies.",
    authorImage: "/david-lee.jpg",
    category: "Technology",
    tags: ["AI", "Machine Learning", "Automation"],
    slug: "impact-ai-web-development",
    featured: false,
  },
];

// Interface for category
export interface Category {
  name: string;
  count: number;
}

// Function to get categories from posts
export const getCategories = async (): Promise<Category[]> => {
  try {
    // Get all posts
    const allPosts = await getAllPosts();

    // Count posts by category
    const categoryCounts: Record<string, number> = {};
    allPosts.forEach(post => {
      if (!categoryCounts[post.category]) {
        categoryCounts[post.category] = 0;
      }
      categoryCounts[post.category]++;
    });

    // Create categories array
    const categories: Category[] = [
      { name: "All", count: allPosts.length },
      ...Object.entries(categoryCounts).map(([name, count]) => ({
        name,
        count
      }))
    ];

    return categories;
  } catch (error) {
    console.error('Error generating categories:', error);
    // Fallback to local data
    return [
      { name: "All", count: posts.length },
      { name: "Web Development", count: posts.filter(post => post.category === "Web Development").length },
      { name: "Performance", count: posts.filter(post => post.category === "Performance").length },
      { name: "Accessibility", count: posts.filter(post => post.category === "Accessibility").length },
      { name: "Security", count: posts.filter(post => post.category === "Security").length },
      { name: "Technology", count: posts.filter(post => post.category === "Technology").length },
      { name: "CMS", count: posts.filter(post => post.category === "CMS").length },
    ];
  }
};

// For client-side rendering, we need a synchronous version
// This will be replaced with data from MDX files when available
export const categories: Category[] = [
  { name: "All", count: posts.length },
  { name: "Web Development", count: posts.filter(post => post.category === "Web Development").length },
  { name: "Performance", count: posts.filter(post => post.category === "Performance").length },
  { name: "Accessibility", count: posts.filter(post => post.category === "Accessibility").length },
  { name: "Security", count: posts.filter(post => post.category === "Security").length },
  { name: "Technology", count: posts.filter(post => post.category === "Technology").length },
  { name: "CMS", count: posts.filter(post => post.category === "CMS").length },
];

// Helper function to get all posts
export const getAllPosts = async (): Promise<Post[]> => {
  try {
    // Use the content library to get all posts
    const allPosts = await getPosts();

    // Cache the posts
    postsCache = allPosts;

    return allPosts;
  } catch (error) {
    console.error('Error fetching posts:', error);
    // Fallback to local data
    return posts;
  }
};

// Helper function to get featured posts
export const getFeaturedPosts = async (): Promise<Post[]> => {
  try {
    // Get all posts and filter for featured ones
    const allPosts = await getAllPosts();
    return allPosts.filter(post => post.featured);
  } catch (error) {
    console.error('Error fetching featured posts:', error);
    // Fallback to local data
    return posts.filter(post => post.featured);
  }
};

// Helper function to get a post by slug
export const getPostBySlug = async (slug: string): Promise<Post | undefined> => {
  try {
    // Get all posts and find the one with the matching slug
    const allPosts = await getAllPosts();
    return allPosts.find(post => post.slug === slug);
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error);
    // Fallback to local data
    return posts.find(post => post.slug === slug);
  }
};

// Helper function to get related posts (same category, excluding the current post)
export const getRelatedPosts = async (currentSlug: string, limit: number = 3): Promise<Post[]> => {
  try {
    const currentPost = await getPostBySlug(currentSlug);

    if (!currentPost) {
      return [];
    }

    // Get all posts
    const allPosts = await getAllPosts();

    // Filter for posts in the same category, excluding the current post
    return allPosts
      .filter(post => 
        post.slug !== currentSlug && 
        post.category === currentPost.category
      )
      .slice(0, limit);
  } catch (error) {
    console.error(`Error fetching related posts for ${currentSlug}:`, error);
    // Fallback to local data
    const currentPost = posts.find(post => post.slug === currentSlug);
    if (!currentPost) {
      return [];
    }
    return posts
      .filter(post => 
        post.slug !== currentSlug && 
        post.category === currentPost.category
      )
      .slice(0, limit);
  }
};

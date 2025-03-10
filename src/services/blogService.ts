
import { BlogPost } from "@/types/blog";

// Initialize with existing blog posts
let blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "The Future of Workflow Automation: How AI is Transforming Business Operations",
    slug: "future-workflow-automation",
    excerpt: "Discover how artificial intelligence is revolutionizing workflow automation and creating more efficient business processes across industries.",
    content: "Artificial intelligence is rapidly transforming how businesses operate, particularly in the realm of workflow automation. From simple task automation to complex decision-making processes, AI is helping companies reduce manual work, minimize errors, and accelerate operations...",
    category: "Automation",
    tags: ["AI", "Automation", "Business"],
    author: "Maria Rodriguez",
    date: "May 15, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: "2",
    title: "Implementing Conversational AI: Best Practices for Customer Service",
    slug: "implementing-conversational-ai",
    excerpt: "Learn how to effectively implement conversational AI to enhance customer service experiences and increase satisfaction rates.",
    content: "Conversational AI has become a cornerstone of modern customer service strategies. When implemented correctly, these intelligent systems can provide 24/7 support, reduce wait times, and deliver consistent service quality...",
    category: "AI",
    tags: ["AI", "Customer Service", "Technology"],
    author: "James Chen",
    date: "April 3, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    id: "3",
    title: "Ethical Considerations in Business Process Automation",
    slug: "ethical-considerations-automation",
    excerpt: "Explore the ethical dimensions of implementing automation technologies in the workplace and strategies for responsible innovation.",
    content: "As businesses increasingly adopt automation technologies, important ethical questions arise about impacts on employment, privacy, security, and social responsibility...",
    category: "Automation",
    tags: ["Ethics", "Automation", "Business"],
    author: "Sarah Johnson",
    date: "March 21, 2023",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    id: "4",
    title: "How Small Businesses Can Leverage AI Without Breaking the Bank",
    slug: "small-business-ai-solutions",
    excerpt: "Practical approaches for small businesses to implement AI solutions with limited resources while maximizing ROI.",
    content: "Artificial intelligence isn't just for tech giants and enterprises with massive IT budgets. Today, small businesses can access powerful AI tools through affordable SaaS platforms, APIs, and open-source solutions...",
    category: "AI",
    tags: ["AI", "Small Business", "ROI"],
    author: "David Park",
    date: "February 12, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    id: "5",
    title: "The Integration of AI and RPA: Creating Intelligent Automation",
    slug: "ai-rpa-integration",
    excerpt: "Understanding how the combination of AI and Robotic Process Automation is creating a new paradigm of intelligent automation solutions.",
    content: "The convergence of Artificial Intelligence and Robotic Process Automation represents one of the most significant developments in business technology in recent years. While RPA excels at rule-based, repetitive tasks, AI brings cognitive capabilities that can handle exceptions and make judgments...",
    category: "Automation",
    tags: ["AI", "RPA", "Intelligent Automation"],
    author: "Michael Thompson",
    date: "January 30, 2023",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: true
  }
];

// Initialize from localStorage if available
const init = () => {
  const savedPosts = localStorage.getItem("blogPosts");
  if (savedPosts) {
    try {
      blogPosts = JSON.parse(savedPosts);
    } catch (e) {
      console.error("Failed to parse saved blog posts", e);
    }
  } else {
    // If no posts in localStorage, save the default ones
    localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  }
};

// Run initialization
init();

export const getBlogPosts = (): BlogPost[] => {
  return [...blogPosts];
};

export const getBlogPostById = (id: string): BlogPost | undefined => {
  return blogPosts.find(post => post.id === id);
};

export const createBlogPost = (post: Omit<BlogPost, "id">): BlogPost => {
  // Find the highest current ID and increment by 1
  const currentIds = blogPosts.map(p => parseInt(p.id));
  const newIdNumber = Math.max(0, ...currentIds) + 1;
  const newId = newIdNumber.toString();
  
  const newPost: BlogPost = {
    ...post,
    id: newId
  };
  
  blogPosts = [...blogPosts, newPost];
  
  // Save to localStorage for persistence
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  
  return newPost;
};

export const updateBlogPost = (post: BlogPost): BlogPost => {
  blogPosts = blogPosts.map(p => p.id === post.id ? post : p);
  
  // Save to localStorage for persistence
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  
  return post;
};

export const deleteBlogPost = (id: string): boolean => {
  const initialLength = blogPosts.length;
  blogPosts = blogPosts.filter(p => p.id !== id);
  
  // Save to localStorage for persistence
  localStorage.setItem("blogPosts", JSON.stringify(blogPosts));
  
  return initialLength > blogPosts.length;
};

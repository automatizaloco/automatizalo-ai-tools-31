
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";

// Blog posts data
const blogPosts = [
  {
    id: 1,
    title: "The Future of Workflow Automation: How AI is Transforming Business Operations",
    excerpt: "Discover how artificial intelligence is revolutionizing workflow automation and creating more efficient business processes across industries.",
    content: "Artificial intelligence is rapidly transforming how businesses operate, particularly in the realm of workflow automation. From simple task automation to complex decision-making processes, AI is helping companies reduce manual work, minimize errors, and accelerate operations...",
    category: "Automation",
    author: "Maria Rodriguez",
    date: "May 15, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: true
  },
  {
    id: 2,
    title: "Implementing Conversational AI: Best Practices for Customer Service",
    excerpt: "Learn how to effectively implement conversational AI to enhance customer service experiences and increase satisfaction rates.",
    content: "Conversational AI has become a cornerstone of modern customer service strategies. When implemented correctly, these intelligent systems can provide 24/7 support, reduce wait times, and deliver consistent service quality...",
    category: "AI",
    author: "James Chen",
    date: "April 3, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    id: 3,
    title: "Ethical Considerations in Business Process Automation",
    excerpt: "Explore the ethical dimensions of implementing automation technologies in the workplace and strategies for responsible innovation.",
    content: "As businesses increasingly adopt automation technologies, important ethical questions arise about impacts on employment, privacy, security, and social responsibility...",
    category: "Automation",
    author: "Sarah Johnson",
    date: "March 21, 2023",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    id: 4,
    title: "How Small Businesses Can Leverage AI Without Breaking the Bank",
    excerpt: "Practical approaches for small businesses to implement AI solutions with limited resources while maximizing ROI.",
    content: "Artificial intelligence isn't just for tech giants and enterprises with massive IT budgets. Today, small businesses can access powerful AI tools through affordable SaaS platforms, APIs, and open-source solutions...",
    category: "AI",
    author: "David Park",
    date: "February 12, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: false
  },
  {
    id: 5,
    title: "The Integration of AI and RPA: Creating Intelligent Automation",
    excerpt: "Understanding how the combination of AI and Robotic Process Automation is creating a new paradigm of intelligent automation solutions.",
    content: "The convergence of Artificial Intelligence and Robotic Process Automation represents one of the most significant developments in business technology in recent years. While RPA excels at rule-based, repetitive tasks, AI brings cognitive capabilities that can handle exceptions and make judgments...",
    category: "Automation",
    author: "Michael Thompson",
    date: "January 30, 2023",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    featured: true
  }
];

// Categories
const categories = ["All", "AI", "Automation", "Technology"];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const navigate = useNavigate();

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === activeCategory));
    }
  }, [activeCategory]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Our Blog</h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Insights, news, and perspectives on AI, automation, and digital transformation.
            </p>
          </div>
          
          {/* Featured Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Featured Articles</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {blogPosts.filter(post => post.featured).map((post) => (
                <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="mr-1 h-4 w-4" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <CalendarIcon className="mr-1 h-4 w-4" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Category Filter */}
          <div className="mb-10">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  className={`rounded-full ${
                    activeCategory === category ? "bg-gray-800 text-white" : "border-gray-300 text-gray-700"
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          {/* All Blog Posts */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">All Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-3">
                      <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                        {post.category}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      <span>{post.date}</span>
                      <span className="mx-2">•</span>
                      <Clock className="mr-1 h-3 w-3" />
                      <span>{post.readTime}</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-between px-4 py-2 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-colors"
                    >
                      <span>Read More</span>
                      <ArrowRight size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Newsletter Signup */}
          <div className="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
                Stay up to date with our latest insights
              </h2>
              <p className="text-gray-600 mb-6">
                Subscribe to our newsletter to receive the latest updates on AI, automation, and digital transformation.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <Button className="bg-gray-900 hover:bg-gray-800">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;

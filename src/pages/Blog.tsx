
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getBlogPosts } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogList from "@/components/blog/BlogList";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { useTheme } from "@/context/ThemeContext";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const { theme } = useTheme();

  // Categories
  const categories = ["All", "AI", "Automation", "Technology"];

  useEffect(() => {
    // Get posts from service
    setBlogPosts(getBlogPosts());
  }, []);

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === activeCategory));
    }
  }, [activeCategory, blogPosts]);

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <BlogHero />
          
          {/* Featured Posts */}
          <FeaturedPosts posts={blogPosts} />
          
          {/* Category Filter */}
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          
          {/* All Blog Posts */}
          <BlogList posts={filteredPosts} />
          
          {/* Newsletter Signup */}
          <NewsletterSignup />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;

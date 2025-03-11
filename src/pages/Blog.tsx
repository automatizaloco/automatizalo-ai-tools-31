
import { useState, useEffect } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchBlogPosts } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import CategoryFilter from "@/components/blog/CategoryFilter";
import BlogList from "@/components/blog/BlogList";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { useTheme } from "@/context/ThemeContext";
import { useQuery } from "@tanstack/react-query";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const { theme } = useTheme();

  // Categories
  const categories = ["All", "AI", "Automation", "Technology"];

  // Fetch blog posts using React Query
  const { data: blogPosts = [], isLoading } = useQuery({
    queryKey: ['blogPosts'],
    queryFn: fetchBlogPosts
  });

  useEffect(() => {
    if (activeCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(blogPosts.filter(post => post.category === activeCategory));
    }
  }, [activeCategory, blogPosts]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <BlogHero />
          <FeaturedPosts posts={blogPosts} />
          <CategoryFilter 
            categories={categories} 
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
          <BlogList posts={filteredPosts} />
          <NewsletterSignup />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, ArrowRight, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { getBlogPosts } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { useLanguage } from "@/context/LanguageContext";

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

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
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
              {t("blog.title")}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {t("blog.subtitle")}
            </p>
          </div>
          
          {/* Featured Posts */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t("blog.featured")}</h2>
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
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t("blog.all")}</h2>
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
                      <span>{t("blog.readMore")}</span>
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
                {t("blog.newsletter.title")}
              </h2>
              <p className="text-gray-600 mb-6">
                {t("blog.newsletter.subtitle")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={t("blog.newsletter.placeholder")}
                  className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                />
                <Button className="bg-gray-900 hover:bg-gray-800">
                  {t("blog.newsletter.button")}
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

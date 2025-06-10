
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchOptimizedBlogPosts, fetchOptimizedFeaturedPosts } from "@/services/blog/optimizedBlogService";
import { BlogPost } from "@/types/blog";
import BlogHero from "@/components/blog/BlogHero";
import FeaturedPosts from "@/components/blog/FeaturedPosts";
import CategoryFilter from "@/components/blog/CategoryFilter";
import TagFilter from "@/components/blog/TagFilter";
import BlogList from "@/components/blog/BlogList";
import NewsletterSignup from "@/components/blog/NewsletterSignup";
import { useTheme } from "@/context/ThemeContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const Blog = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || "All");
  const [activeTags, setActiveTags] = useState<string[]>(
    searchParams.get('tag') ? [searchParams.get('tag')!] : []
  );
  const { theme } = useTheme();

  // Categories
  const categories = ["All", "AI", "Automation", "Technology"];

  // Optimized blog posts query
  const { 
    data: blogPosts = [] as BlogPost[], 
    isLoading, 
    isError, 
  } = useQuery({
    queryKey: ['optimized-blog-posts'],
    queryFn: fetchOptimizedBlogPosts,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  // Separate query for featured posts
  const { data: featuredPosts = [] as BlogPost[] } = useQuery({
    queryKey: ['featured-blog-posts'],
    queryFn: fetchOptimizedFeaturedPosts,
    staleTime: 15 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Extraer todos los tags únicos de los posts
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    blogPosts.forEach(post => {
      post.tags.forEach(tag => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [blogPosts]);

  // Filtrar posts por categoría y tags
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filtrar por categoría
    if (activeCategory !== "All") {
      filtered = filtered.filter(post => post.category === activeCategory);
    }

    // Filtrar por tags
    if (activeTags.length > 0) {
      filtered = filtered.filter(post => 
        activeTags.some(tag => post.tags.includes(tag))
      );
    }

    return filtered;
  }, [activeCategory, activeTags, blogPosts]);

  // Actualizar URL cuando cambian los filtros
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (activeCategory !== "All") {
      params.set('category', activeCategory);
    }
    
    if (activeTags.length > 0) {
      params.set('tag', activeTags[0]); // Solo el primer tag en la URL por simplicidad
    }

    if (params.toString()) {
      setSearchParams(params);
    } else {
      setSearchParams({});
    }
  }, [activeCategory, activeTags, setSearchParams]);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  const handleTagToggle = (tag: string) => {
    setActiveTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleClearTags = () => {
    setActiveTags([]);
  };

  // Handle error state
  if (isError) {
    return (
      <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <main className="flex-grow pt-24 pb-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold mb-4">Unable to load blog posts</h2>
            <p className="mb-4">We're experiencing technical difficulties. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Refresh Page
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <BlogHero />
          
          {isLoading ? (
            <SimplifiedLoadingState />
          ) : (
            <>
              <FeaturedPosts posts={featuredPosts} />
              <CategoryFilter 
                categories={categories} 
                activeCategory={activeCategory}
                onCategoryChange={handleCategoryChange}
              />
              <TagFilter
                tags={allTags}
                activeTags={activeTags}
                onTagToggle={handleTagToggle}
                onClearTags={handleClearTags}
              />
              <BlogList posts={filteredPosts} />
              <NewsletterSignup />
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Simplified loading state for better performance
const SimplifiedLoadingState = () => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map((i) => (
        <div key={i} className="flex flex-col gap-4">
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-3">
          <Skeleton className="h-40 w-full rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
        </div>
      ))}
    </div>
  </div>
);

export default Blog;

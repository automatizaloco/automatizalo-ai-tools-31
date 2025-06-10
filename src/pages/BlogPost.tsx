
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchOptimizedBlogPostBySlug, fetchOptimizedBlogPosts } from "@/services/blog/optimizedBlogService";
import { BlogPost as BlogPostType } from "@/types/blog";
import { useLanguage } from "@/context/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import RelatedPosts from "@/components/blog/RelatedPosts";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  
  // Query para el post individual
  const { 
    data: post, 
    isLoading, 
    isError 
  } = useQuery({
    queryKey: ['blog-post', slug],
    queryFn: () => slug ? fetchOptimizedBlogPostBySlug(slug) : Promise.resolve(null),
    enabled: !!slug,
    staleTime: 15 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Query para todos los posts (para posts relacionados)
  const { data: allPosts = [] } = useQuery({
    queryKey: ['all-blog-posts-for-related'],
    queryFn: fetchOptimizedBlogPosts,
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Simple translation helper for blog content
  const translateContent = (post: BlogPostType, field: 'title' | 'content', lang: string) => {
    if (lang === 'en') return post[field];
    if (lang === 'es' && post[`${field}_es`]) return post[`${field}_es`];
    if (lang === 'fr' && post[`${field}_fr`]) return post[`${field}_fr`];
    return post[field]; // fallback to English
  };

  if (isLoading) {
    return (
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <Skeleton className="h-10 w-32 mb-8" />
          </div>
          
          <div className="max-w-3xl mx-auto">
            <Skeleton className="h-12 w-full mb-6" />
            <div className="flex items-center justify-between mb-6">
              <div>
                <Skeleton className="h-5 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-8 w-20" />
            </div>
            <Skeleton className="h-64 w-full mb-8 rounded-xl" />
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
          </div>
        </div>
      </main>
    );
  }
  
  if (isError || !post) {
    return (
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex-grow flex flex-col items-center justify-center">
            <h2 className="text-2xl font-bold mb-4">Post not found</h2>
            <Link to="/blog">
              <Button>Return to Blog</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const title = translateContent(post, 'title', language);
  const content = translateContent(post, 'content', language);

  return (
    <main className="flex-grow pt-32 pb-16">
      <div className="container mx-auto px-4">
        <Link to="/blog">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>
        
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">{title}</h1>
            
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-medium">{post.author}</p>
                <p className="text-sm text-gray-500">{post.date} · {post.readTime}</p>
              </div>
              
              <div>
                <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                  {post.category}
                </span>
              </div>
            </div>
            
            {post.image && (
              <div className="rounded-xl overflow-hidden mb-8">
                <img 
                  src={post.image} 
                  alt={title}
                  className="w-full h-auto object-cover"
                  loading="lazy"
                />
              </div>
            )}
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: content }} 
              className="blog-content"
            />
          </div>
          
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Posts relacionados */}
          {allPosts.length > 0 && (
            <RelatedPosts currentPost={post} allPosts={allPosts} />
          )}
        </div>
      </div>
    </main>
  );
};

export default BlogPost;


import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BlogPost } from "@/types/blog";
import { fetchOptimizedBlogPosts } from "@/services/blog/optimizedBlogService";
import { deleteBlogPost, updateBlogPostStatus } from "@/services/blogService";
import { useSocialMediaShare } from "@/hooks/useSocialMediaShare";
import { handleSupabaseError } from "@/integrations/supabase/client";

export const useOptimizedBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { shareToSocialMedia } = useSocialMediaShare();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching optimized blog posts...");
        setError(null);
        setLoading(true);
        
        // Try to load from cache first for instant loading
        const cachedPosts = localStorage.getItem('cached_blog_posts');
        if (cachedPosts) {
          try {
            const parsedPosts = JSON.parse(cachedPosts);
            setPosts(parsedPosts);
            setLoading(false); // Show cached data immediately
          } catch (cacheError) {
            console.error("Error parsing cached posts:", cacheError);
          }
        }
        
        // Fetch fresh data in the background
        const fetchedPosts = await fetchOptimizedBlogPosts();
        setPosts(fetchedPosts);
        
        // Update cache
        localStorage.setItem('cached_blog_posts', JSON.stringify(fetchedPosts));
        console.log(`Successfully fetched ${fetchedPosts.length} optimized blog posts`);
        
      } catch (error: any) {
        console.error("Error fetching blog posts:", error);
        const errorMessage = handleSupabaseError(error, "Failed to load blog posts");
        setError(errorMessage);
        
        // If we don't have cached data, show error
        if (posts.length === 0) {
          toast.error("Failed to load blog posts");
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlogPost(id);
        setPosts(posts.filter(post => post.id !== id));
        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error(handleSupabaseError(error, "Failed to delete post"));
      }
    }
  };

  const handleToggleStatus = async (post: BlogPost) => {
    try {
      const newStatus = post.status === 'draft' ? 'published' : 'draft';
      
      await updateBlogPostStatus(post.id, newStatus);
      
      setPosts(posts.map(p => {
        if (p.id === post.id) {
          return { ...p, status: newStatus };
        }
        return p;
      }));

      if (newStatus === 'published') {
        try {
          await shareToSocialMedia(post);
        } catch (socialError) {
          console.error("Error sharing to social media:", socialError);
        }
      }
      
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'unpublished'} successfully`);
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error(handleSupabaseError(error, "Failed to update post status"));
    }
  };

  return {
    posts,
    loading,
    error,
    handleDelete,
    handleToggleStatus,
  };
};

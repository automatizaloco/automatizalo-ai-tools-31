
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BlogPost } from "@/types/blog";
import { fetchBlogPosts, deleteBlogPost, updateBlogPostStatus } from "@/services/blogService";
import { useSocialMediaShare } from "@/hooks/useSocialMediaShare";
import { handleSupabaseError } from "@/integrations/supabase/client";

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { shareToSocialMedia } = useSocialMediaShare();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching blog posts...");
        setError(null);
        setLoading(true);
        const fetchedPosts = await fetchBlogPosts();
        setPosts(fetchedPosts);
        console.log(`Successfully fetched ${fetchedPosts.length} blog posts`);
      } catch (error: any) {
        console.error("Error fetching blog posts:", error);
        setError(handleSupabaseError(error, "Failed to load blog posts"));
        toast.error("Failed to load blog posts. Please try refreshing the page.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchPosts();
    
    const handlePostUpdate = () => {
      fetchPosts();
    };
    
    window.addEventListener('blogPostUpdated', handlePostUpdate);
    window.addEventListener('blogPostDeleted', handlePostUpdate);
    
    return () => {
      window.removeEventListener('blogPostUpdated', handlePostUpdate);
      window.removeEventListener('blogPostDeleted', handlePostUpdate);
    };
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
        await shareToSocialMedia(post);
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

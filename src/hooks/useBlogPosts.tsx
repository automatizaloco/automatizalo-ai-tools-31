
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { BlogPost } from "@/types/blog";
import { fetchBlogPosts, deleteBlogPost, updateBlogPostStatus } from "@/services/blogService";
import { useSocialMediaShare } from "@/hooks/useSocialMediaShare";

export const useBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { shareToSocialMedia } = useSocialMediaShare();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await fetchBlogPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Error fetching blog posts:", error);
        toast.error("Failed to load blog posts");
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
        toast.error("Failed to delete post");
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
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status");
    }
  };

  return {
    posts,
    loading,
    handleDelete,
    handleToggleStatus,
  };
};

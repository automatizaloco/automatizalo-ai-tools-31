
import { useState, useEffect, useCallback, useMemo } from "react";
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

  // Optimización: cache más agresivo y gestión de estado mejorada
  const fetchPosts = useCallback(async () => {
    try {
      console.log("Fetching optimized blog posts...");
      setError(null);
      
      // Cargar desde cache inmediatamente para UI instantánea
      const cachedPosts = localStorage.getItem('cached_blog_posts');
      if (cachedPosts) {
        try {
          const parsedPosts = JSON.parse(cachedPosts);
          setPosts(parsedPosts);
          setLoading(false); // Mostrar datos cached inmediatamente
        } catch (cacheError) {
          console.error("Error parsing cached posts:", cacheError);
        }
      }
      
      // Fetch en background sin bloquear UI
      const fetchedPosts = await fetchOptimizedBlogPosts();
      
      // Solo actualizar si hay cambios reales
      if (JSON.stringify(fetchedPosts) !== cachedPosts) {
        setPosts(fetchedPosts);
        localStorage.setItem('cached_blog_posts', JSON.stringify(fetchedPosts));
      }
      
      console.log(`Successfully fetched ${fetchedPosts.length} optimized blog posts`);
      
    } catch (error: any) {
      console.error("Error fetching blog posts:", error);
      const errorMessage = handleSupabaseError(error, "Failed to load blog posts");
      setError(errorMessage);
      
      // Solo mostrar error si no hay datos cached
      if (posts.length === 0) {
        toast.error("Failed to load blog posts");
      }
    } finally {
      setLoading(false);
    }
  }, [posts.length]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Optimización: memoizar handlers para evitar re-creaciones
  const handleDelete = useCallback(async (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deleteBlogPost(id);
        
        // Actualización optimista del estado
        setPosts(prevPosts => {
          const newPosts = prevPosts.filter(post => post.id !== id);
          localStorage.setItem('cached_blog_posts', JSON.stringify(newPosts));
          return newPosts;
        });
        
        toast.success("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
        toast.error(handleSupabaseError(error, "Failed to delete post"));
      }
    }
  }, []);

  const handleToggleStatus = useCallback(async (post: BlogPost) => {
    try {
      const newStatus: "draft" | "published" = post.status === 'draft' ? 'published' : 'draft';
      
      // Actualización optimista del estado
      setPosts(prevPosts => {
        const newPosts = prevPosts.map(p => {
          if (p.id === post.id) {
            return { ...p, status: newStatus };
          }
          return p;
        });
        localStorage.setItem('cached_blog_posts', JSON.stringify(newPosts));
        return newPosts;
      });

      await updateBlogPostStatus(post.id, newStatus);

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
      
      // Revertir cambio optimista en caso de error
      fetchPosts();
    }
  }, [fetchPosts, shareToSocialMedia]);

  // Memoizar el objeto de retorno para evitar re-renderizados
  const returnValue = useMemo(() => ({
    posts,
    loading,
    error,
    handleDelete,
    handleToggleStatus,
  }), [posts, loading, error, handleDelete, handleToggleStatus]);

  return returnValue;
};

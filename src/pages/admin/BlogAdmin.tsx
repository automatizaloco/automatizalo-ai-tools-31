
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Globe, Magic, FileText } from "lucide-react";
import { fetchBlogPosts, deleteBlogPost, updateBlogPostStatus } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";

const BlogAdmin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
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
    
    // Listen for post updates
    const handlePostUpdate = () => {
      fetchPosts();
    };
    
    window.addEventListener('blogPostUpdated', handlePostUpdate);
    window.addEventListener('blogPostDeleted', handlePostUpdate);
    
    return () => {
      window.removeEventListener('blogPostUpdated', handlePostUpdate);
      window.removeEventListener('blogPostDeleted', handlePostUpdate);
    };
  }, [isAuthenticated, navigate]);

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

  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/blog/new");
  };
  
  const handleCreateAutomatic = () => {
    navigate("/admin/blog/automatic");
  };
  
  const handleToggleStatus = async (post: BlogPost) => {
    try {
      const newStatus = post.status === 'draft' ? 'published' : 'draft';
      await updateBlogPostStatus(post.id, newStatus);
      // Update local state
      setPosts(posts.map(p => {
        if (p.id === post.id) {
          return { ...p, status: newStatus };
        }
        return p;
      }));
      toast.success(`Post ${newStatus === 'published' ? 'published' : 'moved to drafts'} successfully`);
    } catch (error) {
      console.error("Error updating post status:", error);
      toast.error("Failed to update post status");
    }
  };

  const hasTranslations = (post: BlogPost) => {
    return post.translations && Object.keys(post.translations).length > 0;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">Loading...</div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Management</h1>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={handleCreateAutomatic}
            className="flex items-center gap-2"
          >
            <Magic className="w-4 h-4" />
            AI Generate
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Post
          </Button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Translations</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{post.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Badge className={post.status === 'draft' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}>
                      {post.status === 'draft' ? 'Draft' : 'Published'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {post.featured ? "Yes" : "No"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      {hasTranslations(post) ? (
                        <>
                          <Globe className="h-4 w-4 text-green-500" />
                          <span className="text-green-500">Translated</span>
                        </>
                      ) : (
                        <>
                          <Globe className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-400">English Only</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button 
                        variant="outline"
                        size="sm" 
                        className={post.status === 'draft' ? 'text-green-600 hover:text-green-800 border-green-200 hover:bg-green-50' : 'text-amber-600 hover:text-amber-800 border-amber-200 hover:bg-amber-50'}
                        onClick={() => handleToggleStatus(post)}
                      >
                        {post.status === 'draft' ? 'Publish' : 'To Draft'}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleEdit(post.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BlogAdmin;

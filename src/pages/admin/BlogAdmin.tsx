
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PlusCircle, Edit, Trash2, Globe } from "lucide-react";
import { getBlogPosts, deleteBlogPost } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";

const BlogAdmin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const { language } = useLanguage();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    
    setPosts(getBlogPosts());
  }, [isAuthenticated, navigate]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      if (deleteBlogPost(id)) {
        setPosts(posts.filter(post => post.id !== id));
        toast.success("Post deleted successfully");
      } else {
        toast.error("Failed to delete post");
      }
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleCreate = () => {
    navigate("/admin/blog/create");
  };

  const hasTranslations = (post: BlogPost) => {
    return post.translations && Object.keys(post.translations).length > 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Blog Management</h1>
            <Button 
              onClick={handleCreate}
              className="bg-gray-900 hover:bg-gray-800"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
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
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogAdmin;

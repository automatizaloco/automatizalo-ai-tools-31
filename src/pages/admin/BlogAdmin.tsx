import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Globe, Wand2, MoreVertical } from "lucide-react";
import { fetchBlogPosts, deleteBlogPost, updateBlogPostStatus } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const BlogAdmin = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { language } = useLanguage();
  const isMobile = useIsMobile();

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
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const MobilePostCard = ({ post }: { post: BlogPost }) => (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{post.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleToggleStatus(post)}>
                {post.status === 'draft' ? 'Publish' : 'Move to Draft'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-gray-600 mb-2">
          {post.category} • {post.date}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
            {post.status === 'draft' ? 'Draft' : 'Published'}
          </Badge>
          {post.featured && (
            <Badge className="bg-purple-100 text-purple-800">
              Featured
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasTranslations(post) ? (
            <>
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-green-500 text-xs">Translated</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-xs">English Only</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8 gap-3">
        <h1 className="text-xl md:text-3xl font-bold">Blog Management</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleCreateAutomatic}
            className="flex items-center gap-2 text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <Wand2 className="w-4 h-4" />
            {isMobile ? "AI" : "AI Generate"}
          </Button>
          <Button 
            onClick={handleCreate}
            className="bg-gray-900 hover:bg-gray-800 text-sm"
            size={isMobile ? "sm" : "default"}
          >
            <PlusCircle className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
            {!isMobile && "Create New Post"}
          </Button>
        </div>
      </div>
      
      {isMobile ? (
        <div>
          {posts.map((post) => (
            <MobilePostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Translations</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post) => (
                  <TableRow key={post.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.category}</TableCell>
                    <TableCell>{post.date}</TableCell>
                    <TableCell>
                      <Badge className={post.status === 'draft' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}>
                        {post.status === 'draft' ? 'Draft' : 'Published'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {post.featured ? "Yes" : "No"}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogAdmin;

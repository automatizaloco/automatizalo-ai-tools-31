
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createBlogPost, getBlogPostById, updateBlogPost } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Globe, Check } from "lucide-react";
import { RichTextEditor } from "@/components/editor/RichTextEditor";

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
    author: "",
    date: new Date().toISOString().split('T')[0],
    readTime: "",
    image: "",
    featured: false
  });
  const [currentTab, setCurrentTab] = useState("en");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (id) {
      const post = getBlogPostById(id);
      if (post) {
        setPost(post);
        setFormData({
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          content: post.content,
          category: post.category,
          tags: post.tags.join(", "),
          author: post.author,
          date: post.date,
          readTime: post.readTime,
          image: post.image,
          featured: post.featured || false
        });
      }
    }
  }, [id, isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({
      ...prev,
      content
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      
      const postData = {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags: tagsArray,
        author: formData.author,
        date: formData.date,
        readTime: formData.readTime,
        image: formData.image,
        featured: formData.featured,
        slug: formData.slug || formData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-')
      };

      if (id) {
        await updateBlogPost(id, postData);
        toast.success("Post updated successfully");
      } else {
        await createBlogPost(postData);
        toast.success("Post created successfully");
      }
      
      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post");
    } finally {
      setIsLoading(false);
    }
  };

  const getTranslatedValue = (field: keyof BlogPost) => {
    if (!post || !post.translations || !post.translations[currentTab as keyof typeof post.translations]) {
      return "";
    }
    
    const translation = post.translations[currentTab as keyof typeof post.translations];
    if (!translation || !(field in translation)) {
      return "";
    }
    
    return translation[field as keyof typeof translation] || "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {id ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {post && post.translations && (
              
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-3 flex items-center">
                  <Globe className="mr-2 h-5 w-5 text-gray-500" />
                  Translation Preview
                </h2>
                <Tabs
                  defaultValue="en"
                  value={currentTab}
                  onValueChange={setCurrentTab}
                  className="w-full"
                >
                  <TabsList>
                    <TabsTrigger value="en" className="flex items-center">
                      🇺🇸 English
                      <Check className="ml-1 h-3 w-3 text-green-500" />
                    </TabsTrigger>
                    <TabsTrigger value="fr" className="flex items-center">
                      🇫🇷 French
                      {post.translations.fr ? (
                        <Check className="ml-1 h-3 w-3 text-green-500" />
                      ) : null}
                    </TabsTrigger>
                    <TabsTrigger value="es" className="flex items-center">
                      🇨🇴 Spanish
                      {post.translations.es ? (
                        <Check className="ml-1 h-3 w-3 text-green-500" />
                      ) : null}
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="en" className="p-4 border rounded-md mt-2">
                    <h3 className="font-medium">English (Original)</h3>
                    <p className="text-sm text-gray-500">This is the original content you created</p>
                  </TabsContent>
                  <TabsContent value="fr" className="p-4 border rounded-md mt-2">
                    <h3 className="font-medium">French Translation</h3>
                    <p className="text-sm text-gray-500">
                      {post.translations.fr 
                        ? "Content has been automatically translated to French"
                        : "Content will be automatically translated when you save"}
                    </p>
                    {post.translations.fr && (
                      <div className="mt-3">
                        <p><strong>Title:</strong> {post.translations.fr.title}</p>
                        <p><strong>Excerpt:</strong> {post.translations.fr.excerpt}</p>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="es" className="p-4 border rounded-md mt-2">
                    <h3 className="font-medium">Spanish Translation</h3>
                    <p className="text-sm text-gray-500">
                      {post.translations.es 
                        ? "Content has been automatically translated to Spanish"
                        : "Content will be automatically translated when you save"}
                    </p>
                    {post.translations.es && (
                      <div className="mt-3">
                        <p><strong>Title:</strong> {post.translations.es.title}</p>
                        <p><strong>Excerpt:</strong> {post.translations.es.excerpt}</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
                <p className="text-sm text-gray-500 mt-3">
                  <Globe className="inline-block mr-1 h-4 w-4" />
                  Content is automatically translated to French and Spanish when you save the post.
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                    Slug (leave empty to generate from title)
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                    required
                  ></textarea>
                </div>
                
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <RichTextEditor 
                    value={formData.content}
                    onChange={handleContentChange}
                    placeholder="Write your content here..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use the formatting toolbar above to style your content. You can also switch to HTML view to edit the code directly.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      id="tags"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                      Author
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      id="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Read Time
                    </label>
                    <input
                      type="text"
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      placeholder="e.g. 5 min read"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="h-5 w-5 text-gray-900 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                    Feature this post
                  </label>
                </div>
                
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/admin/blog")}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    className="bg-gray-900 hover:bg-gray-800"
                    disabled={isLoading}
                  >
                    {isLoading ? "Saving..." : (id ? "Update Post" : "Create Post")}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostForm;

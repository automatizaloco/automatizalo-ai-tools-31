
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
import { Globe, Check, Edit } from "lucide-react";
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
  const [editingTranslation, setEditingTranslation] = useState(false);
  const [translationData, setTranslationData] = useState({
    fr: { title: "", excerpt: "", content: "" },
    es: { title: "", excerpt: "", content: "" }
  });

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
        
        // Initialize translation data if it exists
        if (post.translations) {
          setTranslationData({
            fr: {
              title: post.translations.fr?.title || "",
              excerpt: post.translations.fr?.excerpt || "",
              content: post.translations.fr?.content || ""
            },
            es: {
              title: post.translations.es?.title || "",
              excerpt: post.translations.es?.excerpt || "",
              content: post.translations.es?.content || ""
            }
          });
        }
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

  const handleTranslationChange = (
    lang: "fr" | "es", 
    field: "title" | "excerpt" | "content", 
    value: string
  ) => {
    setTranslationData(prev => ({
      ...prev,
      [lang]: {
        ...prev[lang],
        [field]: value
      }
    }));
  };

  const handleTranslationContentChange = (content: string) => {
    handleTranslationChange(
      currentTab as "fr" | "es", 
      "content", 
      content
    );
  };

  const toggleTranslationEditing = () => {
    setEditingTranslation(!editingTranslation);
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

      // Add manual translations if we're editing an existing post
      if (id && editingTranslation) {
        postData.translations = translationData;
      }

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
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-medium flex items-center">
                    <Globe className="mr-2 h-5 w-5 text-gray-500" />
                    Translation Preview
                  </h2>
                  {id && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleTranslationEditing}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                      {editingTranslation ? "Auto-translate" : "Edit Translations"}
                    </Button>
                  )}
                </div>
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
                    {editingTranslation ? (
                      <div className="space-y-4 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (French)
                          </label>
                          <input
                            type="text"
                            value={translationData.fr.title}
                            onChange={(e) => handleTranslationChange("fr", "title", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Excerpt (French)
                          </label>
                          <textarea
                            value={translationData.fr.excerpt}
                            onChange={(e) => handleTranslationChange("fr", "excerpt", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content (French)
                          </label>
                          <RichTextEditor 
                            value={translationData.fr.content}
                            onChange={handleTranslationContentChange}
                            placeholder="Write your French content here..."
                          />
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="es" className="p-4 border rounded-md mt-2">
                    <h3 className="font-medium">Spanish Translation</h3>
                    {editingTranslation ? (
                      <div className="space-y-4 mt-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Title (Spanish)
                          </label>
                          <input
                            type="text"
                            value={translationData.es.title}
                            onChange={(e) => handleTranslationChange("es", "title", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Excerpt (Spanish)
                          </label>
                          <textarea
                            value={translationData.es.excerpt}
                            onChange={(e) => handleTranslationChange("es", "excerpt", e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            rows={3}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Content (Spanish)
                          </label>
                          <RichTextEditor 
                            value={translationData.es.content}
                            onChange={handleTranslationContentChange}
                            placeholder="Write your Spanish content here..."
                          />
                        </div>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
                  </TabsContent>
                </Tabs>
                <p className="text-sm text-gray-500 mt-3">
                  <Globe className="inline-block mr-1 h-4 w-4" />
                  {editingTranslation 
                    ? "You're manually editing translations. Your changes will override automatic translations."
                    : "Content is automatically translated to French and Spanish when you save the post."}
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

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
import { Globe, Check, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image, Smile, Code, Quote } from "lucide-react";

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
  // Editor state
  const [showPreview, setShowPreview] = useState(false);

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

  // Insert formatting at cursor position in the text editor
  const insertFormatting = (format: string) => {
    const textarea = document.getElementById("content") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let formattedText = "";
    
    switch (format) {
      case 'bold':
        formattedText = `<b>${selectedText}</b>`;
        break;
      case 'italic':
        formattedText = `<i>${selectedText}</i>`;
        break;
      case 'underline':
        formattedText = `<u>${selectedText}</u>`;
        break;
      case 'ul':
        formattedText = `<ul>\n  <li>${selectedText}</li>\n</ul>`;
        break;
      case 'ol':
        formattedText = `<ol>\n  <li>${selectedText}</li>\n</ol>`;
        break;
      case 'link':
        formattedText = `<a href="https://example.com" target="_blank">${selectedText || 'Link text'}</a>`;
        break;
      case 'image':
        formattedText = `<img src="https://example.com/image.jpg" alt="${selectedText || 'Image description'}" class="w-full h-auto rounded-lg" />`;
        break;
      case 'emoji':
        formattedText = `${selectedText}😊`;
        break;
      case 'code':
        formattedText = `<code>${selectedText}</code>`;
        break;
      case 'quote':
        formattedText = `<blockquote class="border-l-4 border-gray-300 pl-4 italic">${selectedText}</blockquote>`;
        break;
      default:
        formattedText = selectedText;
    }
    
    const newContent = textarea.value.substring(0, start) + formattedText + textarea.value.substring(end);
    
    setFormData(prev => ({
      ...prev,
      content: newContent
    }));
    
    // Set focus back to textarea and update cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
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
                  
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('bold')}
                        className="h-8 w-8 p-1"
                      >
                        <Bold size={16} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('italic')}
                        className="h-8 w-8 p-1"
                      >
                        <Italic size={16} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('underline')}
                        className="h-8 w-8 p-1"
                      >
                        <Underline size={16} />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('ul')}
                        className="h-8 w-8 p-1"
                      >
                        <List size={16} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('ol')}
                        className="h-8 w-8 p-1"
                      >
                        <ListOrdered size={16} />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('link')}
                        className="h-8 w-8 p-1"
                      >
                        <LinkIcon size={16} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('image')}
                        className="h-8 w-8 p-1"
                      >
                        <Image size={16} />
                      </Button>
                      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('emoji')}
                        className="h-8 w-8 p-1"
                      >
                        <Smile size={16} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('code')}
                        className="h-8 w-8 p-1"
                      >
                        <Code size={16} />
                      </Button>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => insertFormatting('quote')}
                        className="h-8 w-8 p-1"
                      >
                        <Quote size={16} />
                      </Button>
                      <div className="flex-grow"></div>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowPreview(!showPreview)}
                        className="text-xs"
                      >
                        {showPreview ? "Edit HTML" : "Preview"}
                      </Button>
                    </div>
                    
                    {showPreview ? (
                      <div className="prose prose-lg max-w-none p-4 min-h-[300px] bg-white">
                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                      </div>
                    ) : (
                      <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={12}
                        className="w-full px-4 py-2 border-0 focus:ring-0 font-mono text-sm"
                        placeholder="<p>Your content here...</p>&#10;<p>Use the formatting tools above or write HTML directly</p>"
                        required
                      ></textarea>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use the formatting toolbar above or write HTML directly. Click Preview to see how your content will look.
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

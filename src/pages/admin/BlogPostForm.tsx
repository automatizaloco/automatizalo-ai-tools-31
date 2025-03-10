
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createBlogPost, getBlogPostById, updateBlogPost } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { BlogFormData, TranslationFormData } from "@/types/form";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import TranslationPanel from "@/components/admin/blog/TranslationPanel";
import BlogFormFields from "@/components/admin/blog/BlogFormFields";

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
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
    featured: false,
    translations: {
      fr: { title: "", excerpt: "", content: "" },
      es: { title: "", excerpt: "", content: "" }
    }
  });
  const [currentTab, setCurrentTab] = useState("en");
  const [editingTranslation, setEditingTranslation] = useState(false);
  const [translationData, setTranslationData] = useState<TranslationFormData>({
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
          featured: post.featured || false,
          translations: post.translations || {
            fr: { title: "", excerpt: "", content: "" },
            es: { title: "", excerpt: "", content: "" }
          }
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
              <TranslationPanel
                post={post}
                editingTranslation={editingTranslation}
                translationData={translationData}
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                onTranslationEdit={toggleTranslationEditing}
                onTranslationChange={handleTranslationChange}
                onTranslationContentChange={handleTranslationContentChange}
              />
            )}
            
            <form onSubmit={handleSubmit}>
              <BlogFormFields 
                formData={formData}
                handleChange={handleChange}
                handleContentChange={handleContentChange}
              />
              
              <div className="flex justify-end space-x-4 mt-6">
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
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostForm;

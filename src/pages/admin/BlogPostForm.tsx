
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { createBlogPost, fetchBlogPostById, updateBlogPost } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { BlogFormData, TranslationFormData } from "@/types/form";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import TranslationPanel from "@/components/admin/blog/TranslationPanel";
import BlogFormFields from "@/components/admin/blog/BlogFormFields";
import { supabase } from "@/integrations/supabase/client";
import { translateBlogContent } from "@/services/translationService";
import { Loader2, Globe } from "lucide-react";

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
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
  const [isTranslating, setIsTranslating] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      console.log("Current auth session:", data);
    };
    
    checkSession();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please log in to access this page");
      navigate("/login", { replace: true });
      return;
    }

    const fetchPost = async () => {
      if (id) {
        try {
          const fetchedPost = await fetchBlogPostById(id);
          if (fetchedPost) {
            setPost(fetchedPost);
            
            setFormData({
              title: fetchedPost.title,
              slug: fetchedPost.slug,
              excerpt: fetchedPost.excerpt,
              content: fetchedPost.content,
              category: fetchedPost.category,
              tags: fetchedPost.tags.join(", "),
              author: fetchedPost.author,
              date: fetchedPost.date,
              readTime: fetchedPost.readTime,
              image: fetchedPost.image,
              featured: fetchedPost.featured || false,
              translations: fetchedPost.translations ? {
                fr: {
                  title: fetchedPost.translations.fr?.title || "",
                  excerpt: fetchedPost.translations.fr?.excerpt || "",
                  content: fetchedPost.translations.fr?.content || ""
                },
                es: {
                  title: fetchedPost.translations.es?.title || "",
                  excerpt: fetchedPost.translations.es?.excerpt || "",
                  content: fetchedPost.translations.es?.content || ""
                }
              } : {
                fr: { title: "", excerpt: "", content: "" },
                es: { title: "", excerpt: "", content: "" }
              }
            });
            
            if (fetchedPost.translations) {
              setTranslationData({
                fr: {
                  title: fetchedPost.translations.fr?.title || "",
                  excerpt: fetchedPost.translations.fr?.excerpt || "",
                  content: fetchedPost.translations.fr?.content || ""
                },
                es: {
                  title: fetchedPost.translations.es?.title || "",
                  excerpt: fetchedPost.translations.es?.excerpt || "",
                  content: fetchedPost.translations.es?.content || ""
                }
              });
            }
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
          toast.error("Failed to load blog post");
        } finally {
          setFetchLoading(false);
        }
      } else {
        setFetchLoading(false);
      }
    };
    
    fetchPost();
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

  const autoTranslateAll = async () => {
    if (!formData.content || !formData.title || !formData.excerpt) {
      toast.error("Please add content to translate");
      return;
    }

    setIsTranslating(true);

    try {
      // French translation
      const frTranslation = await translateBlogContent(
        formData.content,
        formData.title,
        formData.excerpt,
        'fr'
      );

      // Spanish translation
      const esTranslation = await translateBlogContent(
        formData.content,
        formData.title,
        formData.excerpt,
        'es'
      );

      // Update the translation data state
      const updatedTranslations = {
        fr: {
          title: frTranslation.title,
          excerpt: frTranslation.excerpt,
          content: frTranslation.content
        },
        es: {
          title: esTranslation.title,
          excerpt: esTranslation.excerpt,
          content: esTranslation.content
        }
      };

      // Update both states to ensure consistency
      setTranslationData(updatedTranslations);
      
      // Also update the form data with the translations
      setFormData(prev => ({
        ...prev,
        translations: updatedTranslations
      }));

      console.log("Translations updated:", updatedTranslations);
      toast.success("Content translated to all languages");
      
      // Update the post immediately if in edit mode and not manually editing translations
      if (id && !editingTranslation) {
        await saveTranslations(updatedTranslations);
      }
    } catch (error) {
      console.error("Error auto-translating all content:", error);
      toast.error("Failed to translate content to all languages");
    } finally {
      setIsTranslating(false);
    }
  };

  // New function to save translations without having to submit the entire form
  const saveTranslations = async (translations: TranslationFormData) => {
    if (!id) return;
    
    try {
      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      
      const postData = {
        ...formData,
        tags: tagsArray,
        translations
      };
      
      await updateBlogPost(id, postData);
      
      // Update the post state to reflect the new translations
      if (post) {
        setPost({
          ...post,
          translations
        });
      }
      
      toast.success("Translations saved successfully");
    } catch (error) {
      console.error("Error saving translations:", error);
      toast.error("Failed to save translations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("Submitting form with data:", formData);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) {
        toast.error("You must be logged in to create or update posts");
        navigate("/login", { replace: true });
        return;
      }

      const tagsArray = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag);
      
      // Use the most up-to-date translation data
      const finalTranslations = editingTranslation ? translationData : formData.translations;
      
      const postData: any = {
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
        slug: formData.slug || formData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
        translations: finalTranslations
      };

      console.log("Post data prepared for saving:", postData);

      if (id) {
        console.log("Updating existing post with ID:", id);
        await updateBlogPost(id, postData);
        toast.success("Post updated successfully");
      } else {
        console.log("Creating new post");
        await createBlogPost(postData);
        toast.success("Post created successfully");
      }
      
      navigate("/admin/blog");
    } catch (error) {
      console.error("Error saving post:", error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error("Detailed error:", error);
      
      toast.error(
        <div>
          <p>Failed to save post: {errorMessage}</p>
          <p className="text-xs mt-1">Please check the console for more details</p>
        </div>
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <main className="flex-grow pt-32 pb-16">
          <div className="container mx-auto px-4">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              {id ? "Edit Blog Post" : "Create New Blog Post"}
            </h1>
            {id && !editingTranslation && (
              <Button
                variant="outline"
                onClick={autoTranslateAll}
                disabled={isTranslating}
                className="flex items-center gap-2"
              >
                {isTranslating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Translating...
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4" />
                    Auto-translate All
                  </>
                )}
              </Button>
            )}
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {post && (
              <TranslationPanel
                post={post}
                editingTranslation={editingTranslation}
                translationData={translationData}
                currentTab={currentTab}
                onTabChange={setCurrentTab}
                onTranslationEdit={toggleTranslationEditing}
                onTranslationChange={handleTranslationChange}
                onTranslationContentChange={handleTranslationContentChange}
                onSaveTranslations={() => saveTranslations(translationData)}
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

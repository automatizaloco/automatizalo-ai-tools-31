
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchBlogPostById, getBlogTranslations } from "@/services/blogService";
import { BlogPost } from "@/types/blog";
import { BlogFormData, TranslationFormData } from "@/types/form";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import TranslationPanel from "@/components/admin/blog/TranslationPanel";
import BlogFormFields from "@/components/admin/blog/BlogFormFields";
import BlogFormContainer from "@/components/admin/blog/BlogFormContainer";
import TranslationTools from "@/components/admin/blog/TranslationTools";
import { supabase } from "@/integrations/supabase/client";

const BlogPostForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();
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
              translations: {
                fr: { title: "", excerpt: "", content: "" },
                es: { title: "", excerpt: "", content: "" }
              }
            });
            
            try {
              const translations = await getBlogTranslations(id);
              setTranslationData(translations);
              setFormData(prev => ({
                ...prev,
                translations
              }));
              
              setPost(prev => {
                if (!prev) return prev;
                return {
                  ...prev,
                  translations
                };
              });
            } catch (translationError) {
              console.error("Error fetching translations:", translationError);
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
            
            <TranslationTools 
              id={id}
              post={post}
              formData={formData}
              setFormData={setFormData}
              translationData={translationData}
              setTranslationData={setTranslationData}
            />
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
                onSaveTranslations={() => {}}
              />
            )}
            
            <BlogFormContainer 
              formData={formData}
              setFormData={setFormData}
              translationData={translationData}
              editingTranslation={editingTranslation}
            >
              <BlogFormFields 
                formData={formData}
                handleChange={handleChange}
                handleContentChange={handleContentChange}
              />
            </BlogFormContainer>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPostForm;

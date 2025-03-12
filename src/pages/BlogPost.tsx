
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { fetchBlogPostBySlug } from "@/services/blog/getBlogPosts";
import { BlogPost as BlogPostType } from "@/types/blog";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, translateContent } = useLanguage();
  
  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          setLoading(true);
          const fetchedPost = await fetchBlogPostBySlug(slug);
          if (fetchedPost) {
            setPost(fetchedPost);
          } else {
            toast.error("Blog post not found");
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
          toast.error("Failed to load blog post");
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
  }, [slug]);

  useEffect(() => {
    // Scroll to top when component mounts or slug changes
    window.scrollTo(0, 0);
  }, [slug]);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
        <Footer />
      </div>
    );
  }
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">Post not found</h2>
          <Link to="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the translated title and content based on current language
  const title = translateContent(post, 'title', language);
  const content = translateContent(post, 'content', language);
  const excerpt = translateContent(post, 'excerpt', language);

  // For debugging - log the content lengths
  console.log(`Language: ${language}`);
  console.log(`Original content length: ${post.content.length}`);
  if (language !== 'en' && post.translations && post.translations[language]) {
    console.log(`${language} content length: ${post.translations[language]?.content?.length || 0}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Button>
          </Link>
          
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6">{title}</h1>
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="font-medium">{post.author}</p>
                  <p className="text-sm text-gray-500">{post.date} · {post.readTime}</p>
                </div>
                
                <div>
                  <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                    {post.category}
                  </span>
                </div>
              </div>
              
              {post.image && (
                <div className="rounded-xl overflow-hidden mb-8">
                  <img 
                    src={post.image} 
                    alt={title}
                    className="w-full h-auto object-cover"
                  />
                </div>
              )}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags && post.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { fetchBlogPostById } from "@/services/blogService";
import { BlogPost as BlogPostType } from "@/types/blog";
import { useLanguage } from "@/context/LanguageContext";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, translateContent } = useLanguage();
  
  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        try {
          const fetchedPost = await fetchBlogPostById(id);
          if (fetchedPost) {
            setPost(fetchedPost);
          }
        } catch (error) {
          console.error("Error fetching blog post:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!post) {
    return <div>Post not found</div>;
  }

  const title = translateContent(post, 'title', language);
  const content = translateContent(post, 'content', language);

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
              <h1 className="text-4xl md:text-5xl font-bold font-heading mb-6 text-justify">{title}</h1>
              
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
            
            <div className="prose prose-lg max-w-none text-justify">
              <div dangerouslySetInnerHTML={{ __html: content }} />
            </div>
            
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag, index) => (
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

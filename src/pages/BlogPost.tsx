
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogPostById } from "@/services/blogService";
import { BlogPost as BlogPostType } from "@/types/blog";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CalendarIcon, Clock, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const BlogPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (id) {
      const blogPost = getBlogPostById(parseInt(id));
      if (blogPost) {
        setPost(blogPost);
      } else {
        navigate("/blog");
      }
    }
  }, [id, navigate]);

  if (!post) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center"
            onClick={() => navigate("/blog")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("blog.backToBlog")}
          </Button>
          
          <article>
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-6">
                <span className="inline-flex items-center">
                  <User className="mr-1 h-4 w-4" />
                  {post.author}
                </span>
                <span className="inline-flex items-center">
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  {post.date}
                </span>
                <span className="inline-flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {post.readTime}
                </span>
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-800 text-xs font-medium">
                  {post.category}
                </span>
              </div>
            </div>
            
            <div className="rounded-xl overflow-hidden mb-8 h-80">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg text-gray-700 mb-6">{post.excerpt}</p>
              
              {post.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-700 mb-4">{paragraph}</p>
              ))}
            </div>
          </article>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BlogPost;

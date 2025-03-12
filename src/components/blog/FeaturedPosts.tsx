
import { BlogPost } from "@/types/blog";
import { CalendarIcon, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import EditableText from "@/components/admin/EditableText";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const featuredPosts = posts.filter(post => post.featured);
  
  // Get the correct translated posts based on current language
  const translatedFeaturedPosts = featuredPosts.map(post => {
    // If post has translations and has one for current language
    if (post.translations && post.translations[language]) {
      return {
        ...post,
        title: post.translations[language].title || post.title,
        excerpt: post.translations[language].excerpt || post.excerpt,
        content: post.translations[language].content || post.content
      };
    }
    return post;
  });
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isAuthenticated ? (
          <EditableText 
            id="blog-featured-title"
            defaultText={t("blog.featured")}
          />
        ) : (
          t("blog.featured")
        )}
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {translatedFeaturedPosts.map((post) => (
          <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <Link to={`/blog/${post.slug}`} className="block h-64 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                  {post.category}
                </span>
              </div>
              <Link to={`/blog/${post.slug}`} className="block">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {isAuthenticated ? (
                    <EditableText 
                      id={`blog-featured-title-${post.id}`}
                      defaultText={post.title}
                    />
                  ) : (
                    post.title
                  )}
                </h3>
              </Link>
              <p className="text-gray-600 mb-4">
                {isAuthenticated ? (
                  <EditableText 
                    id={`blog-featured-excerpt-${post.id}`}
                    defaultText={post.excerpt}
                  />
                ) : (
                  post.excerpt
                )}
              </p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm text-gray-500">
                  <User className="mr-1 h-4 w-4" />
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <CalendarIcon className="mr-1 h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="mr-1 h-4 w-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedPosts;


import { BlogPost } from "@/types/blog";
import { CalendarIcon, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface FeaturedPostsProps {
  posts: BlogPost[];
}

const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="mb-16">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t("blog.featured")}</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {posts.filter(post => post.featured).map((post) => (
          <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="h-64 overflow-hidden">
              <img 
                src={post.image} 
                alt={post.title} 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <div className="flex items-center mb-3">
                <span className="text-xs font-medium px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
                  {post.category}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
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

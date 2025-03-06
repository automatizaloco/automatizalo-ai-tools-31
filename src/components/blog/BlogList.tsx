
import { BlogPost } from "@/types/blog";
import { CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList = ({ posts }: BlogListProps) => {
  const { t } = useLanguage();
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">{t("blog.all")}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
            <div className="h-48 overflow-hidden">
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                {post.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <Clock className="mr-1 h-3 w-3" />
                <span>{post.readTime}</span>
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-between px-4 py-2 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-colors"
              >
                <span>{t("blog.readMore")}</span>
                <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;

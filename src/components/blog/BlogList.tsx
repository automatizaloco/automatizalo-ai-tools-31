
import { BlogPost } from "@/types/blog";
import { CalendarIcon, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";

interface BlogListProps {
  posts: BlogPost[];
}

const BlogList = ({ posts }: BlogListProps) => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  // Función para obtener contenido traducido
  const getTranslatedContent = (post: BlogPost, field: 'title' | 'excerpt') => {
    // Si el idioma es inglés, devolver el contenido original
    if (language === 'en') {
      return post[field];
    }
    
    // Si hay traducciones disponibles para el idioma actual
    if (post.translations && post.translations[language as 'fr' | 'es']) {
      const translation = post.translations[language as 'fr' | 'es'];
      if (translation && translation[field] && translation[field].trim() !== '') {
        return translation[field];
      }
    }
    
    // Fallback al contenido original si no hay traducción
    return post[field];
  };
  
  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {isAuthenticated ? (
          <EditableText 
            id="blog-all-title"
            defaultText={t("blog.all")}
          />
        ) : (
          t("blog.all")
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => {
          const translatedTitle = getTranslatedContent(post, 'title');
          const translatedExcerpt = getTranslatedContent(post, 'excerpt');
          
          return (
            <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
              <Link to={`/blog/${post.slug}`} className="block h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={translatedTitle} 
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                    {isAuthenticated ? (
                      <EditableText 
                        id={`blog-title-${post.id}`}
                        defaultText={translatedTitle}
                      />
                    ) : (
                      translatedTitle
                    )}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                  {isAuthenticated ? (
                    <EditableText 
                      id={`blog-excerpt-${post.id}`}
                      defaultText={translatedExcerpt}
                    />
                  ) : (
                    translatedExcerpt
                  )}
                </p>
                <div className="flex items-center text-xs text-gray-500 mb-4">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  <Clock className="mr-1 h-3 w-3" />
                  <span>{post.readTime}</span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between px-4 py-2 border border-gray-200 hover:bg-gray-100 hover:text-gray-800 hover:border-gray-300 transition-colors"
                  >
                    <span>
                      {isAuthenticated ? (
                        <EditableText 
                          id="blog-readmore-button"
                          defaultText={t("blog.readMore")}
                        />
                      ) : (
                        t("blog.readMore")
                      )}
                    </span>
                    <ArrowRight size={16} />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlogList;

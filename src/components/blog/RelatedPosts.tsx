
import { BlogPost } from "@/types/blog";
import { CalendarIcon, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface RelatedPostsProps {
  currentPost: BlogPost;
  allPosts: BlogPost[];
}

const RelatedPosts = ({ currentPost, allPosts }: RelatedPostsProps) => {
  const { t, language } = useLanguage();

  // Función para obtener 3 posts aleatorios (excluyendo el post actual)
  const getRandomPosts = () => {
    const otherPosts = allPosts.filter(post => post.id !== currentPost.id);
    
    // Si hay 3 o menos posts, devolver todos
    if (otherPosts.length <= 3) {
      return otherPosts;
    }
    
    // Mezclar aleatoriamente y tomar los primeros 3
    const shuffled = [...otherPosts].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const relatedPosts = getRandomPosts();

  // Si no hay otros posts disponibles, no mostrar la sección
  if (relatedPosts.length === 0) {
    return null;
  }

  // Función para obtener contenido traducido
  const getTranslatedContent = (post: BlogPost, field: 'title' | 'excerpt') => {
    if (language === 'en') return post[field];
    if (language === 'es' && post.translations?.es?.[field]) return post.translations.es[field];
    if (language === 'fr' && post.translations?.fr?.[field]) return post.translations.fr[field];
    return post[field]; // fallback to English
  };

  return (
    <div className="mt-16 pt-8 border-t border-gray-200">
      <h3 className="text-2xl font-bold mb-8">{t('blog.relatedPosts')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {relatedPosts.map((post) => (
          <div key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-300">
            <Link to={`/blog/${post.slug}`} className="block h-40 overflow-hidden">
              <img 
                src={post.image} 
                alt={getTranslatedContent(post, 'title')}
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
              />
            </Link>
            <div className="p-4">
              <div className="flex items-center mb-2">
                <span className="text-xs font-medium px-2 py-1 bg-gray-100 text-gray-800 rounded-full">
                  {post.category}
                </span>
              </div>
              <Link to={`/blog/${post.slug}`} className="block">
                <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-gray-700 transition-colors">
                  {getTranslatedContent(post, 'title')}
                </h4>
              </Link>
              <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                {getTranslatedContent(post, 'excerpt')}
              </p>
              <div className="flex items-center text-xs text-gray-500">
                <CalendarIcon className="mr-1 h-3 w-3" />
                <span>{post.date}</span>
                <span className="mx-2">•</span>
                <Clock className="mr-1 h-3 w-3" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;

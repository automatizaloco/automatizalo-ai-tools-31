
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";

const BlogHero = () => {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
        {isAuthenticated ? (
          <EditableText 
            id="blog-title"
            defaultText={t("blog.title")}
          />
        ) : (
          t("blog.title")
        )}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {isAuthenticated ? (
          <EditableText 
            id="blog-subtitle"
            defaultText={t("blog.subtitle")}
          />
        ) : (
          t("blog.subtitle")
        )}
      </p>
    </div>
  );
};

export default BlogHero;

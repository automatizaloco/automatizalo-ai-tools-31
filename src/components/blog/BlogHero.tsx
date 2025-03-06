
import { useLanguage } from "@/context/LanguageContext";

const BlogHero = () => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center mb-16">
      <h1 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">
        {t("blog.title")}
      </h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        {t("blog.subtitle")}
      </p>
    </div>
  );
};

export default BlogHero;

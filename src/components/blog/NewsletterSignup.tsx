
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";

const NewsletterSignup = () => {
  const { t } = useLanguage();
  
  return (
    <div className="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
          {t("blog.newsletter.title")}
        </h2>
        <p className="text-gray-600 mb-6">
          {t("blog.newsletter.subtitle")}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            placeholder={t("blog.newsletter.placeholder")}
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
          />
          <Button className="bg-gray-900 hover:bg-gray-800">
            {t("blog.newsletter.button")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;


import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";

const ContactHeader = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  return (
    <div className="text-center mb-16">
      <h1 className={`text-4xl font-heading font-bold mb-4 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
        {isAuthenticated ? (
          <EditableText 
            id="contact-title"
            defaultText={t('contact.title')}
          />
        ) : (
          t('contact.title')
        )}
      </h1>
      <p className={`text-lg max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        {isAuthenticated ? (
          <EditableText 
            id="contact-subtitle"
            defaultText={t('contact.subtitle')}
          />
        ) : (
          t('contact.subtitle')
        )}
      </p>
    </div>
  );
};

export default ContactHeader;

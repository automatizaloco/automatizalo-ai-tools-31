import { Phone, Mail, MapPin, Globe } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";
import { useContactInfo } from "@/stores/contactInfoStore";

interface ContactInfoProps {
  handleContactInfoChange: (id: string, value: string) => void;
}

const ContactInfo = ({ handleContactInfoChange }: ContactInfoProps) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { contactInfo, updating } = useContactInfo();

  return (
    <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        {t('contact.title')}
      </h2>
      
      <div className="space-y-6">
        <InfoItem
          icon={<Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.phone')}
          value={contactInfo.phone}
          id="phone"
          isAuthenticated={isAuthenticated}
          onChange={handleContactInfoChange}
          isDisabled={updating}
          theme={theme}
        />
        
        <InfoItem
          icon={<Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.email')}
          value={contactInfo.email}
          id="email"
          isAuthenticated={isAuthenticated}
          onChange={handleContactInfoChange}
          isDisabled={updating}
          theme={theme}
        />
        
        <InfoItem
          icon={<MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.address')}
          value={contactInfo.address}
          id="address"
          isAuthenticated={isAuthenticated}
          onChange={handleContactInfoChange}
          isDisabled={updating}
          theme={theme}
        />
        
        <InfoItem
          icon={<Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.website')}
          value={contactInfo.website}
          id="website"
          isAuthenticated={isAuthenticated}
          onChange={handleContactInfoChange}
          isDisabled={updating}
          theme={theme}
        />
      </div>
    </div>
  );
};

interface InfoItemProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  id: string;
  isAuthenticated: boolean;
  onChange: (id: string, value: string) => void;
  isDisabled?: boolean;
  theme: string;
}

const InfoItem = ({ icon, title, value, id, isAuthenticated, onChange, isDisabled, theme }: InfoItemProps) => (
  <div className="flex items-start">
    <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
      {icon}
    </div>
    <div>
      <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        {title}
      </h3>
      <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
        {isAuthenticated ? (
          <EditableText 
            id={id}
            defaultText={value}
            onSave={(value) => onChange(id, value)}
            disabled={isDisabled}
          />
        ) : (
          value
        )}
      </p>
    </div>
  </div>
);

export default ContactInfo;

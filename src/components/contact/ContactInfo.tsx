
import { Phone, Mail, MapPin, Globe, Save, X, Edit } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useContactInfo, ContactInfo as ContactInfoType } from "@/stores/contactInfoStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const ContactInfo = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { contactInfo, updateContactInfo, loading } = useContactInfo();
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ContactInfoType>({
    phone: contactInfo.phone,
    email: contactInfo.email,
    address: contactInfo.address,
    website: contactInfo.website
  });

  const handleInputChange = (field: keyof ContactInfoType, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateContactInfo(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving contact info:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      phone: contactInfo.phone,
      email: contactInfo.email,
      address: contactInfo.address,
      website: contactInfo.website
    });
    setIsEditing(false);
  };

  return (
    <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-heading font-semibold ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
          {t('contact.title')}
        </h2>
        
        {isAuthenticated && (
          <div>
            {isEditing ? (
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit All
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-6">
        <InfoItem
          icon={<Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.phone')}
          value={contactInfo.phone}
          id="phone"
          isEditing={isEditing && isAuthenticated}
          onChange={(value) => handleInputChange('phone', value)}
          currentValue={formData.phone}
          isDisabled={loading}
          theme={theme}
        />
        
        <InfoItem
          icon={<Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.email')}
          value={contactInfo.email}
          id="email"
          isEditing={isEditing && isAuthenticated}
          onChange={(value) => handleInputChange('email', value)}
          currentValue={formData.email}
          isDisabled={loading}
          theme={theme}
        />
        
        <InfoItem
          icon={<MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.address')}
          value={contactInfo.address}
          id="address"
          isEditing={isEditing && isAuthenticated}
          onChange={(value) => handleInputChange('address', value)}
          currentValue={formData.address}
          isDisabled={loading}
          theme={theme}
        />
        
        <InfoItem
          icon={<Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />}
          title={t('contact.website')}
          value={contactInfo.website || ''}
          id="website"
          isEditing={isEditing && isAuthenticated}
          onChange={(value) => handleInputChange('website', value)}
          currentValue={formData.website || ''}
          isDisabled={loading}
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
  isEditing: boolean;
  onChange: (value: string) => void;
  currentValue: string;
  isDisabled?: boolean;
  theme: string;
}

const InfoItem = ({ 
  icon, 
  title, 
  value, 
  id, 
  isEditing,
  onChange,
  currentValue,
  isDisabled,
  theme 
}: InfoItemProps) => (
  <div className="flex items-start">
    <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
      {icon}
    </div>
    <div className="flex-1">
      <Label htmlFor={id} className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
        {title}
      </Label>
      {isEditing ? (
        <Input
          id={id}
          value={currentValue}
          onChange={(e) => onChange(e.target.value)}
          disabled={isDisabled}
          className="mt-1"
        />
      ) : (
        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
          {value}
        </p>
      )}
    </div>
  </div>
);

export default ContactInfo;


import { useState } from "react";
import { Phone, Mail, MapPin, Globe, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import EditableText from "@/components/admin/EditableText";
import { useContactInfo } from "@/stores/contactInfoStore";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";

const Contact = () => {
  const { t } = useLanguage();
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  const { contactInfo, updateContactInfo } = useContactInfo();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleContactInfoChange = (id: string, value: string) => {
    const fieldMap: Record<string, keyof typeof contactInfo> = {
      'contact-phone-value': 'phone',
      'contact-email-value': 'email',
      'contact-address-value': 'address',
      'contact-website-value': 'website'
    };
    
    if (id in fieldMap) {
      updateContactInfo({ [fieldMap[id]]: value });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: formData
      });

      if (error) throw error;

      toast.success(t('contact.form.success') || "Message sent successfully!");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('contact.form.error') || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Title section */}
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Info Section */}
            <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {t('contact.info')}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Phone className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {t('contact.phone')}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-phone-value"
                          defaultText={contactInfo.phone}
                          onSave={(value) => handleContactInfoChange('contact-phone-value', value)}
                        />
                      ) : (
                        contactInfo.phone
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Mail className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {t('contact.email')}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-email-value"
                          defaultText={contactInfo.email}
                          onSave={(value) => handleContactInfoChange('contact-email-value', value)}
                        />
                      ) : (
                        contactInfo.email
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <MapPin className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {t('contact.address')}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-address-value"
                          defaultText={contactInfo.address}
                          onSave={(value) => handleContactInfoChange('contact-address-value', value)}
                        />
                      ) : (
                        contactInfo.address
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className={`p-3 rounded-full mr-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <Globe className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                      {t('contact.website')}
                    </h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      {isAuthenticated ? (
                        <EditableText 
                          id="contact-website-value"
                          defaultText={contactInfo.website}
                          onSave={(value) => handleContactInfoChange('contact-website-value', value)}
                        />
                      ) : (
                        contactInfo.website
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Contact Form Section */}
            <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
              <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
                {t('contact.form.title')}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label 
                    htmlFor="name" 
                    className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('contact.form.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="email" 
                    className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('contact.form.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="subject" 
                    className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('contact.form.subject')}
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                
                <div>
                  <label 
                    htmlFor="message" 
                    className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {t('contact.form.message')}
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      theme === 'dark' 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Contact;

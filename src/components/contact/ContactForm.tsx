
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { LoaderCircle } from "lucide-react";

const ContactForm = () => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsSubmitting(true);

    try {
      console.log("Submitting form data:", formData);
      
      const { data, error } = await supabase.functions.invoke('contact-form', {
        body: formData
      });

      if (error) {
        console.error('Error submitting form:', error);
        throw error;
      }

      console.log("Form submission successful:", data);
      toast.success(t('contact.form.success') || "Message sent successfully!");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(t('contact.form.error') || "Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFormThemeClasses = () => 
    theme === 'dark' 
      ? 'bg-gray-800 border-gray-700 text-white' 
      : 'bg-white border-gray-300 text-gray-800';

  return (
    <div className={`p-8 rounded-2xl shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
      <h2 className={`text-2xl font-heading font-semibold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-800'}`}>
        {t('contact.form.title') || "Send us a message"}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField
          id="name"
          name="name"
          type="text"
          label={t('contact.form.name') || "Your Name"}
          value={formData.name}
          onChange={handleChange}
          theme={theme}
          required
        />
        
        <FormField
          id="email"
          name="email"
          type="email"
          label={t('contact.form.email') || "Your Email"}
          value={formData.email}
          onChange={handleChange}
          theme={theme}
          required
        />
        
        <FormField
          id="subject"
          name="subject"
          type="text"
          label={t('contact.form.subject') || "Subject"}
          value={formData.subject}
          onChange={handleChange}
          theme={theme}
          required
        />
        
        <div>
          <label 
            htmlFor="message" 
            className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
          >
            {t('contact.form.message') || "Message"}
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
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {t('contact.form.submitting') || "Sending..."}
            </span>
          ) : (
            t('contact.form.submit') || "Send Message"
          )}
        </Button>
      </form>
    </div>
  );
};

interface FormFieldProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  theme: string;
  required?: boolean;
}

const FormField = ({ id, name, type, label, value, onChange, theme, required }: FormFieldProps) => (
  <div>
    <label 
      htmlFor={id}
      className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className={`w-full px-4 py-2 rounded-lg border ${
        theme === 'dark' 
          ? 'bg-gray-700 border-gray-600 text-white' 
          : 'border-gray-300'
      } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
    />
  </div>
);

export default ContactForm;

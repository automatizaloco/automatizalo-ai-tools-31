
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { subscribeToNewsletter, NewsletterFrequency } from "@/services/newsletterService";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const NewsletterSignup = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<NewsletterFrequency>("weekly");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      return;
    }
    
    setIsSubmitting(true);
    try {
      await subscribeToNewsletter(email, frequency);
      setEmail(""); // Clear form on success
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="mt-16 bg-gray-50 rounded-2xl p-8 lg:p-12">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-2xl lg:text-3xl font-semibold text-gray-900 mb-4">
          {t("blog.newsletter.title")}
        </h2>
        <p className="text-gray-600 mb-6">
          {t("blog.newsletter.subtitle")}
        </p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col gap-4">
            <div>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("blog.newsletter.placeholder")}
                className="flex-grow px-4 py-3 rounded-lg"
                required
              />
            </div>
            
            <div className="flex justify-center">
              <RadioGroup 
                value={frequency} 
                onValueChange={(value) => setFrequency(value as NewsletterFrequency)}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="weekly" id="weekly" />
                  <Label htmlFor="weekly">Weekly</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="monthly" id="monthly" />
                  <Label htmlFor="monthly">Monthly</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="bg-gray-900 hover:bg-gray-800"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Subscribing...' : t("blog.newsletter.button")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignup;

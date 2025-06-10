
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { subscribeToNewsletter } from '@/services/newsletterService';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error(t('blog.newsletter.error'));
      return;
    }

    setIsLoading(true);
    
    try {
      await subscribeToNewsletter(email, 'weekly');
      toast.success(t('blog.newsletter.success'));
      setEmail('');
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      toast.error(t('blog.newsletter.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
          {isAuthenticated ? (
            <EditableText 
              id="newsletter-title"
              defaultText={t('blog.newsletter.title')}
            />
          ) : (
            t('blog.newsletter.title')
          )}
        </h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          {isAuthenticated ? (
            <EditableText 
              id="newsletter-subtitle"
              defaultText={t('blog.newsletter.subtitle')}
            />
          ) : (
            t('blog.newsletter.subtitle')
          )}
        </p>
        
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <Input
            type="email"
            placeholder={t('blog.newsletter.placeholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 bg-white text-gray-900"
            required
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="bg-white text-blue-600 hover:bg-gray-100 whitespace-nowrap"
          >
            {isLoading ? '...' : t('blog.newsletter.button')}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default NewsletterSignup;

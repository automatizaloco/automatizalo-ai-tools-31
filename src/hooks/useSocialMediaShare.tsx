
import { useState } from 'react';
import { toast } from 'sonner';
import { BlogPost } from '@/types/blog';
import { useWebhookStore } from '@/stores/webhookStore';

export const useSocialMediaShare = () => {
  const [isSharing, setIsSharing] = useState(false);

  const shareToSocialMedia = async (post: BlogPost): Promise<boolean> => {
    try {
      setIsSharing(true);
      console.log("Starting social media share process");
      
      // Get fresh values directly from the store to ensure we have the latest values
      const webhookStore = useWebhookStore.getState();
      const webhookUrl = webhookStore.getActiveBlogSocialShareUrl();
      const method = webhookStore.getActiveBlogSocialShareMethod();
      const websiteDomain = webhookStore.getWebsiteDomain();
      
      console.log("Using webhook URL:", webhookUrl);
      console.log("Using method:", method);
      console.log("Using website domain:", websiteDomain);

      if (!webhookUrl) {
        toast.error("Social media webhook URL not configured");
        return false;
      }

      const postData = {
        title: post.title,
        slug: post.slug,
        url: `${websiteDomain}/blog/${post.slug}`,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image,
        category: post.category,
        tags: post.tags?.join(','),
        author: post.author,
        readTime: post.readTime
      };

      toast.info("Sending to social media webhook...");

      if (method === 'GET') {
        const params = new URLSearchParams();
        Object.entries(postData).forEach(([key, value]) => {
          if (value) params.append(key, value as string);
        });
        
        const urlWithParams = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}${params.toString()}`;
        console.log("Making GET request to:", urlWithParams);
        
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          toast.success("Post shared to social media successfully");
          return true;
        } else {
          throw new Error(`HTTP error: ${response.status}`);
        }
      } else {
        console.log("Making POST request to:", webhookUrl);
        console.log("With payload:", postData);
        
        const response = await fetch(webhookUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData),
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          toast.success("Post shared to social media successfully");
          return true;
        } else {
          throw new Error(`HTTP error: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Error sharing to social media:", error);
      toast.error(`Failed to share to social media: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return false;
    } finally {
      setIsSharing(false);
    }
  };

  return { shareToSocialMedia, isSharing };
};

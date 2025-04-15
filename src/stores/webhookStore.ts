
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WebhookMode = "test" | "production";
export type RequestMethod = "POST" | "GET";

interface WebhookState {
  // Blog post creation webhook
  blogCreationUrl: {
    test: string;
    production: string;
    mode: WebhookMode;
    method: RequestMethod;
  };
  // Blog status change webhook (social media)
  blogSocialShareUrl: {
    test: string;
    production: string;
    mode: WebhookMode;
    method: RequestMethod;
  };
  // Website domain for correct link generation
  websiteDomain: string;
  
  // Actions
  updateBlogCreationUrl: (params: { 
    test?: string; 
    production?: string;
    mode?: WebhookMode;
    method?: RequestMethod;
  }) => void;
  updateBlogSocialShareUrl: (params: { 
    test?: string; 
    production?: string;
    mode?: WebhookMode;
    method?: RequestMethod;
  }) => void;
  updateWebsiteDomain: (domain: string) => void;
  
  // Helper to get active URLs
  getActiveBlogCreationUrl: () => string;
  getActiveBlogSocialShareUrl: () => string;
  
  // Helper to get active request methods
  getActiveBlogCreationMethod: () => RequestMethod;
  getActiveBlogSocialShareMethod: () => RequestMethod;
  
  // Helper to get website domain
  getWebsiteDomain: () => string;
  
  // Helper to check if webhooks are configured
  isBlogSocialShareConfigured: () => boolean;
  isBlogCreationConfigured: () => boolean;
}

export const useWebhookStore = create<WebhookState>()(
  persist(
    (set, get) => ({
      blogCreationUrl: {
        test: "https://n8n.automatizalo.co/webhook/admin/blog/create",
        production: "https://n8n.automatizalo.co/webhook/admin/blog/create",
        mode: "production" as WebhookMode,
        method: "POST" as RequestMethod
      },
      blogSocialShareUrl: {
        test: "https://n8n.automatizalo.co/webhook-test/blog-redes",
        production: "https://n8n.automatizalo.co/webhook/blog-redes",
        mode: "test" as WebhookMode,
        method: "GET" as RequestMethod
      },
      websiteDomain: "https://automatizalo.co",
      
      updateBlogCreationUrl: (params) => {
        console.log("Updating blog creation URL with params:", params);
        set((state) => {
          // Create a new object with the updated values to trigger state change
          const updatedCreationUrl = {
            ...state.blogCreationUrl,
            ...(params.test !== undefined ? { test: params.test } : {}),
            ...(params.production !== undefined ? { production: params.production } : {}),
            ...(params.mode !== undefined ? { mode: params.mode } : {}),
            ...(params.method !== undefined ? { method: params.method } : {})
          };
          
          console.log("New blog creation URL state:", updatedCreationUrl);
          
          return {
            blogCreationUrl: updatedCreationUrl
          };
        });
      },
        
      updateBlogSocialShareUrl: (params) => {
        console.log("Updating blog social share URL with params:", params);
        set((state) => {
          // Create a new object with the updated values to trigger state change
          const updatedSocialShareUrl = {
            ...state.blogSocialShareUrl,
            ...(params.test !== undefined ? { test: params.test } : {}),
            ...(params.production !== undefined ? { production: params.production } : {}),
            ...(params.mode !== undefined ? { mode: params.mode } : {}),
            ...(params.method !== undefined ? { method: params.method } : {})
          };
          
          console.log("New blog social share URL state:", updatedSocialShareUrl);
          
          return {
            blogSocialShareUrl: updatedSocialShareUrl
          };
        });
      },
      
      updateWebsiteDomain: (domain) => {
        console.log("Updating website domain to:", domain);
        set({ websiteDomain: domain });
      },
      
      getActiveBlogCreationUrl: () => {
        const { blogCreationUrl } = get();
        return blogCreationUrl.mode === "production" 
          ? blogCreationUrl.production 
          : blogCreationUrl.test;
      },
      
      getActiveBlogSocialShareUrl: () => {
        const { blogSocialShareUrl } = get();
        return blogSocialShareUrl.mode === "production" 
          ? blogSocialShareUrl.production 
          : blogSocialShareUrl.test;
      },
      
      getActiveBlogCreationMethod: () => {
        const { blogCreationUrl } = get();
        return blogCreationUrl.method;
      },
      
      getActiveBlogSocialShareMethod: () => {
        const { blogSocialShareUrl } = get();
        return blogSocialShareUrl.method;
      },
      
      getWebsiteDomain: () => {
        const { websiteDomain } = get();
        return websiteDomain;
      },
      
      isBlogSocialShareConfigured: () => {
        const { blogSocialShareUrl } = get();
        const activeUrl = blogSocialShareUrl.mode === "production" 
          ? blogSocialShareUrl.production 
          : blogSocialShareUrl.test;
        return !!activeUrl && activeUrl.trim() !== '';
      },
      
      isBlogCreationConfigured: () => {
        const { blogCreationUrl } = get();
        const activeUrl = blogCreationUrl.mode === "production" 
          ? blogCreationUrl.production 
          : blogCreationUrl.test;
        return !!activeUrl && activeUrl.trim() !== '';
      }
    }),
    {
      name: "webhook-settings-v2", // Changed name to force new storage
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            console.log(`Retrieved webhook settings from localStorage: ${name}`, value);
            return value ? JSON.parse(value) : null;
          } catch (e) {
            console.error('Error retrieving persistent state from localStorage', e);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            console.log(`Storing webhook settings to localStorage: ${name}`, value);
            localStorage.setItem(name, JSON.stringify(value));
          } catch (e) {
            console.error('Error storing persistent state to localStorage', e);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (e) {
            console.error('Error removing persistent state from localStorage', e);
          }
        },
      },
      version: 2, // Increased version number
    }
  )
);

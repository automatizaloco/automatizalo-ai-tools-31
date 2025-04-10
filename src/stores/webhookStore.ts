
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
      
      updateBlogCreationUrl: (params) => 
        set((state) => ({
          blogCreationUrl: {
            ...state.blogCreationUrl,
            ...params
          }
        })),
        
      updateBlogSocialShareUrl: (params) => 
        set((state) => ({
          blogSocialShareUrl: {
            ...state.blogSocialShareUrl,
            ...params
          }
        })),
      
      updateWebsiteDomain: (domain) => 
        set(() => ({
          websiteDomain: domain
        })),
      
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
      name: "webhook-settings",
    }
  )
);

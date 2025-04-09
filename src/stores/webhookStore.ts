
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
  
  // Helper to get active URLs
  getActiveBlogCreationUrl: () => string;
  getActiveBlogSocialShareUrl: () => string;
  
  // Helper to get active request methods
  getActiveBlogCreationMethod: () => RequestMethod;
  getActiveBlogSocialShareMethod: () => RequestMethod;
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
        method: "GET" as RequestMethod  // Changed to GET based on error in console logs
      },
      
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
      }
    }),
    {
      name: "webhook-settings",
    }
  )
);

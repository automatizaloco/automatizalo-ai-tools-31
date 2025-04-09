
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WebhookMode = "test" | "production";

interface WebhookState {
  // Blog post creation webhook
  blogCreationUrl: {
    test: string;
    production: string;
    mode: WebhookMode;
  };
  // Blog status change webhook (social media)
  blogSocialShareUrl: {
    test: string;
    production: string;
    mode: WebhookMode;
  };
  
  // Actions
  updateBlogCreationUrl: (params: { 
    test?: string; 
    production?: string;
    mode?: WebhookMode;
  }) => void;
  updateBlogSocialShareUrl: (params: { 
    test?: string; 
    production?: string;
    mode?: WebhookMode;
  }) => void;
  
  // Helper to get active URLs
  getActiveBlogCreationUrl: () => string;
  getActiveBlogSocialShareUrl: () => string;
}

export const useWebhookStore = create<WebhookState>()(
  persist(
    (set, get) => ({
      blogCreationUrl: {
        test: "https://n8n.automatizalo.co/webhook/admin/blog/create",
        production: "https://n8n.automatizalo.co/webhook/admin/blog/create",
        mode: "production" as WebhookMode
      },
      blogSocialShareUrl: {
        test: "https://n8n.automatizalo.co/webhook-test/blog-redes",
        production: "https://n8n.automatizalo.co/webhook/blog-redes",
        mode: "test" as WebhookMode
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
      }
    }),
    {
      name: "webhook-settings",
    }
  )
);

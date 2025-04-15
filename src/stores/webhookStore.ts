import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";

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
  }) => Promise<void>;
  updateBlogSocialShareUrl: (params: { 
    test?: string; 
    production?: string;
    mode?: WebhookMode;
    method?: RequestMethod;
  }) => Promise<void>;
  updateWebsiteDomain: (domain: string) => Promise<void>;
  
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

  // Initialize store from Supabase
  initializeFromSupabase: () => Promise<void>;
}

export const useWebhookStore = create<WebhookState>()((set, get) => ({
  blogCreationUrl: {
    test: "",
    production: "",
    mode: "production",
    method: "POST"
  },
  blogSocialShareUrl: {
    test: "",
    production: "",
    mode: "test",
    method: "GET"
  },
  websiteDomain: "",
  
  initializeFromSupabase: async () => {
    try {
      const { data: configs, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching webhook configs:', error);
        return;
      }

      if (configs) {
        set({
          blogCreationUrl: {
            test: configs.blog_creation_test_url,
            production: configs.blog_creation_prod_url,
            mode: configs.blog_creation_mode,
            method: configs.blog_creation_method
          },
          blogSocialShareUrl: {
            test: configs.blog_social_test_url,
            production: configs.blog_social_prod_url,
            mode: configs.blog_social_mode,
            method: configs.blog_social_method
          },
          websiteDomain: configs.website_domain
        });
      }
    } catch (error) {
      console.error('Error initializing webhook store:', error);
    }
  },
  
  updateBlogCreationUrl: async (params) => {
    console.log("Updating blog creation URL with params:", params);
    
    const currentState = get();
    const updatedBlogCreationUrl = {
      ...currentState.blogCreationUrl,
      ...(params.test !== undefined ? { test: params.test } : {}),
      ...(params.production !== undefined ? { production: params.production } : {}),
      ...(params.mode !== undefined ? { mode: params.mode } : {}),
      ...(params.method !== undefined ? { method: params.method } : {})
    };

    // Update local state
    set({ blogCreationUrl: updatedBlogCreationUrl });

    // Update Supabase
    const { error } = await supabase
      .from('webhook_configs')
      .update({
        blog_creation_test_url: updatedBlogCreationUrl.test,
        blog_creation_prod_url: updatedBlogCreationUrl.production,
        blog_creation_mode: updatedBlogCreationUrl.mode,
        blog_creation_method: updatedBlogCreationUrl.method
      })
      .eq('id', (await supabase.from('webhook_configs').select('id').single()).data?.id);

    if (error) {
      console.error('Error updating blog creation URL:', error);
    }
  },
    
  updateBlogSocialShareUrl: async (params) => {
    console.log("Updating blog social share URL with params:", params);
    
    const currentState = get();
    const updatedBlogSocialShareUrl = {
      ...currentState.blogSocialShareUrl,
      ...(params.test !== undefined ? { test: params.test } : {}),
      ...(params.production !== undefined ? { production: params.production } : {}),
      ...(params.mode !== undefined ? { mode: params.mode } : {}),
      ...(params.method !== undefined ? { method: params.method } : {})
    };

    // Update local state
    set({ blogSocialShareUrl: updatedBlogSocialShareUrl });

    // Update Supabase
    const { error } = await supabase
      .from('webhook_configs')
      .update({
        blog_social_test_url: updatedBlogSocialShareUrl.test,
        blog_social_prod_url: updatedBlogSocialShareUrl.production,
        blog_social_mode: updatedBlogSocialShareUrl.mode,
        blog_social_method: updatedBlogSocialShareUrl.method
      })
      .eq('id', (await supabase.from('webhook_configs').select('id').single()).data?.id);

    if (error) {
      console.error('Error updating blog social share URL:', error);
    }
  },
  
  updateWebsiteDomain: async (domain) => {
    console.log("Updating website domain to:", domain);
    
    // Update local state
    set({ websiteDomain: domain });

    // Update Supabase
    const { error } = await supabase
      .from('webhook_configs')
      .update({ website_domain: domain })
      .eq('id', (await supabase.from('webhook_configs').select('id').single()).data?.id);

    if (error) {
      console.error('Error updating website domain:', error);
    }
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
}));

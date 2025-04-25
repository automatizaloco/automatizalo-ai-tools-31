
import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

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
  // Flag to track if store has been initialized
  isInitialized: boolean;
  // Config ID from database
  configId: string | null;
  
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
  isInitialized: false,
  configId: null,
  
  initializeFromSupabase: async () => {
    try {
      // Skip if already initialized
      if (get().isInitialized && get().configId) {
        console.log('Webhook store already initialized');
        return;
      }
      
      console.log('Initializing webhook store from Supabase');
      
      const { data: configs, error } = await supabase
        .from('webhook_configs')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching webhook configs:', error);
        
        // If no configs exist, create a default one
        if (error.code === 'PGRST116') {
          console.log('No webhook configs found, creating default');
          
          const { data: newConfig, error: insertError } = await supabase
            .from('webhook_configs')
            .insert({
              blog_creation_test_url: 'https://webhook.site/your-test-webhook',
              blog_creation_prod_url: 'https://webhook.site/your-production-webhook',
              blog_social_test_url: 'https://webhook.site/your-test-social-webhook',
              blog_social_prod_url: 'https://webhook.site/your-production-social-webhook',
              website_domain: 'https://automatizalo.co',
              blog_creation_mode: 'production',
              blog_social_mode: 'test',
              blog_creation_method: 'POST',
              blog_social_method: 'GET'
            })
            .select()
            .single();
          
          if (insertError) {
            console.error('Error creating default webhook config:', insertError);
            return;
          }
          
          if (newConfig) {
            console.log('Created default webhook config:', newConfig);
            set({
              blogCreationUrl: {
                test: newConfig.blog_creation_test_url,
                production: newConfig.blog_creation_prod_url,
                mode: newConfig.blog_creation_mode,
                method: newConfig.blog_creation_method
              },
              blogSocialShareUrl: {
                test: newConfig.blog_social_test_url,
                production: newConfig.blog_social_prod_url,
                mode: newConfig.blog_social_mode,
                method: newConfig.blog_social_method
              },
              websiteDomain: newConfig.website_domain,
              isInitialized: true,
              configId: newConfig.id
            });
          }
        }
        return;
      }

      if (configs) {
        console.log('Webhook configs loaded:', configs);
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
          websiteDomain: configs.website_domain,
          isInitialized: true,
          configId: configs.id
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

    // Make sure we have a config ID before updating Supabase
    if (!currentState.configId) {
      console.error('No config ID available, cannot update Supabase');
      await get().initializeFromSupabase();
    }
    
    try {
      // Update Supabase
      const { error } = await supabase
        .from('webhook_configs')
        .update({
          blog_creation_test_url: updatedBlogCreationUrl.test,
          blog_creation_prod_url: updatedBlogCreationUrl.production,
          blog_creation_mode: updatedBlogCreationUrl.mode,
          blog_creation_method: updatedBlogCreationUrl.method
        })
        .eq('id', get().configId);

      if (error) {
        console.error('Error updating blog creation URL:', error);
        toast.error('Failed to save webhook settings to database');
      }
    } catch (error) {
      console.error('Unexpected error updating blog creation URL:', error);
      toast.error('Unexpected error saving settings');
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

    // Make sure we have a config ID before updating Supabase
    if (!currentState.configId) {
      console.error('No config ID available, cannot update Supabase');
      await get().initializeFromSupabase();
    }
    
    try {
      // Update Supabase
      const { error } = await supabase
        .from('webhook_configs')
        .update({
          blog_social_test_url: updatedBlogSocialShareUrl.test,
          blog_social_prod_url: updatedBlogSocialShareUrl.production,
          blog_social_mode: updatedBlogSocialShareUrl.mode,
          blog_social_method: updatedBlogSocialShareUrl.method
        })
        .eq('id', get().configId);

      if (error) {
        console.error('Error updating blog social share URL:', error);
        toast.error('Failed to save webhook settings to database');
      }
    } catch (error) {
      console.error('Unexpected error updating blog social URL:', error);
      toast.error('Unexpected error saving settings');
    }
  },
  
  updateWebsiteDomain: async (domain) => {
    console.log("Updating website domain to:", domain);
    
    // Update local state
    set({ websiteDomain: domain });

    // Make sure we have a config ID before updating Supabase
    const currentState = get();
    if (!currentState.configId) {
      console.error('No config ID available, cannot update Supabase');
      await get().initializeFromSupabase();
    }
    
    try {
      // Update Supabase
      const { error } = await supabase
        .from('webhook_configs')
        .update({ website_domain: domain })
        .eq('id', get().configId);

      if (error) {
        console.error('Error updating website domain:', error);
        toast.error('Failed to save domain setting to database');
      }
    } catch (error) {
      console.error('Unexpected error updating website domain:', error);
      toast.error('Unexpected error saving domain');
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

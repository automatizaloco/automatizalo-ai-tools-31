import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type NewsletterFrequency = 'weekly' | 'monthly';

export interface NewsletterTemplate {
  id?: string;
  name: string;
  subject: string;
  header_text?: string;
  footer_text?: string;
}

export interface NewsletterContent {
  id?: string;
  template_id: string;
  title: string;
  content: string;
  position: number;
}

export interface NewsletterHistory {
  id: string;
  template_id: string;
  subject: string;
  content: string;
  sent_at: string;
  frequency: string;
  recipient_count: number;
}

/**
 * Subscribe a user to the newsletter
 */
export const subscribeToNewsletter = async (email: string, frequency: NewsletterFrequency): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_subscriptions')
      .insert({ email, frequency });

    if (error) {
      if (error.code === '23505') {
        // Unique violation - email already exists
        toast.error('This email is already subscribed to our newsletter');
      } else {
        console.error("Error subscribing to newsletter:", error);
        toast.error(`Failed to subscribe: ${error.message}`);
      }
      return false;
    }

    // Send email notification to admin
    await sendSubscriptionNotification(email, frequency);
    
    toast.success('Thank you for subscribing to our newsletter!');
    return true;
  } catch (error: any) {
    console.error("Error in subscription process:", error);
    toast.error('Something went wrong while subscribing. Please try again.');
    return false;
  }
};

/**
 * Send an email notification to admin about new subscription
 */
const sendSubscriptionNotification = async (email: string, frequency: NewsletterFrequency): Promise<void> => {
  try {
    // Call the Supabase Edge Function to send the email notification
    const { data, error } = await supabase.functions.invoke('send-notification', {
      body: { 
        email, 
        frequency,
        type: 'newsletter_subscription'
      }
    });

    if (error) {
      console.error("Failed to send subscription notification:", error);
    } else {
      console.log("Notification sent successfully:", data);
    }
  } catch (error) {
    console.error("Failed to send subscription notification:", error);
  }
};

/**
 * Create a new newsletter template
 */
export const createNewsletterTemplate = async (template: NewsletterTemplate): Promise<NewsletterTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_templates')
      .insert(template)
      .select()
      .single();

    if (error) {
      console.error("Error creating newsletter template:", error);
      toast.error(`Failed to create template: ${error.message}`);
      return null;
    }

    toast.success('Newsletter template created successfully');
    return data;
  } catch (error: any) {
    console.error("Error in template creation:", error);
    toast.error('Something went wrong while creating the template.');
    return null;
  }
};

/**
 * Update an existing newsletter template
 */
export const updateNewsletterTemplate = async (id: string, template: Partial<NewsletterTemplate>): Promise<NewsletterTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_templates')
      .update(template)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating newsletter template ${id}:`, error);
      toast.error(`Failed to update template: ${error.message}`);
      return null;
    }

    toast.success('Newsletter template updated successfully');
    return data;
  } catch (error: any) {
    console.error("Error in template update:", error);
    toast.error('Something went wrong while updating the template.');
    return null;
  }
};

/**
 * Delete a newsletter template
 */
export const deleteNewsletterTemplate = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_templates')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting newsletter template ${id}:`, error);
      toast.error(`Failed to delete template: ${error.message}`);
      return false;
    }

    toast.success('Newsletter template deleted successfully');
    return true;
  } catch (error: any) {
    console.error("Error in template deletion:", error);
    toast.error('Something went wrong while deleting the template.');
    return false;
  }
};

/**
 * Get all newsletter templates
 */
export const getNewsletterTemplates = async (): Promise<NewsletterTemplate[]> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_templates')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching newsletter templates:", error);
      throw new Error(`Failed to fetch templates: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching templates:", error);
    toast.error('Failed to load newsletter templates.');
    return [];
  }
};

/**
 * Get a single newsletter template by ID
 */
export const getNewsletterTemplateById = async (id: string): Promise<NewsletterTemplate | null> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Error fetching newsletter template ${id}:`, error);
      throw new Error(`Failed to fetch template: ${error.message}`);
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching template:", error);
    toast.error('Failed to load newsletter template.');
    return null;
  }
};

/**
 * Add content to a newsletter template
 */
export const addNewsletterContent = async (content: NewsletterContent): Promise<NewsletterContent | null> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_content')
      .insert(content)
      .select()
      .single();

    if (error) {
      console.error("Error adding newsletter content:", error);
      toast.error(`Failed to add content: ${error.message}`);
      return null;
    }

    toast.success('Content added to newsletter template');
    return data;
  } catch (error: any) {
    console.error("Error in content addition:", error);
    toast.error('Something went wrong while adding content.');
    return null;
  }
};

/**
 * Update newsletter content
 */
export const updateNewsletterContent = async (id: string, content: Partial<NewsletterContent>): Promise<NewsletterContent | null> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_content')
      .update(content)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Error updating newsletter content ${id}:`, error);
      toast.error(`Failed to update content: ${error.message}`);
      return null;
    }

    toast.success('Newsletter content updated successfully');
    return data;
  } catch (error: any) {
    console.error("Error in content update:", error);
    toast.error('Something went wrong while updating the content.');
    return null;
  }
};

/**
 * Delete newsletter content
 */
export const deleteNewsletterContent = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('newsletter_content')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Error deleting newsletter content ${id}:`, error);
      toast.error(`Failed to delete content: ${error.message}`);
      return false;
    }

    toast.success('Newsletter content deleted successfully');
    return true;
  } catch (error: any) {
    console.error("Error in content deletion:", error);
    toast.error('Something went wrong while deleting the content.');
    return false;
  }
};

/**
 * Get all content blocks for a template
 */
export const getNewsletterContentByTemplateId = async (templateId: string): Promise<NewsletterContent[]> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_content')
      .select('*')
      .eq('template_id', templateId)
      .order('position', { ascending: true });

    if (error) {
      console.error(`Error fetching content for template ${templateId}:`, error);
      throw new Error(`Failed to fetch content: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching content:", error);
    toast.error('Failed to load newsletter content.');
    return [];
  }
};

/**
 * Get newsletter sending history
 */
export const getNewsletterHistory = async (): Promise<NewsletterHistory[]> => {
  try {
    const { data, error } = await supabase
      .from('newsletter_history')
      .select('*')
      .order('sent_at', { ascending: false });

    if (error) {
      console.error("Error fetching newsletter history:", error);
      throw new Error(`Failed to fetch history: ${error.message}`);
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching history:", error);
    toast.error('Failed to load newsletter history.');
    return [];
  }
};

/**
 * Send a newsletter
 */
export const sendNewsletter = async (
  frequency: NewsletterFrequency,
  options: {
    templateId?: string;
    customSubject?: string;
    customContent?: string;
    testMode?: boolean;
    testEmail?: string;
  } = {}
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-newsletter', {
      body: {
        frequency,
        templateId: options.templateId,
        customSubject: options.customSubject,
        customContent: options.customContent,
        testMode: options.testMode || false,
        testEmail: options.testEmail,
      },
    });

    if (error) {
      console.error("Error sending newsletter:", error);
      toast.error(`Failed to send newsletter: ${error.message}`);
      return false;
    }

    if (options.testMode) {
      toast.success('Test newsletter sent successfully');
    } else {
      toast.success(`Newsletter sent to ${data.recipientCount || 'all'} subscribers`);
    }
    
    return true;
  } catch (error: any) {
    console.error("Error in newsletter sending:", error);
    toast.error('Something went wrong while sending the newsletter.');
    return false;
  }
};

/**
 * Preview a newsletter without sending it
 */
export const previewNewsletter = async (
  frequency: NewsletterFrequency,
  options: {
    templateId?: string;
    customSubject?: string;
    customContent?: string;
  } = {}
): Promise<{subject: string, content: string} | null> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-newsletter', {
      body: {
        frequency,
        templateId: options.templateId,
        customSubject: options.customSubject,
        customContent: options.customContent,
        previewOnly: true
      },
    });

    if (error) {
      console.error("Error generating newsletter preview:", error);
      toast.error(`Failed to generate preview: ${error.message}`);
      return null;
    }
    
    return {
      subject: data.subject,
      content: data.content
    };
  } catch (error: any) {
    console.error("Error in newsletter preview:", error);
    toast.error('Something went wrong while generating the preview.');
    return null;
  }
};

/**
 * Toggle newsletter automation (weekly/monthly scheduled sending)
 */
export const toggleNewsletterAutomation = async (
  enable: boolean, 
  options?: { 
    weeklyTemplateId?: string; 
    monthlyTemplateId?: string;
  }
): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('toggle-newsletter-automation', {
      body: { 
        enable,
        weeklyTemplateId: options?.weeklyTemplateId,
        monthlyTemplateId: options?.monthlyTemplateId
      }
    });

    if (error) {
      console.error("Error toggling newsletter automation:", error);
      toast.error(`Failed to ${enable ? 'enable' : 'disable'} automation: ${error.message}`);
      return false;
    }

    toast.success(`Newsletter automation ${enable ? 'enabled' : 'disabled'} successfully`);
    return true;
  } catch (error: any) {
    console.error("Error in automation toggle:", error);
    toast.error(`Something went wrong while ${enable ? 'enabling' : 'disabling'} automation.`);
    return false;
  }
};

/**
 * Check newsletter automation status
 */
export const checkNewsletterAutomation = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('check-newsletter-automation', {
      body: {}
    });

    if (error) {
      console.error("Error checking newsletter automation:", error);
      return false;
    }

    return data.enabled;
  } catch (error: any) {
    console.error("Error checking automation status:", error);
    return false;
  }
};

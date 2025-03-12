
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type NewsletterFrequency = 'weekly' | 'monthly';

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

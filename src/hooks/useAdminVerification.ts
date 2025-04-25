
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/context/AuthContext';

export function useAdminVerification(maxRetries = 3) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle verification errors with proper feedback
    const handleVerificationError = (error: any, isRetry = false) => {
      console.error('Error during admin verification:', error);
      
      // Check if we should retry
      if (retryCount < maxRetries && isRetry) {
        setRetryCount(prev => prev + 1);
        return; // Will trigger another verification attempt via useEffect dependency
      }
      
      // Max retries reached or explicit handling without retry
      setIsVerifying(false);
      setIsAdmin(false);
      
      // Show a helpful error message
      notification.showError(
        'Access Denied', 
        `Verification failed: ${error.message || 'Could not verify admin permissions'}. Please try again later.`
      );
      
      // Navigate back to dashboard or home
      navigate('/');
    };

    const verifyAdmin = async () => {
      // Reset retry count if verification starts with new user
      if (retryCount > 0 && user) {
        setRetryCount(0);
      }
      
      // Skip verification if not authenticated
      if (!isAuthenticated || !user) {
        setIsVerifying(false);
        setIsAdmin(false);
        return;
      }

      try {
        setIsVerifying(true);
        console.log(`Verifying admin permissions for user: ${user.email} (attempt ${retryCount + 1}/${maxRetries + 1})`);
        
        // Check admin status directly from the database using RPC function
        // This avoids edge function connectivity issues
        const { data, error } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (error) {
          console.error('Error verifying admin status:', error);
          throw new Error(`Failed to verify admin permissions: ${error.message}`);
        }
        
        console.log('Admin verification result:', data);
        setIsAdmin(!!data); // Ensure boolean result
        
        // If not admin, notify and redirect
        if (!data) {
          notification.showError('Access Denied', 'You do not have administrator permissions.');
          navigate('/');
        }
        
        // Reset retry count on success
        if (retryCount > 0) {
          setRetryCount(0);
        }
        
        // Complete verification
        setIsVerifying(false);
      } catch (error) {
        handleVerificationError(error, true);
      }
    };

    verifyAdmin();
  }, [user, isAuthenticated, navigate, notification, retryCount, maxRetries]);

  return { isAdmin, isVerifying };
}

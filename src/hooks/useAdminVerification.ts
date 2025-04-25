
import { useEffect, useState, useRef } from 'react';
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
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeout to prevent memory leaks
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Function to handle verification errors with proper feedback
    const handleVerificationError = (error: any, isRetry = false) => {
      console.error('Error during admin verification:', error);
      
      // Check if we should retry
      if (retryCount < maxRetries && isRetry) {
        setRetryCount(prev => prev + 1);
        // Use timeout to avoid immediate retry and potential cascade failures
        timeoutRef.current = window.setTimeout(() => {
          verifyAdmin(); // Explicit retry call after timeout
        }, 1000 * Math.min(2 ** retryCount, 8)); // Exponential backoff
        return;
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
        
        // First try the direct database approach which is most reliable
        const { data: directData, error: directError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (!directError && directData) {
          const isAdminUser = directData.role === 'admin';
          console.log('Admin verification result (direct):', isAdminUser);
          setIsAdmin(isAdminUser);
          
          if (!isAdminUser) {
            notification.showError('Access Denied', 'You do not have administrator permissions.');
            navigate('/');
          }
          
          setIsVerifying(false);
          return;
        }
        
        // Fallback to RPC function if direct query fails
        if (directError) {
          console.log('Direct query failed, trying RPC:', directError);
          const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_uid: user.id });
          
          if (rpcError) {
            console.error('Error verifying admin status with RPC:', rpcError);
            throw new Error(`Failed to verify admin permissions: ${rpcError.message}`);
          }
          
          console.log('Admin verification result (RPC):', rpcData);
          setIsAdmin(!!rpcData); // Ensure boolean result
          
          if (!rpcData) {
            notification.showError('Access Denied', 'You do not have administrator permissions.');
            navigate('/');
          }
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

    // Prevent verification running on unmounted component
    let isMounted = true;
    
    // Initial verification
    if (isMounted) {
      verifyAdmin();
    }
    
    // Cleanup function to prevent memory leaks and state updates on unmounted component
    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [user, isAuthenticated, navigate, notification, retryCount, maxRetries]);

  return { isAdmin, isVerifying };
}

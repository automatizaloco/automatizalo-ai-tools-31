
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/context/AuthContext';

export function useAdminVerification(maxRetries = 3, verificationTimeout = 10000) {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { user, isAuthenticated } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();
  const verificationRef = useRef<{ aborted: boolean }>({ aborted: false });
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Create a verification reference for this effect instance
    const verificationInstance = { aborted: false };
    verificationRef.current = verificationInstance;

    // Clear any existing timeouts
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    const verifyAdmin = async () => {
      // Skip verification if not authenticated
      if (!isAuthenticated || !user) {
        setIsVerifying(false);
        setIsAdmin(false);
        navigate('/login?redirect=/admin');
        return;
      }

      try {
        setIsVerifying(true);
        console.log(`Verifying admin permissions for user: ${user.email} (attempt ${retryCount + 1}/${maxRetries + 1})`);

        // Set verification timeout
        timeoutRef.current = window.setTimeout(() => {
          if (verificationInstance.aborted) return;
          console.log('Verification timeout reached');
          if (retryCount < maxRetries) {
            setRetryCount(prev => prev + 1);
          } else {
            setIsVerifying(false);
            setIsAdmin(false);
            notification.showError('Access Denied', 'Verification timeout. Please try again later.');
            navigate('/');
          }
        }, verificationTimeout);

        // Simplified approach: use only the RPC function as single source of truth
        const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_uid: user.id });

        // Check if the verification was aborted during the request
        if (verificationInstance.aborted) return;
        
        // Clear the timeout since we got a response
        if (timeoutRef.current) {
          window.clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        if (rpcError) {
          console.error('Error checking admin status via RPC:', rpcError);
          throw new Error(`Failed to verify admin status: ${rpcError.message}`);
        }

        const adminStatus = !!rpcData;
        console.log('Admin verification result (RPC):', adminStatus);
        
        setIsAdmin(adminStatus);
        setIsVerifying(false);
        
        // If not admin, redirect to homepage
        if (!adminStatus) {
          notification.showError('Access Denied', 'You do not have the required admin role.');
          navigate('/');
        }

        // Reset retry count on success
        setRetryCount(0);
        
      } catch (error: any) {
        // Check if the verification was aborted
        if (verificationInstance.aborted) return;
        
        console.error('Error during admin verification:', error);
        
        // Check if we should retry
        if (retryCount < maxRetries) {
          setRetryCount(prev => prev + 1);
          const delay = Math.min(2000 * (retryCount + 1), 6000);
          timeoutRef.current = window.setTimeout(() => {
            if (!verificationInstance.aborted) {
              verifyAdmin();
            }
          }, delay);
          return;
        }
        
        setIsVerifying(false);
        setIsAdmin(false);
        
        let errorMessage = 'Could not verify admin permissions. ';
        if (error.message?.includes('policy')) {
          errorMessage += 'You do not have the required admin role.';
        } else if (error.message?.includes('network')) {
          errorMessage += 'Please check your internet connection.';
        } else {
          errorMessage += 'Please try again later.';
        }
        
        notification.showError('Access Denied', errorMessage);
        navigate('/');
      }
    };

    verifyAdmin();
    
    return () => {
      // Mark this verification instance as aborted
      verificationInstance.aborted = true;
      
      // Clear any timeouts
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [user?.id, isAuthenticated, navigate, notification, retryCount, maxRetries, verificationTimeout]);

  return { isAdmin, isVerifying };
}

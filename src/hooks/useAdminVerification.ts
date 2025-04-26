
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
  const timeoutRef = useRef<number | null>(null);
  const verificationTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Clear any existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
    }

    const handleVerificationError = (error: any, isRetry = false) => {
      console.error('Error during admin verification:', error);
      
      // Check if we should retry
      if (retryCount < maxRetries && isRetry) {
        setRetryCount(prev => prev + 1);
        timeoutRef.current = window.setTimeout(() => {
          verifyAdmin();
        }, Math.min(2000 * (retryCount + 1), 6000)); // Progressive delay with max of 6 seconds
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
    };

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
        verificationTimeoutRef.current = window.setTimeout(() => {
          handleVerificationError(new Error('Verification timeout'), true);
        }, verificationTimeout);

        // First try to directly query the automations table as a quick admin check
        const { data: automationsData, error: automationsError } = await supabase
          .from('automations')
          .select('id')
          .limit(1);
          
        if (!automationsError) {
          console.log('Admin verification successful via automations table access');
          setIsAdmin(true);
          setIsVerifying(false);
          clearTimeout(verificationTimeoutRef.current!);
          return;
        }
        
        // If automations check fails, try the direct database approach
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
            throw new Error('User does not have admin role');
          }
          
          setIsVerifying(false);
          clearTimeout(verificationTimeoutRef.current!);
          return;
        }
        
        // Final fallback to RPC function
        if (directError) {
          console.log('Direct query failed, trying RPC:', directError);
          const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_uid: user.id });
          
          if (rpcError) throw rpcError;
          
          console.log('Admin verification result (RPC):', rpcData);
          setIsAdmin(!!rpcData);
          
          if (!rpcData) {
            throw new Error('User does not have admin role');
          }
        }
        
        // Reset retry count on success
        setRetryCount(0);
        setIsVerifying(false);
        clearTimeout(verificationTimeoutRef.current!);
        
      } catch (error) {
        handleVerificationError(error, true);
      }
    };

    verifyAdmin();
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (verificationTimeoutRef.current) clearTimeout(verificationTimeoutRef.current);
    };
  }, [user, isAuthenticated, navigate, notification, retryCount, maxRetries, verificationTimeout]);

  return { isAdmin, isVerifying };
}

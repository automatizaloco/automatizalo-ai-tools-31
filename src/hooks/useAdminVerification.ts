
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/context/AuthContext';

export function useAdminVerification() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const notification = useNotification();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdmin = async () => {
      if (!isAuthenticated || !user) {
        setIsVerifying(false);
        setIsAdmin(false);
        return;
      }

      try {
        setIsVerifying(true);
        console.log('Verifying admin permissions for user:', user.email);
        
        // Use the RPC function to check admin status
        const { data, error } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (error) {
          console.error('Error verifying admin status:', error);
          throw new Error('Failed to verify admin permissions');
        }
        
        console.log('Admin verification result:', data);
        setIsAdmin(data);
        
        if (!data) {
          notification.showError('Access Denied', 'You do not have administrator permissions.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error during admin verification:', error);
        notification.showError('Access Denied', 'You do not have administrator permissions.');
        navigate('/');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdmin();
  }, [user, isAuthenticated, navigate, notification]);

  return { isAdmin, isVerifying };
}

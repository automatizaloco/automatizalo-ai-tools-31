
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/context/AuthContext';

/**
 * Hook for verifying admin permissions and handling related actions
 */
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
        
        // Try direct query to users table first - simpler and faster
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (!error && data) {
          const isUserAdmin = data.role === 'admin';
          console.log('Admin verification result from direct query:', isUserAdmin);
          
          if (isUserAdmin) {
            setIsAdmin(true);
            setIsVerifying(false);
            return;
          } else {
            throw new Error('User does not have admin role');
          }
        }
        
        // If direct query fails, use the edge function as backup
        console.log('Direct query failed, trying edge function for verification');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          throw new Error('No active session found');
        }
        
        const { error: functionError, data: functionData } = await supabase.functions.invoke('manage-users', {
          body: { action: 'verifyAdmin' },
          headers: {
            Authorization: `Bearer ${session.access_token}`
          }
        });
        
        if (functionError) {
          console.error('Edge function error:', functionError);
          throw new Error(`Verification failed: ${functionError.message}`);
        }
        
        if (!functionData || !functionData.isAdmin) {
          console.warn('Edge function verification result: Not admin');
          throw new Error('Admin verification failed: User is not an admin');
        }
        
        console.log('Admin verification successful via edge function');
        setIsAdmin(true);
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

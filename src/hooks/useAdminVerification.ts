
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
        
        // First try direct query to users table
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error verifying admin role from database:', error);
          // If direct query fails, try the edge function as a backup verification method
          const { error: functionError, data: functionData } = await supabase.functions.invoke('manage-users', {
            body: { 
              action: 'verifyAdmin'
            },
            headers: {
              Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token || ''}`
            }
          });
          
          if (functionError || !functionData || !functionData.isAdmin) {
            console.error('Edge function admin verification failed:', functionError || 'User is not admin');
            throw new Error(functionError?.message || 'Admin verification failed');
          }
          
          console.log('Admin role verified through edge function for user:', user.email);
          setIsAdmin(true);
          return;
        }
        
        if (data?.role !== 'admin') {
          console.warn('User does not have admin role:', user.email);
          notification.showError('Acceso denegado', 'No tienes permisos de administrador.');
          navigate('/client-portal');
          return;
        }
        
        console.log('Admin role verified for user:', user.email);
        setIsAdmin(true);
      } catch (error) {
        console.error('Error during admin verification:', error);
        notification.showError('Error de verificación', 'No se pudieron verificar los permisos de administrador.');
        navigate('/');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyAdmin();
  }, [user, isAuthenticated, navigate, notification]);

  return { isAdmin, isVerifying };
}

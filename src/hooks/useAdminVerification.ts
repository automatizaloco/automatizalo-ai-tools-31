
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function useAdminVerification() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsVerifying(false);
        return;
      }

      try {
        const { data: isAdminUser, error } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          setIsAdmin(!!isAdminUser);
        }
      } catch (error) {
        console.error('Error in admin verification:', error);
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  return { isAdmin, isVerifying };
}

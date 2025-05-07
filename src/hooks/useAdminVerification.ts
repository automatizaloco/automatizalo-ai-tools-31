
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

// Cache admin status to avoid repeated checks
const adminStatusCache = new Map<string, boolean>();

export function useAdminVerification() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const checkTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Clear any existing timeout to prevent race conditions
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }

    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Check cache first for better performance
        if (adminStatusCache.has(user.id)) {
          setIsAdmin(adminStatusCache.get(user.id) || false);
          setIsVerifying(false);
          return;
        }

        const { data: isAdminUser, error } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!isAdminUser;
          // Cache the result
          adminStatusCache.set(user.id, adminStatus);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error in admin verification:', error);
        setIsAdmin(false);
      } finally {
        setIsVerifying(false);
      }
    };

    // Use a small timeout to avoid UI flashing when navigating between admin pages
    checkTimeoutRef.current = setTimeout(checkAdminStatus, 100);
    
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
    };
  }, [user]);

  return { isAdmin, isVerifying };
}

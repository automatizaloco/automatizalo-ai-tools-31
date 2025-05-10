
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
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    // Clear any existing timeout to prevent race conditions
    if (checkTimeoutRef.current) {
      clearTimeout(checkTimeoutRef.current);
    }
    
    // Cancel any in-flight requests
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setIsVerifying(false);
        return;
      }

      try {
        // Special case for the main admin account
        if (user.email === 'contact@automatizalo.co') {
          console.log("Main admin account detected, bypassing check");
          setIsAdmin(true);
          setIsVerifying(false);
          adminStatusCache.set(user.id, true);
          return;
        }
        
        // Check cache first for better performance
        if (adminStatusCache.has(user.id)) {
          const cachedStatus = adminStatusCache.get(user.id) || false;
          console.log("Using cached admin status:", cachedStatus);
          setIsAdmin(cachedStatus);
          setIsVerifying(false);
          return;
        }

        console.log("Checking admin status for:", user.email);
        const { data: isAdminUser, error } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          const adminStatus = !!isAdminUser;
          console.log("Admin status result:", adminStatus);
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
    // and to prevent multiple simultaneous checks
    checkTimeoutRef.current = setTimeout(checkAdminStatus, 100);
    
    return () => {
      if (checkTimeoutRef.current) {
        clearTimeout(checkTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [user]);

  // Set a timeout to force isVerifying to false after a reasonable time
  // to prevent infinite loading states
  useEffect(() => {
    const forceTimeout = setTimeout(() => {
      if (isVerifying) {
        console.warn("Admin verification taking too long, forcing completion");
        setIsVerifying(false);
      }
    }, 3000); // 3 second timeout
    
    return () => clearTimeout(forceTimeout);
  }, [isVerifying]);

  return { isAdmin, isVerifying };
}

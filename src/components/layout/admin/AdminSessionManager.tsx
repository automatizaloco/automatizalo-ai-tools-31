
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';

interface AdminSessionManagerProps {
  onSessionChange: (session: any | null) => void;
}

const AdminSessionManager: React.FC<AdminSessionManagerProps> = ({ onSessionChange }) => {
  const navigate = useNavigate();
  const notification = useNotification();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    const checkSession = async () => {
      // Only run this once
      if (hasCheckedSession.current) return;
      
      hasCheckedSession.current = true;
      
      try {
        // Get current session state
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          notification.showError("Authentication Error", "Please try logging in again.");
          navigate('/login?redirect=/admin');
          onSessionChange(null);
          return;
        }
        
        onSessionChange(data.session);
        
        if (!data.session) {
          // If no session, redirect to login
          navigate('/login?redirect=/admin');
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        notification.showError("Session Error", "Failed to verify your session.");
        onSessionChange(null);
      }
    };
    
    // Check session immediately
    checkSession();
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        onSessionChange(session);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );
    
    // Clean up listener on unmount
    return () => {
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, notification, onSessionChange]);

  return null; // This component doesn't render anything
};

export default AdminSessionManager;

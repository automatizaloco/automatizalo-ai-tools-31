
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { useAuth } from '@/context/AuthContext';

interface AdminSessionManagerProps {
  onSessionChange: (session: any | null) => void;
}

const AdminSessionManager: React.FC<AdminSessionManagerProps> = ({ onSessionChange }) => {
  const navigate = useNavigate();
  const notification = useNotification();
  const { user, isAuthenticated } = useAuth();
  const hasSetupListener = useRef(false);

  useEffect(() => {
    // Pass the current auth state from context immediately
    if (user) {
      // Get current session to ensure we have the full session object
      supabase.auth.getSession().then(({ data }) => {
        onSessionChange(data.session);
      });
    } else {
      onSessionChange(null);
    }

    // Only set up the listener once
    if (hasSetupListener.current) return;
    hasSetupListener.current = true;

    // Set up auth state listener for future changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log("Auth event:", event, "Session exists:", !!session);
        onSessionChange(session);
        
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        } else if (event === 'SIGNED_IN') {
          // Don't navigate here, let the parent component handle it
          console.log("User signed in");
        }
      }
    );
    
    // If not authenticated, redirect to login immediately
    if (!isAuthenticated && !user) {
      console.log("Not authenticated, redirecting to login");
      navigate('/login?redirect=/admin');
    }

    // Clean up listener on unmount
    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, notification, onSessionChange, user, isAuthenticated]);

  return null; // This component doesn't render anything
};

export default AdminSessionManager;

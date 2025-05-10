
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { Loader2 } from 'lucide-react';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(false);
  const notification = useNotification();

  useEffect(() => {
    // Check for authentication first
    if (!isAuthenticated || !user) {
      console.log("Admin page: User not authenticated, redirecting to login");
      navigate('/login?redirect=/admin');
      return;
    }

    // Special case for main admin
    if (user.email === 'contact@automatizalo.co') {
      console.log("Main admin detected, allowing access");
      
      // Handle exact /admin path to redirect to content dashboard
      if (location.pathname === '/admin') {
        navigate('/admin/content', { replace: true });
      }
      
      return;
    }

    // Only perform admin check once
    setIsChecking(true);
    
    const checkAdminRole = async () => {
      try {
        console.log('Checking admin privileges for:', user.email);
        
        // Try both methods to check admin status for more reliability
        const { data: isAdmin, error: rpcError } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (rpcError) {
          console.error('Error checking admin role via RPC:', rpcError);
          throw new Error(`Failed to verify admin status: ${rpcError.message}`);
        }
        
        if (!isAdmin) {
          console.log('Non-admin user tried to access admin area:', user.email);
          notification.showError('Access Denied', 'You need admin privileges to access this area');
          navigate('/client-portal');
          return;
        }
        
        // Handle exact /admin path to redirect to content dashboard
        if (location.pathname === '/admin') {
          navigate('/admin/content', { replace: true });
        }
        
      } catch (error) {
        console.error('Admin check error:', error);
        notification.showError('Error checking permissions', 'Please try again later.');
        navigate('/');
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAdminRole();
  }, [user, navigate, location.pathname, notification, isAuthenticated]);

  // Add a timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isChecking) {
        console.log("Admin check timeout reached");
        setIsChecking(false);
      }
    }, 5000);
    
    return () => clearTimeout(timeout);
  }, [isChecking]);

  if (!user) {
    return null; // Let the router redirect to login
  }

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Only render the Outlet component directly - let AdminLayout handle the layout
  return <Outlet />;
};

export default Admin;

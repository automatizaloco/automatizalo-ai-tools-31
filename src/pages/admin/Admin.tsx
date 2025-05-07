
import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNotification } from '@/hooks/useNotification';
import { Loader2 } from 'lucide-react';
import AdminContent from '@/components/layout/admin/AdminContent';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const notification = useNotification();

  useEffect(() => {
    // Check for authentication
    if (!user) {
      navigate('/login?redirect=/admin');
      return;
    }

    // Check if user has admin role
    const checkAdminRole = async () => {
      try {
        setIsChecking(true);
        console.log('Checking admin privileges for:', user.email);
        
        // Special case for main admin account
        if (user.email === 'contact@automatizalo.co') {
          console.log('Main admin detected, ensuring admin role');
          
          // Check if user exists in the users table
          const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (fetchError || !userData || userData.role !== 'admin') {
            console.log('Updating admin role for main account');
            
            // Upsert to create/update the user with admin role
            const { error: upsertError } = await supabase
              .from('users')
              .upsert({
                id: user.id,
                email: user.email,
                role: 'admin',
                updated_at: new Date().toISOString(),
                created_at: new Date().toISOString()
              });
              
            if (upsertError) {
              console.error('Error upserting admin user:', upsertError);
              notification.showWarning('Admin Setup', 'Could not update admin role, but continuing as admin');
            }
          }
          
          // Handle exact /admin path to redirect to content dashboard
          if (location.pathname === '/admin') {
            navigate('/admin/content');
          }
          
          setIsChecking(false);
          return; // Main admin is always allowed
        }
        
        // Try both methods to check admin status for more reliability
        
        // 1. Direct database query (most reliable, but may be affected by RLS)
        const { data: directData, error: directError } = await supabase
          .from('users')
          .select('role')
          .eq('id', user.id)
          .single();
        
        let isAdmin = false;
        
        if (!directError && directData) {
          isAdmin = directData.role === 'admin';
        } else if (directError) {
          console.log('Direct query failed, trying RPC function:', directError);
          
          // 2. RPC function as fallback (bypasses some RLS issues)
          const { data: rpcData, error: rpcError } = await supabase.rpc('is_admin', { user_uid: user.id });
          
          if (rpcError) {
            console.error('Error checking admin role via RPC:', rpcError);
            throw new Error(`Failed to verify admin status: ${rpcError.message}`);
          }
          
          isAdmin = !!rpcData;
        }
        
        console.log('Admin check result:', isAdmin);
        
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
  }, [user, navigate, location.pathname, notification]);

  if (!user || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Render only the Outlet to prevent duplicate navigation
  return (
    <AdminContent>
      <Outlet />
    </AdminContent>
  );
};

export default Admin;


import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ensureContentBucket } from '@/services/blog/ensureBucket';
import { useNotification } from '@/hooks/useNotification';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
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
          
          return; // Main admin is always allowed
        }
        
        // For all other users, check role using database RPC function
        // This avoids edge function connectivity issues
        const { data: isAdmin, error } = await supabase.rpc('is_admin', { user_uid: user.id });
          
        if (error) {
          console.error('Error checking admin role:', error);
          notification.showError('Failed to verify admin privileges', 'Please try again or contact support.');
          navigate('/');
          return;
        }
        
        // Redirect non-admin users
        if (!isAdmin) {
          console.log('Non-admin user tried to access admin area:', user.email);
          notification.showError('Access Denied', 'You need admin privileges to access this area');
          navigate('/client-portal');
          return;
        }
        
        // Handle exact /admin path to redirect to content dashboard
        if (location.pathname === '/admin') {
          navigate('/admin/content');
        }
      } catch (error) {
        console.error('Admin check error:', error);
        notification.showError('Error checking permissions', 'Please try again later.');
        navigate('/');
      }
    };
    
    checkAdminRole();

    // Ensure storage buckets exist when admin loads
    ensureContentBucket().catch(error => {
      console.error("Error ensuring storage buckets exist:", error);
    });
  }, [user, navigate, location.pathname, notification]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  // Render only the Outlet to prevent duplicate navigation
  return <Outlet />;
};

export default Admin;

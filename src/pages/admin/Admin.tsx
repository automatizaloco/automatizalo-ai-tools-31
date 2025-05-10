
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useAdminVerification } from '@/hooks/useAdminVerification';

const Admin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { isAdmin, isVerifying } = useAdminVerification();

  useEffect(() => {
    // Check for authentication first
    if (!isAuthenticated || !user) {
      console.log("Admin page: User not authenticated, redirecting to login");
      navigate('/login?redirect=/admin');
      return;
    }

    // Handle exact /admin path to redirect to content dashboard
    if (location.pathname === '/admin') {
      navigate('/admin/content', { replace: true });
    }
  }, [user, navigate, location.pathname, isAuthenticated]);

  // Let the router handle the rest - AdminLayout will already filter for admin access
  return <Outlet />;
};

export default Admin;

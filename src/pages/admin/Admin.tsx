
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Check for authentication first
    if (!isAuthenticated || !user) {
      console.log("Admin page: User not authenticated, redirecting to login");
      navigate('/login?redirect=/admin');
      return;
    }
    
    // If authenticated, redirect to blog section
    if (location.pathname === '/admin') {
      console.log("Admin page: Redirecting to blog section");
      navigate('/admin/blog');
    }
  }, [user, navigate, isAuthenticated]);

  return <Outlet />;
};

export default Admin;

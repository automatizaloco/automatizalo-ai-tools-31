
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
    }
  }, [user, navigate, isAuthenticated]);

  // Simply render the outlet for nested routes
  return <Outlet />;
};

export default Admin;


import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ensureContentBucket } from '@/services/blog/ensureBucket';

const Admin = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    // Check for authentication
    if (!user) {
      navigate('/login?redirect=/admin');
      return;
    }

    // Ensure storage buckets exist when admin loads
    ensureContentBucket().catch(error => {
      console.error("Error ensuring storage buckets exist:", error);
    });
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  return <Outlet />;
};

export default Admin;

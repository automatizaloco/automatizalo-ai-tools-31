
import React, { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ContentManager from './ContentManager';
import { useLocation, useNavigate } from 'react-router-dom';

const Admin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isRootAdminPath = location.pathname === '/admin';

  // Redirect to content manager when accessing the root admin path
  useEffect(() => {
    if (isRootAdminPath) {
      navigate('/admin/content', { replace: true });
    }
  }, [isRootAdminPath, navigate]);

  return (
    <AdminLayout>
      {isRootAdminPath ? (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">
            Please select a section from the navigation tabs above to manage your content.
          </p>
        </div>
      )}
    </AdminLayout>
  );
};

export default Admin;

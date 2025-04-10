
import React, { useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import ContentManager from './ContentManager';
import { useLocation } from 'react-router-dom';

const Admin = () => {
  const location = useLocation();
  const isRootAdminPath = location.pathname === '/admin';

  return (
    <AdminLayout>
      {isRootAdminPath ? (
        <ContentManager />
      ) : (
        <div className="container mx-auto px-4 py-8">
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

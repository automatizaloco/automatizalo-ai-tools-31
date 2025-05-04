
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Outlet } from 'react-router-dom';

interface AdminBaseLayoutProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const AdminBaseLayout = ({ title = "Admin Dashboard", description, children }: AdminBaseLayoutProps) => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-6">
        {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
        {description && <p className="text-gray-600 mb-6">{description}</p>}
        {children || <Outlet />}
      </div>
    </AdminLayout>
  );
};

export default AdminBaseLayout;

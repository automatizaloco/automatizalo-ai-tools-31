
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminBaseLayoutProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
}

const AdminBaseLayout = ({ title = "Admin Dashboard", description, children }: AdminBaseLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <AdminLayout>
      <div className={`container mx-auto ${isMobile ? 'px-3 py-4' : 'px-4 py-6'}`}>
        {title && <h1 className={`text-xl ${isMobile ? 'mb-2' : 'text-2xl mb-3'} font-bold`}>{title}</h1>}
        {description && <p className="text-gray-600 mb-4 text-sm">{description}</p>}
        {children || <Outlet />}
      </div>
    </AdminLayout>
  );
};

export default AdminBaseLayout;

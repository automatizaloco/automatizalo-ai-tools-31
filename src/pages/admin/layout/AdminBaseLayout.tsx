
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Outlet } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

interface AdminBaseLayoutProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  hideTitle?: boolean;
  className?: string;
}

const AdminBaseLayout = ({ 
  title = "Admin Dashboard", 
  description, 
  children,
  hideTitle = false,
  className = ""
}: AdminBaseLayoutProps) => {
  const isMobile = useIsMobile();
  
  return (
    <AdminLayout>
      <div className={`${className} ${isMobile ? 'px-2 py-2 max-w-full' : 'px-4 py-4'}`}>
        {!hideTitle && title && (
          <h1 className={`text-xl ${isMobile ? 'mb-2 px-1' : 'text-2xl mb-3'} font-bold truncate`}>
            {title}
          </h1>
        )}
        {description && <p className="text-gray-600 mb-4 text-sm px-1">{description}</p>}
        {children || <Outlet />}
      </div>
    </AdminLayout>
  );
};

export default AdminBaseLayout;

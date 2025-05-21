
import { ReactNode } from 'react';
import AdminBaseLayout from '@/pages/admin/layout/AdminBaseLayout';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  hideTitle?: boolean;
}

// This is now just a wrapper for backward compatibility
const AdminLayout = ({ children, title = "Admin Dashboard", hideTitle = false }: AdminLayoutProps) => {
  return (
    <AdminBaseLayout title={title} hideTitle={hideTitle}>
      {children}
    </AdminBaseLayout>
  );
};

export default AdminLayout;

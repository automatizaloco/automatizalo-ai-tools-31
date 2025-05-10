
import { useNavigate } from 'react-router-dom';
import { ReactNode, useState, lazy, Suspense } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { supabase } from '@/integrations/supabase/client';
import AdminPageLoader from './admin/AdminPageLoader';
import AdminLayoutContent from './admin/AdminLayoutContent';
import AdminSessionManager from './admin/AdminSessionManager';
import { useAdminRouteState } from './admin/useAdminRouteState';

// Lazy load components for better performance
const AdminHeader = lazy(() => import('./admin/AdminHeader'));

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  hideTitle?: boolean;
}

const AdminLayout = ({ children, title = "Admin Dashboard", hideTitle = false }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const notification = useNotification();
  const { activeTab, isPageLoading, adminRoutes, handleTabChange } = useAdminRouteState();

  const handleSessionChange = (newSession: any | null) => {
    setSession(newSession);
    setLoading(newSession === null);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      notification.showSuccess("Signed Out", "You have been signed out successfully.");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      notification.showError("Sign Out Failed", "Failed to sign out. Please try again.");
      navigate('/login');
    }
  };

  const handleViewAsClient = () => {
    navigate('/client-portal');
    notification.showInfo("Client View", "You are now viewing the client portal as an admin.");
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return <AdminPageLoader />;
  }
  
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AdminSessionManager onSessionChange={handleSessionChange} />
      
      <Suspense fallback={<div className="h-16 bg-white shadow animate-pulse"></div>}>
        <AdminHeader 
          activeTab={activeTab}
          adminRoutes={adminRoutes}
          onTabChange={handleTabChange}
          onHomeClick={handleHomeClick}
          onLogout={handleLogout}
          onViewAsClient={handleViewAsClient}
        />
      </Suspense>
      
      <AdminLayoutContent
        title={title}
        hideTitle={hideTitle}
        activeTab={activeTab}
        isPageLoading={isPageLoading}
        adminRoutes={adminRoutes}
        handleTabChange={handleTabChange}
      >
        {children}
      </AdminLayoutContent>
    </div>
  );
};

export default AdminLayout;

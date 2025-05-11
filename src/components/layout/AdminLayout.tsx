
import { useNavigate } from 'react-router-dom';
import { ReactNode, useState, lazy, Suspense, useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import AdminPageLoader from './admin/AdminPageLoader';
import AdminLayoutContent from './admin/AdminLayoutContent';
import AdminSessionManager from './admin/AdminSessionManager';
import { useAdminRouteState } from './admin/useAdminRouteState';
import { useAdminVerification } from '@/hooks/useAdminVerification';

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
  const { isAuthenticated, user } = useAuth();
  const { isAdmin, isVerifying } = useAdminVerification();
  const notification = useNotification();
  const { activeTab, isPageLoading, adminRoutes } = useAdminRouteState();

  // Set a timeout to prevent infinite loading
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, forcing UI update");
        setLoading(false);
      }
    }, 3000); // 3 second timeout

    return () => clearTimeout(loadingTimeout);
  }, [loading]);

  const handleSessionChange = (newSession: any | null) => {
    setSession(newSession);
    if (newSession) {
      // Delay setting loading to false to allow admin verification
      setTimeout(() => setLoading(false), 500);
    } else {
      setLoading(false);
    }
  };

  // Update loading state based on verification status
  useEffect(() => {
    if (!isVerifying && session) {
      setLoading(false);
    }
  }, [isVerifying, session]);

  // Redirect if not admin
  useEffect(() => {
    if (!isVerifying && !isAdmin && !loading && user) {
      notification.showError("Access Denied", "You don't have admin privileges.");
      navigate('/client-portal');
    }
  }, [isAdmin, isVerifying, loading, user, navigate, notification]);

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

  if (loading || isVerifying) {
    return <AdminPageLoader />;
  }
  
  if (!session || !isAdmin) {
    // Don't render anything if not authenticated or not admin - the session manager will redirect
    return <AdminSessionManager onSessionChange={handleSessionChange} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AdminSessionManager onSessionChange={handleSessionChange} />
      
      <Suspense fallback={<div className="h-16 bg-white shadow animate-pulse"></div>}>
        <AdminHeader 
          activeTab={activeTab}
          adminRoutes={adminRoutes}
          onHomeClick={handleHomeClick}
          onLogout={handleLogout}
          onViewAsClient={handleViewAsClient}
        />
      </Suspense>
      
      <AdminLayoutContent
        title={title}
        hideTitle={hideTitle}
        isPageLoading={isPageLoading}
      >
        {children}
      </AdminLayoutContent>
    </div>
  );
};

export default AdminLayout;

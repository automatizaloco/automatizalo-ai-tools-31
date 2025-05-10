
import { useNavigate } from 'react-router-dom';
import { ReactNode, useState, lazy, Suspense, useEffect } from 'react';
import { useNotification } from '@/hooks/useNotification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
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
  const { isAuthenticated, user } = useAuth();
  const notification = useNotification();
  const { activeTab, isPageLoading, adminRoutes, handleTabChange } = useAdminRouteState();
  const [adminCheckComplete, setAdminCheckComplete] = useState(false);

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

  // Check if user has admin privileges
  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) return;
      
      try {
        // For the main admin account, bypass the check
        if (user.email === 'contact@automatizalo.co') {
          setAdminCheckComplete(true);
          return;
        }
        
        // For other users, verify admin status
        const { data, error } = await supabase.rpc('is_admin', { user_uid: user.id });
        
        if (error || !data) {
          console.error("Admin verification failed:", error);
          notification.showError("Access Denied", "You don't have admin privileges.");
          navigate('/client-portal');
          return;
        }
        
        setAdminCheckComplete(true);
      } catch (error) {
        console.error("Admin check error:", error);
        notification.showError("Verification Error", "Could not verify admin status.");
        navigate('/client-portal');
      }
    };
    
    if (user) {
      checkAdminAccess();
    }
  }, [user, navigate, notification]);

  const handleSessionChange = (newSession: any | null) => {
    console.log("Session changed:", !!newSession);
    setSession(newSession);
    // Don't set loading to false immediately, wait for admin check
    if (!newSession) {
      setLoading(false); // Only stop loading if there's no session
    }
  };

  // Only stop loading when we have both session and admin check complete
  useEffect(() => {
    if (session && adminCheckComplete) {
      setLoading(false);
    }
  }, [session, adminCheckComplete]);

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

  // Don't show a loading state if we know there's no session
  if (loading && (!isAuthenticated || !user)) {
    setLoading(false);
  }

  if (loading) {
    return <AdminPageLoader />;
  }
  
  if (!session) {
    // Don't render anything if not authenticated - the session manager will redirect
    return <AdminSessionManager onSessionChange={handleSessionChange} />;
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

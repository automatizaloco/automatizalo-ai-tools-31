
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useNotification } from '@/hooks/useNotification';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import AdminHeader from '@/components/layout/admin/AdminHeader';
import AdminSessionManager from '@/components/layout/admin/AdminSessionManager';
import AdminLayoutContent from '@/components/layout/admin/AdminLayoutContent';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { useAdminRouteState } from '@/components/layout/admin/useAdminRouteState';

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
  hideTitle = true,
  className = ""
}: AdminBaseLayoutProps) => {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const { isAdmin, isVerifying } = useAdminVerification();
  const notification = useNotification();
  const { isPageLoading } = useAdminRouteState();

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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
    </div>;
  }
  
  if (!session || !isAdmin) {
    // Don't render anything if not authenticated or not admin - the session manager will redirect
    return <AdminSessionManager onSessionChange={handleSessionChange} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AdminSessionManager onSessionChange={handleSessionChange} />
      
      {/* AdminHeader is now directly included here and only once */}
      <AdminHeader 
        onHomeClick={handleHomeClick}
        onLogout={handleLogout}
        onViewAsClient={handleViewAsClient}
      />
      
      <AdminLayoutContent
        title={title}
        hideTitle={hideTitle}
        isPageLoading={isPageLoading}
      >
        <div className={className}>
          {description && <p className="text-gray-600 mb-4 text-sm">{description}</p>}
          {children || <Outlet />}
        </div>
      </AdminLayoutContent>
    </div>
  );
};

export default AdminBaseLayout;

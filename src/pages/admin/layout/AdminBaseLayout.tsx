
import React, { useState, useEffect, Suspense, lazy } from 'react';
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

// Componente de loading optimizado
const LoadingSpinner = React.memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
  </div>
));

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

  // Optimización: reducir tiempo de loading con timeout más agresivo
  useEffect(() => {
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached, forcing UI update");
        setLoading(false);
      }
    }, 1500); // Reducido de 3000ms a 1500ms

    return () => clearTimeout(loadingTimeout);
  }, [loading]);

  const handleSessionChange = React.useCallback((newSession: any | null) => {
    setSession(newSession);
    if (newSession) {
      // Delay más corto para mejorar la percepción de velocidad
      setTimeout(() => setLoading(false), 200);
    } else {
      setLoading(false);
    }
  }, []);

  // Optimización: memoizar las verificaciones de estado
  const shouldShowLoading = React.useMemo(() => {
    return loading || isVerifying;
  }, [loading, isVerifying]);

  const shouldRedirect = React.useMemo(() => {
    return !isVerifying && !isAdmin && !loading && user;
  }, [isAdmin, isVerifying, loading, user]);

  // Redirect si no es admin (optimizado con useCallback)
  const handleRedirect = React.useCallback(() => {
    if (shouldRedirect) {
      notification.showError("Access Denied", "You don't have admin privileges.");
      navigate('/client-portal');
    }
  }, [shouldRedirect, notification, navigate]);

  useEffect(() => {
    handleRedirect();
  }, [handleRedirect]);

  // Optimización: memoizar handlers para evitar re-creaciones
  const handleLogout = React.useCallback(async () => {
    try {
      await supabase.auth.signOut();
      notification.showSuccess("Signed Out", "You have been signed out successfully.");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      notification.showError("Sign Out Failed", "Failed to sign out. Please try again.");
      navigate('/login');
    }
  }, [notification, navigate]);

  const handleViewAsClient = React.useCallback(() => {
    navigate('/client-portal');
    notification.showInfo("Client View", "You are now viewing the client portal as an admin.");
  }, [navigate, notification]);

  const handleHomeClick = React.useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Update loading state más rápido
  useEffect(() => {
    if (!isVerifying && session) {
      setLoading(false);
    }
  }, [isVerifying, session]);

  if (shouldShowLoading) {
    return <LoadingSpinner />;
  }
  
  if (!session || !isAdmin) {
    return <AdminSessionManager onSessionChange={handleSessionChange} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AdminSessionManager onSessionChange={handleSessionChange} />
      
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
        <Suspense fallback={<div className="p-4">Loading...</div>}>
          <div className={className}>
            {description && <p className="text-gray-600 mb-4 text-sm">{description}</p>}
            {children || <Outlet />}
          </div>
        </Suspense>
      </AdminLayoutContent>
    </div>
  );
};

export default React.memo(AdminBaseLayout);

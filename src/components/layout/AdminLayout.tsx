
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { LayoutDashboard, PenSquare, Webhook, Wand2, MessageSquare, Mail, Bell, Globe, Settings, Users, Zap, HelpCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import AdminHeader from './admin/AdminHeader';
import AdminNavTabs from './admin/AdminNavTabs';
import AdminContent from './admin/AdminContent';
import { AdminRouteType } from './admin/types';
import { useNotification } from '@/hooks/useNotification';

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('content');
  const isMobile = useIsMobile();
  const notification = useNotification();

  // Admin routes definition
  const adminRoutes: AdminRouteType[] = [
    { value: 'content', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'blog', label: 'Blog', icon: PenSquare },
    { value: 'automatic-blog', label: 'AI Blog', icon: Wand2 },
    { value: 'automations', label: 'Automations', icon: Zap },
    { value: 'support', label: 'Support', icon: HelpCircle },
    { value: 'webhooks', label: 'Webhooks', icon: Webhook },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { value: 'newsletters', label: 'Newsletter', icon: Mail },
    { value: 'notifications', label: 'Notifications', icon: Bell }
  ];

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error checking session:", error);
          notification.showError("Authentication Error", "Please try logging in again.");
          navigate('/login?redirect=/admin');
          setLoading(false);
          return;
        }
        
        setSession(data.session);
        setLoading(false);
        
        if (!data.session) {
          navigate('/login?redirect=/admin');
        }
      } catch (error) {
        console.error("Error in checkSession:", error);
        notification.showError("Session Error", "Failed to verify your session. Using limited admin mode.");
        setLoading(false);
      }
    };
    
    checkSession();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (event === 'SIGNED_OUT') {
          navigate('/login');
        }
      }
    );
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [navigate, notification]);
  
  useEffect(() => {
    // Extract the current admin section from the URL path
    const path = location.pathname;
    const segments = path.split('/');
    if (segments.length > 2 && segments[1] === 'admin') {
      setActiveTab(segments[2] || 'content');
    } else {
      setActiveTab('content');
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      notification.showSuccess("Signed Out", "You have been signed out successfully.");
      navigate('/login');
    } catch (error) {
      console.error("Error signing out:", error);
      notification.showError("Sign Out Failed", "Failed to sign out. Please try again.");
      // Force a redirect to login page even if signOut fails
      navigate('/login');
    }
  };

  const handleViewAsClient = () => {
    navigate('/client-portal');
    notification.showInfo("Client View", "You are now viewing the client portal as an admin.");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    navigate(`/admin/${value}`);
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader 
        activeTab={activeTab}
        adminRoutes={adminRoutes}
        onTabChange={handleTabChange}
        onHomeClick={handleHomeClick}
        onLogout={handleLogout}
        onViewAsClient={handleViewAsClient}
      />
      
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {!isMobile && (
          <AdminNavTabs 
            activeTab={activeTab}
            adminRoutes={adminRoutes}
            onTabChange={handleTabChange}
          />
        )}
        
        <AdminContent>
          {children}
        </AdminContent>
      </div>
    </div>
  );
};

export default AdminLayout;

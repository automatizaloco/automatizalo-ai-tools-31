import { useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useIsMobile } from '@/hooks/use-mobile';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';
import { useNotification } from '@/hooks/useNotification';

// Lazy load components for better performance
const AdminHeader = lazy(() => import('./admin/AdminHeader'));
const AdminNavTabs = lazy(() => import('./admin/AdminNavTabs'));

// Import types directly to avoid circular dependencies
import { AdminRouteType } from './admin/types';
import { 
  LayoutDashboard, 
  PenSquare, 
  Webhook, 
  Wand2, 
  MessageSquare, 
  Mail, 
  Bell, 
  Users, 
  Zap, 
  HelpCircle,
  Loader2 
} from 'lucide-react';

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
  hideTitle?: boolean;
}

const AdminLayout = ({ children, title = "Admin Dashboard", hideTitle = false }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('content');
  const isMobile = useIsMobile();
  const notification = useNotification();

  // Admin routes definition - memoized to prevent recreating on rerenders
  const adminRoutes: AdminRouteType[] = useMemo(() => [
    { value: 'content', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'users', label: 'Users', icon: Users },
    { value: 'blog', label: 'Blog', icon: PenSquare },
    { value: 'automatic-blog', label: 'AI Blog', icon: Wand2 },
    { value: 'client-automations', label: 'Client Automations', icon: Zap },
    { value: 'automations', label: 'Automations', icon: Zap },
    { value: 'support', label: 'Support', icon: HelpCircle },
    { value: 'webhooks', label: 'Webhooks', icon: Webhook },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { value: 'newsletters', label: 'Newsletter', icon: Mail },
    { value: 'notifications', label: 'Notifications', icon: Bell }
  ], []);

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
        notification.showError("Session Error", "Failed to verify your session.");
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
    const path = location.pathname;
    const segments = path.split('/');
    
    if (segments.length > 2 && segments[1] === 'admin') {
      const section = segments[2] || 'content';
      setActiveTab(section);
    } else {
      setActiveTab('content');
    }
  }, [location.pathname]);

  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

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

  const handleTabChange = useCallback((value: string) => {
    if (value === activeTab) return;
    setIsPageLoading(true);
    setActiveTab(value);
    navigate(`/admin/${value === 'content' ? '' : value}`);
  }, [activeTab, navigate]);

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-gray-500">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
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
      
      {isPageLoading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <Progress value={100} className="h-1 animate-pulse" />
        </div>
      )}
      
      <div className="w-full overflow-hidden">
        <div className={`${isMobile ? 'mt-2 px-2' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'}`}>
          <Suspense fallback={<div className="h-10 animate-pulse"></div>}>
            <AdminNavTabs 
              navItems={adminRoutes}
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </Suspense>
          
          {!hideTitle && title && (
            <h1 className={`${isMobile ? 'text-xl mb-2 px-1' : 'text-2xl mb-3'} font-bold mt-2`}>
              {title}
            </h1>
          )}
          
          <div className="mt-2 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

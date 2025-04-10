
import { useNavigate, useLocation } from 'react-router-dom';
import { ReactNode, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { Menu, PenSquare, MessageSquare, Mail, LayoutDashboard, Globe, Sparkles, Webhook } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

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

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
      
      if (!data.session) {
        navigate('/login?redirect=/admin');
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
  }, [navigate]);
  
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
    await supabase.auth.signOut();
    navigate('/login');
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

  const adminRoutes = [
    { value: 'content', label: 'Dashboard', icon: LayoutDashboard },
    { value: 'blog', label: 'Blog', icon: PenSquare },
    { value: 'automatic-blog', label: 'Auto Blog', icon: Sparkles },
    { value: 'webhooks', label: 'Webhooks', icon: Webhook },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare },
    { value: 'newsletter', label: 'Newsletter', icon: Mail },
    { value: 'content-editor', label: 'Website Content', icon: Globe },
    { value: 'notifications', label: 'Notifications', icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {isMobile ? (
        <div className="bg-white shadow sticky top-0 z-50">
          <div className="px-4 h-16 flex justify-between items-center">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-lg font-bold">Admin</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleHomeClick}>
                Home
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b">
                      <h2 className="text-lg font-semibold">Navigation</h2>
                    </div>
                    <div className="flex flex-col py-2 flex-1">
                      {adminRoutes.map((route) => {
                        const Icon = route.icon || Globe;
                        return (
                          <Button
                            key={route.value}
                            variant={activeTab === route.value ? "default" : "ghost"}
                            className="justify-start rounded-none h-12 px-4"
                            onClick={() => handleTabChange(route.value)}
                          >
                            <Icon className="h-4 w-4 mr-2" />
                            {route.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={handleHomeClick}>Back to Homepage</Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}`}>
        {!isMobile && (
          <Tabs 
            value={activeTab}
            className="w-full mb-8"
            onValueChange={handleTabChange}
          >
            <TabsList className="grid grid-cols-8 w-full">
              {adminRoutes.map((route) => {
                const Icon = route.icon || Globe;
                return (
                  <TabsTrigger key={route.value} value={route.value} className="flex items-center gap-1">
                    <Icon className="h-4 w-4" />
                    <span>{route.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        )}
        
        <div className={`bg-white shadow rounded-lg ${isMobile ? 'p-3' : 'p-6'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;

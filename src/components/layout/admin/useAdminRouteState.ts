
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  HelpCircle
} from 'lucide-react';
import { AdminRouteType } from './types';

export const useAdminRouteState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');

  // Admin routes definition - memoized to prevent recreating on rerenders
  const adminRoutes: AdminRouteType[] = useMemo(() => [
    { value: 'content', label: 'Home', icon: LayoutDashboard, priority: 10 },
    { value: 'users', label: 'Users', icon: Users, priority: 9 },
    { value: 'blog', label: 'Blog', icon: PenSquare, priority: 8 },
    { value: 'automatic-blog', label: 'AI Blog', icon: Wand2, priority: 7 },
    { value: 'client-automations', label: 'Client Automations', icon: Zap, priority: 6 },
    { value: 'automations', label: 'Automations', icon: Zap, priority: 5 },
    { value: 'support', label: 'Support', icon: HelpCircle, priority: 4 },
    { value: 'webhooks', label: 'Webhooks', icon: Webhook, priority: 3 },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare, priority: 2 },
    { value: 'newsletters', label: 'Newsletter', icon: Mail, priority: 1 },
    { value: 'notifications', label: 'Notifications', icon: Bell, priority: 0 }
  ], []);

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    const segments = path.split('/');
    
    if (segments.length > 2 && segments[1] === 'admin') {
      const section = segments[2] || 'content';
      setActiveTab(section);
    } else if (path === '/admin') {
      setActiveTab('content');
    }
  }, [location.pathname]);

  // Add loading state when switching pages
  useEffect(() => {
    setIsPageLoading(true);
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 200);
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Handle tab changes and navigation
  const handleTabChange = useCallback((value: string) => {
    if (value === activeTab) return;
    
    setIsPageLoading(true);
    setActiveTab(value);
    
    // Navigate to the appropriate route
    const route = value === 'content' ? '/admin' : `/admin/${value}`;
    navigate(route);
  }, [activeTab, navigate]);

  return {
    activeTab,
    setActiveTab,
    isPageLoading,
    adminRoutes,
    handleTabChange,
  };
};

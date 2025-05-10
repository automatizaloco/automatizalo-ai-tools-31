
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
  const [activeTab, setActiveTab] = useState<string>('content');

  // Admin routes definition - memoized to prevent recreating on rerenders
  const adminRoutes: AdminRouteType[] = useMemo(() => [
    { value: 'content', label: 'Dashboard', icon: LayoutDashboard, priority: 10 },
    { value: 'users', label: 'Users', icon: Users, priority: 9 },
    { value: 'blog', label: 'Blog', icon: PenSquare, priority: 8 },
    { value: 'automatic-blog', label: 'AI Blog', icon: Wand2, priority: 7 }, // Fixed route value
    { value: 'client-automations', label: 'Client Automations', icon: Zap, priority: 6 },
    { value: 'automations', label: 'Automations', icon: Zap, priority: 5 },
    { value: 'support', label: 'Support', icon: HelpCircle, priority: 4 },
    { value: 'webhooks', label: 'Webhooks', icon: Webhook, priority: 3 },
    { value: 'testimonials', label: 'Testimonials', icon: MessageSquare, priority: 2 },
    { value: 'newsletters', label: 'Newsletter', icon: Mail, priority: 1 },
    { value: 'notifications', label: 'Notifications', icon: Bell, priority: 0 }
  ], []);

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

  const handleTabChange = useCallback((value: string) => {
    if (value === activeTab) return;
    setIsPageLoading(true);
    setActiveTab(value);
    
    // Navigate to the appropriate route
    navigate(`/admin/${value === 'content' ? '' : value}`);
  }, [activeTab, navigate]);

  return {
    activeTab,
    setActiveTab,
    isPageLoading,
    adminRoutes,
    handleTabChange,
  };
};

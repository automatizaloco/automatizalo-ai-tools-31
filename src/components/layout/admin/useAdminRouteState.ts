
import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('content');

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
  }, [activeTab]);

  return {
    activeTab,
    setActiveTab,
    isPageLoading,
    adminRoutes,
    handleTabChange,
  };
};

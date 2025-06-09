
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

  // Memoizar rutas para evitar recreación en cada render
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

  // Optimización: memoizar el cálculo del activeTab
  const calculateActiveTab = useCallback((pathname: string) => {
    const segments = pathname.split('/');
    if (segments.length > 2 && segments[1] === 'admin') {
      return segments[2] || 'content';
    }
    return pathname === '/admin' ? 'content' : '';
  }, []);

  // Actualizar activeTab de manera optimizada
  useEffect(() => {
    const newActiveTab = calculateActiveTab(location.pathname);
    if (newActiveTab !== activeTab) {
      setActiveTab(newActiveTab);
    }
  }, [location.pathname, activeTab, calculateActiveTab]);

  // Loading state más rápido y optimizado
  useEffect(() => {
    setIsPageLoading(true);
    
    // Reducir tiempo de loading para mejor UX
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 100); // Reducido de 200ms a 100ms
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  // Optimización: memoizar handler de navegación
  const handleTabChange = useCallback((value: string) => {
    if (value === activeTab) return;
    
    setIsPageLoading(true);
    setActiveTab(value);
    
    const route = value === 'content' ? '/admin' : `/admin/${value}`;
    navigate(route);
  }, [activeTab, navigate]);

  // Memoizar el valor de retorno para evitar re-renderizados
  return useMemo(() => ({
    activeTab,
    setActiveTab,
    isPageLoading,
    adminRoutes,
    handleTabChange,
  }), [activeTab, isPageLoading, adminRoutes, handleTabChange]);
};

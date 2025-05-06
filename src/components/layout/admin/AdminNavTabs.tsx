
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AdminRouteType } from './types';
import { useIsMobile } from '@/hooks/use-mobile';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AdminNavTabsProps {
  navItems: AdminRouteType[];
  activeTab?: string;
  onTabChange?: (value: string) => void;
}

const AdminNavTabs: React.FC<AdminNavTabsProps> = ({ 
  navItems,
  activeTab: propActiveTab,
  onTabChange
}) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  // Extract path without considering query params
  const currentPath = location.pathname.split('?')[0];
  // Use the activeTab prop if provided, otherwise determine from the currentPath
  const activeTab = propActiveTab || currentPath;
  
  const navLinks = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/client-automations", label: "Client Automations" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/blog", label: "Blog" },
    { path: "/admin/automations", label: "Automations" },
    { path: "/admin/testimonials", label: "Testimonials" },
    { path: "/admin/support", label: "Support" },
    { path: "/admin/newsletters", label: "Newsletter" },
    { path: "/admin/webhooks", label: "Webhooks" },
    { path: "/admin/notifications", label: "Notifications" }
  ];

  // Hide the horizontal navigation menu on mobile - The menu is already in the hamburger menu
  if (isMobile) {
    return null;
  }

  // Desktop version
  return (
    <ScrollArea className="w-full pb-2">
      <div className="flex items-center space-x-4 mx-6 overflow-x-auto pb-2 min-w-max">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap py-2 px-3",
              (currentPath === link.path || 
              (link.path !== "/admin" && currentPath.includes(link.path)))
                ? "text-primary bg-primary/10 rounded-md"
                : "text-muted-foreground"
            )}
            onClick={() => onTabChange && onTabChange(link.path.split('/').pop() || 'dashboard')}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </ScrollArea>
  );
};

export default AdminNavTabs;

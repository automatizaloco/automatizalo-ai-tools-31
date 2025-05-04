
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { AdminRouteType } from './types';

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
  
  // Extract path without considering query params
  const currentPath = location.pathname.split('?')[0];
  // Use the activeTab prop if provided, otherwise determine from the currentPath
  const activeTab = propActiveTab || currentPath;
  
  return (
    <nav className="flex items-center space-x-4 lg:space-x-6 mx-6">
      <Link
        to="/admin"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentPath === "/admin"
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => onTabChange && onTabChange('dashboard')}
      >
        Dashboard
      </Link>
      {/* Add this new link to Client Automations */}
      <Link
        to="/admin/client-automations"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentPath === "/admin/client-automations"
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => onTabChange && onTabChange('client-automations')}
      >
        Client Automations
      </Link>
      <Link
        to="/admin/blog"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentPath.includes("/admin/blog")
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => onTabChange && onTabChange('blog')}
      >
        Blog
      </Link>
      <Link
        to="/admin/automations"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentPath === "/admin/automations"
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => onTabChange && onTabChange('automations')}
      >
        Automations
      </Link>
      <Link
        to="/admin/testimonials"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentPath === "/admin/testimonials"
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => onTabChange && onTabChange('testimonials')}
      >
        Testimonials
      </Link>
      <Link
        to="/admin/support"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          currentPath === "/admin/support"
            ? "text-primary"
            : "text-muted-foreground"
        )}
        onClick={() => onTabChange && onTabChange('support')}
      >
        Support
      </Link>
    </nav>
  );
};

export default AdminNavTabs;

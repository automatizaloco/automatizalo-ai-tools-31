import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { IconType } from './types';

interface AdminNavTabsProps {
  navItems: IconType[];
}

const AdminNavTabs: React.FC<AdminNavTabsProps> = ({ navItems }) => {
  const location = useLocation();
  
  // Extract path without considering query params
  const currentPath = location.pathname.split('?')[0];
  
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
      >
        Support
      </Link>
    </nav>
  );
};

export default AdminNavTabs;

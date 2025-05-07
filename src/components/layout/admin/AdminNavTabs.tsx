
import React, { useMemo } from 'react';
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
  
  // Early return for mobile devices - no horizontal nav
  if (isMobile) {
    return null;
  }
  
  // Extract path without considering query params
  const currentPath = location.pathname.split('?')[0];
  // Use the activeTab prop if provided, otherwise determine from the currentPath
  const activeTab = propActiveTab || currentPath;

  // Use the navItems prop passed from the parent component
  return (
    <ScrollArea className="w-full pb-2">
      <div className="flex items-center space-x-4 mx-6 overflow-x-auto pb-2 min-w-max">
        {navItems.map((item) => {
          const path = `/admin/${item.value === 'content' ? '' : item.value}`;
          return (
            <Link
              key={item.value}
              to={path}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap py-2 px-3",
                (currentPath === path || 
                (path !== "/admin" && currentPath.includes(path)))
                  ? "text-primary bg-primary/10 rounded-md"
                  : "text-muted-foreground"
              )}
              onClick={() => onTabChange && onTabChange(item.value)}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default React.memo(AdminNavTabs);

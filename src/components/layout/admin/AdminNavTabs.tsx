
import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
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

  const handleTabChange = (value: string) => {
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <ScrollArea className="w-full">
      <div className="flex items-center space-x-4 px-2 overflow-x-auto pb-2 min-w-max">
        {navItems.map((item) => {
          const path = `/admin/${item.value === 'content' ? '' : item.value}`;
          const isActive = activeTab === item.value || 
                         (path !== "/admin" && currentPath.includes(path));
          
          return (
            <button
              key={item.value}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary whitespace-nowrap py-2 px-3",
                isActive
                  ? "text-primary bg-primary/10 rounded-md"
                  : "text-muted-foreground"
              )}
              onClick={() => handleTabChange(item.value)}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default React.memo(AdminNavTabs);

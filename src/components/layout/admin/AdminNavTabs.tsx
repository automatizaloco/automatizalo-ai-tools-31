
import React, { useMemo, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
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
    
    // Navigate to the appropriate route
    const route = value === 'content' ? '/admin' : `/admin/${value}`;
    navigate(route);
  };

  // Scroll active tab into view
  useEffect(() => {
    if (scrollContainerRef.current) {
      const activeEl = scrollContainerRef.current.querySelector('[data-state="active"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab, propActiveTab]);

  return (
    <div className="relative">
      <ScrollArea className="w-full">
        <div 
          ref={scrollContainerRef}
          className="flex items-center space-x-1 px-1 overflow-x-auto pb-2 min-w-max border-b mb-4 scrollbar-hide"
        >
          {navItems.map((item) => {
            const path = item.value === 'content' ? '/admin' : `/admin/${item.value}`;
            const isActive = activeTab === item.value || 
                         (currentPath === path) ||
                         (currentPath.startsWith(path + '/'));
            
            return (
              <button
                key={item.value}
                data-state={isActive ? "active" : "inactive"}
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
      
      {/* Shadow indicators for scroll */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
};

export default React.memo(AdminNavTabs);

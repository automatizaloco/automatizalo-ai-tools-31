
import React, { useRef, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminRouteType } from './types';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

interface AdminNavTabsProps {
  activeTab: string;
  adminRoutes: AdminRouteType[];
  onTabChange: (value: string) => void;
}

const AdminNavTabs: React.FC<AdminNavTabsProps> = ({
  activeTab,
  adminRoutes,
  onTabChange
}) => {
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Scroll active tab into view on mobile
  useEffect(() => {
    if (isMobile && scrollRef.current) {
      const activeElement = scrollRef.current.querySelector(`[data-active="true"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }
  }, [activeTab, isMobile]);
  
  if (isMobile) {
    return (
      <div ref={scrollRef} className="w-full overflow-x-auto mb-4 no-scrollbar">
        <NavigationMenu className="max-w-none w-auto">
          <NavigationMenuList className="flex space-x-2 p-1">
            {adminRoutes.map((route) => {
              const Icon = route.icon || null;
              const isActive = activeTab === route.value;
              
              return (
                <NavigationMenuItem key={route.value}>
                  <NavigationMenuLink
                    onClick={() => onTabChange(route.value)}
                    className={cn(
                      "flex items-center gap-1 px-3 py-2 rounded-md text-sm",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-accent text-muted-foreground"
                    )}
                    data-active={isActive}
                  >
                    {Icon && <Icon className="h-4 w-4" />}
                    <span>{route.label}</span>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }
  
  return (
    <div className="w-full mb-8 border-b">
      <NavigationMenu className="max-w-none">
        <NavigationMenuList className="flex space-x-1 p-1">
          {adminRoutes.map((route) => {
            const Icon = route.icon || null;
            const isActive = activeTab === route.value;
            
            return (
              <NavigationMenuItem key={route.value}>
                <NavigationMenuLink
                  onClick={() => onTabChange(route.value)}
                  className={cn(
                    "flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-background text-foreground border-b-2 border-primary" 
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                  data-active={isActive}
                >
                  {Icon && <Icon className="h-4 w-4" />}
                  <span>{route.label}</span>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default AdminNavTabs;

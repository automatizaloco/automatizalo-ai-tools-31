
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminRouteType } from './types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  
  // For mobile, we use the sheet menu instead, so don't render tabs
  if (isMobile) {
    return null;
  }
  
  return (
    <Tabs 
      value={activeTab}
      className="w-full mb-8"
      onValueChange={onTabChange}
    >
      <TabsList className="grid grid-cols-5 md:grid-cols-7 w-full overflow-x-auto">
        {adminRoutes.map((route) => {
          const Icon = route.icon || null;
          return (
            <TabsTrigger key={route.value} value={route.value} className="flex items-center gap-1">
              {Icon && <Icon className="h-4 w-4" />}
              <span>{route.label}</span>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
};

export default AdminNavTabs;

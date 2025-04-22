
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AdminRouteType } from './types';

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
  return (
    <Tabs 
      value={activeTab}
      className="w-full mb-8"
      onValueChange={onTabChange}
    >
      <TabsList className="grid grid-cols-7 w-full">
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

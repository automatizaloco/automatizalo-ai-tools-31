
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminNavItem } from './AdminNavItem';
import { AdminRouteType } from './types';

interface AdminHeaderProps {
  activeTab: string;
  adminRoutes: AdminRouteType[];
  onTabChange: (value: string) => void;
  onHomeClick: () => void;
  onLogout: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  adminRoutes,
  onTabChange,
  onHomeClick,
  onLogout
}) => {
  const isMobile = useIsMobile();

  return (
    <div className="bg-white shadow sticky top-0 z-50">
      <div className="px-4 h-16 flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center">
          <h1 className="text-lg font-bold">Admin</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onHomeClick}>
            Home
          </Button>
          <Button variant="outline" size={isMobile ? "sm" : "default"} onClick={onLogout}>
            Logout
          </Button>
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold">Navigation</h2>
                  </div>
                  <div className="flex flex-col py-2 flex-1">
                    {adminRoutes.map((route) => (
                      <AdminNavItem
                        key={route.value}
                        route={route}
                        isActive={activeTab === route.value}
                        onClick={() => onTabChange(route.value)}
                      />
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;

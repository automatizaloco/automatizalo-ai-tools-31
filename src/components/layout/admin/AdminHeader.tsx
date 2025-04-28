
import React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Eye } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { useIsMobile } from '@/hooks/use-mobile';
import { AdminNavItem } from './AdminNavItem';
import { AdminRouteType } from './types';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { adminTranslations } from '@/translations/adminTranslations';

interface AdminHeaderProps {
  activeTab: string;
  adminRoutes: AdminRouteType[];
  onTabChange: (value: string) => void;
  onHomeClick: () => void;
  onLogout: () => void;
  onViewAsClient: () => void;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  adminRoutes,
  onTabChange,
  onHomeClick,
  onLogout,
  onViewAsClient
}) => {
  const isMobile = useIsMobile();
  const { language } = useLanguage();
  const t = adminTranslations[language].adminHeader;

  return (
    <div className="bg-white shadow sticky top-0 z-50">
      <div className="px-4 h-16 flex justify-between items-center">
        <div className="flex-shrink-0 flex items-center">
          <h1 className="text-lg font-bold">{t.adminTitle}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          
          <div className="flex items-center">
            <Button 
              variant="outline" 
              size={isMobile ? "sm" : "default"} 
              onClick={onViewAsClient}
              className="flex items-center gap-1"
            >
              <Eye className="h-4 w-4" />
              {!isMobile && t.viewAsClient}
            </Button>
          </div>
          
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            onClick={onHomeClick}
          >
            {t.home}
          </Button>
          
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"} 
            onClick={onLogout}
            className="mr-2"
          >
            {t.logout}
          </Button>
          
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>{t.navigation}</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-2 flex-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                  {adminRoutes.map((route) => (
                    <AdminNavItem
                      key={route.value}
                      route={route}
                      isActive={activeTab === route.value}
                      onClick={() => {
                        onTabChange(route.value);
                      }}
                    />
                  ))}
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

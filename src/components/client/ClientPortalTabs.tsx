
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/context/LanguageContext';
import MyAutomationsView from './MyAutomationsView';
import MarketplaceView from './MarketplaceView';
import SupportTicketsView from './SupportTicketsView';

interface ClientPortalTabsProps {
  defaultTab?: string;
}

const ClientPortalTabs: React.FC<ClientPortalTabsProps> = ({ defaultTab = 'my-automations' }) => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow">
      <Tabs defaultValue={defaultTab} className="w-full">
        <div className="border-b">
          <TabsList className="h-14 rounded-none w-full justify-start gap-8 px-6 bg-transparent">
            <TabsTrigger 
              value="my-automations" 
              className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
            >
              {t('clientPortal.myAutomations')}
            </TabsTrigger>
            <TabsTrigger 
              value="marketplace" 
              className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
            >
              {t('clientPortal.marketplace')}
            </TabsTrigger>
            <TabsTrigger 
              value="support" 
              className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
            >
              {t('clientPortal.support')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <div className="p-6">
          <TabsContent value="my-automations" className="mt-0">
            <MyAutomationsView />
          </TabsContent>
          
          <TabsContent value="marketplace" className="mt-0">
            <MarketplaceView />
          </TabsContent>
          
          <TabsContent value="support" className="mt-0">
            <SupportTicketsView />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ClientPortalTabs;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import MarketplaceView from './MarketplaceView';
import MyAutomationsView from './MyAutomationsView';
import SupportTicketsView from './SupportTicketsView';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('automations');
  const isMobile = useIsMobile();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
    } catch (error: any) {
      toast.error('Error logging out');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <Button variant="outline" onClick={handleLogout} className="z-10">Logout</Button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <Tabs 
          defaultValue="automations" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="border-b overflow-x-auto">
            <TabsList className={`h-14 rounded-none ${isMobile ? 'w-full justify-between px-2' : 'w-full justify-start gap-4 px-4'}`}>
              <TabsTrigger value="automations" className="text-base whitespace-nowrap">
                My Automations
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="text-base whitespace-nowrap">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="support" className="text-base whitespace-nowrap">
                Support
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-4 md:p-6">
            <TabsContent value="automations">
              <MyAutomationsView />
            </TabsContent>
            
            <TabsContent value="marketplace">
              <MarketplaceView />
            </TabsContent>
            
            <TabsContent value="support">
              <SupportTicketsView />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientDashboard;


import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MarketplaceView from './MarketplaceView';
import MyAutomationsView from './MyAutomationsView';
import SupportTicketsView from './SupportTicketsView';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('automations');

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <Tabs defaultValue="automations" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="h-14 w-full rounded-none justify-start gap-4 px-4">
              <TabsTrigger value="automations" className="text-base">
                My Automations
              </TabsTrigger>
              <TabsTrigger value="marketplace" className="text-base">
                Marketplace
              </TabsTrigger>
              <TabsTrigger value="support" className="text-base">
                Support
              </TabsTrigger>
            </TabsList>
          </div>
          
          <div className="p-6">
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

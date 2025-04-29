
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import MarketplaceView from './MarketplaceView';
import MyAutomationsView from './MyAutomationsView';
import SupportTicketsView from './SupportTicketsView';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  // Mobile view with accordion
  if (isMobile) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col mb-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold">Client Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} size="sm">Logout</Button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <Accordion type="single" defaultValue="automations" collapsible className="w-full">
            <AccordionItem value="automations">
              <AccordionTrigger className="px-4 py-3 font-medium">
                My Automations
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <MyAutomationsView />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="marketplace">
              <AccordionTrigger className="px-4 py-3 font-medium">
                Marketplace
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <MarketplaceView />
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="support">
              <AccordionTrigger className="px-4 py-3 font-medium">
                Support
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <SupportTicketsView />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    );
  }

  // Desktop view with tabs
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Client Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>Logout</Button>
      </div>
      
      <div className="bg-white shadow rounded-lg">
        <Tabs 
          defaultValue="automations" 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="w-full"
        >
          <div className="border-b">
            <TabsList className="h-14 rounded-none w-full justify-start gap-4 px-4">
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

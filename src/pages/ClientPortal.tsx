
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientLogin from '@/components/client/ClientLogin';
import { useAuth } from '@/context/AuthContext';
import MyAutomationsView from '@/components/client/MyAutomationsView';
import MarketplaceView from '@/components/client/MarketplaceView';
import SupportTicketsView from '@/components/client/SupportTicketsView';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';
import TicketDetailView from '@/components/client/TicketDetailView';
import AdvancedAutomationDetails from '@/components/client/automation/AdvancedAutomationDetails';

interface ClientPortalProps {
  defaultTab?: string;
  view?: string | null;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ 
  defaultTab = 'my-automations', 
  view = null 
}) => {
  const { user } = useAuth();
  const { ticketId, automationId } = useParams<{ ticketId: string; automationId: string }>();

  if (!user) {
    return <ClientLogin />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* If we're showing automation details view */}
        {view === 'details' && automationId && (
          <AdvancedAutomationDetails />
        )}

        {/* If we're showing support ticket detail or new support ticket form */}
        {view === 'ticket-detail' && ticketId && (
          <div className="max-w-4xl mx-auto">
            <TicketDetailView ticketId={ticketId} />
          </div>
        )}
        
        {view === 'new-ticket' && (
          <div className="max-w-4xl mx-auto">
            <NewSupportTicketForm />
          </div>
        )}

        {/* Main tab view (only shown when not in a detail view) */}
        {!view && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Client Portal</h1>
              <p className="text-gray-600">Manage your automations and integrations</p>
            </div>

            <div className="bg-white rounded-lg shadow">
              <Tabs defaultValue={defaultTab} className="w-full">
                <div className="border-b">
                  <TabsList className="h-14 rounded-none w-full justify-start gap-8 px-6 bg-transparent">
                    <TabsTrigger 
                      value="my-automations" 
                      className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
                    >
                      My Automations
                    </TabsTrigger>
                    <TabsTrigger 
                      value="marketplace" 
                      className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
                    >
                      Marketplace
                    </TabsTrigger>
                    <TabsTrigger 
                      value="support" 
                      className="text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-700"
                    >
                      Support
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;

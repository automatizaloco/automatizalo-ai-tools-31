
import React from 'react';
import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientDashboard from '@/components/client/ClientDashboard';
import ClientLogin from '@/components/client/ClientLogin';
import { useAuth } from '@/context/AuthContext';
import MyAutomationsView from '@/components/client/MyAutomationsView';
import MarketplaceView from '@/components/client/MarketplaceView';
import SupportTicketsView from '@/components/client/SupportTicketsView';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';
import TicketDetailView from '@/components/client/TicketDetailView';
import AutomationDetails from '@/components/client/automation/AutomationDetails';

interface ClientPortalProps {
  defaultTab?: string;
  view?: string | null;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ 
  defaultTab = 'my-automations', 
  view = null 
}) => {
  const { user } = useAuth();
  const { ticketId } = useParams<{ ticketId: string }>();
  const { automationId } = useParams<{ automationId: string }>();

  if (!user) {
    return <ClientLogin />;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20"> {/* Changed mt-16 to mt-20 for more spacing below header */}
      <h1 className="text-3xl font-bold mb-6">Client Portal</h1>

      {/* If we're showing automation details view */}
      {view === 'details' && automationId && (
        <AutomationDetails clientId={user.id} />
      )}

      {/* If we're showing support ticket detail or new support ticket form */}
      {view === 'ticket-detail' && ticketId && (
        <TicketDetailView ticketId={ticketId} />
      )}
      
      {view === 'new-ticket' && (
        <NewSupportTicketForm />
      )}

      {/* Main tab view (only shown when not in a detail view) */}
      {!view && (
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="my-automations">My Automations</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
          </TabsList>

          <TabsContent value="my-automations">
            <MyAutomationsView />
          </TabsContent>

          <TabsContent value="marketplace">
            <MarketplaceView />
          </TabsContent>

          <TabsContent value="support">
            <SupportTicketsView />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default ClientPortal;

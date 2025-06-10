
import React from 'react';
import { useParams } from 'react-router-dom';
import ClientLogin from '@/components/client/ClientLogin';
import { useAuth } from '@/context/AuthContext';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';
import TicketDetailView from '@/components/client/TicketDetailView';
import AdvancedAutomationDetails from '@/components/client/automation/AdvancedAutomationDetails';
import ClientPortalHeader from '@/components/client/ClientPortalHeader';
import ClientPortalTabs from '@/components/client/ClientPortalTabs';

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
            <ClientPortalHeader />
            <ClientPortalTabs defaultTab={defaultTab} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientPortal;

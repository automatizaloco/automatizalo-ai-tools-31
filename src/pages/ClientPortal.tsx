
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import ClientLogin from '@/components/client/ClientLogin';
import ClientDashboard from '@/components/client/ClientDashboard';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';
import TicketDetailView from '@/components/client/TicketDetailView';

const ClientPortal = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { ticketId } = useParams<{ ticketId?: string }>();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // If not logged in, show login component
  if (!user) {
    return <ClientLogin />;
  }

  // For logged in users, show the appropriate content
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      {location.pathname === '/client-portal/support/new' ? (
        <NewSupportTicketForm />
      ) : location.pathname.includes('/client-portal/support/') ? (
        <TicketDetailView />
      ) : (
        <ClientDashboard />
      )}
    </div>
  );
};

export default ClientPortal;

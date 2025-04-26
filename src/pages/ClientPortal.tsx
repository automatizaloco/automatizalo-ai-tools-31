
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ClientLogin from '@/components/client/ClientLogin';
import ClientDashboard from '@/components/client/ClientDashboard';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';

const ClientPortal = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  
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
    <div className="container mx-auto px-4 py-8">
      {location.pathname === '/client-portal/support/new' ? (
        <NewSupportTicketForm />
      ) : (
        <ClientDashboard />
      )}
    </div>
  );
};

export default ClientPortal;

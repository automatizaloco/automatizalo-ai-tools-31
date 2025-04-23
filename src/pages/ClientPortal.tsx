
import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import ClientLogin from '@/components/client/ClientLogin';
import ClientDashboard from '@/components/client/ClientDashboard';

const ClientPortal = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {user ? <ClientDashboard /> : <ClientLogin />}
    </div>
  );
};

export default ClientPortal;

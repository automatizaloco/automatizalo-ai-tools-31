
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import ClientLogin from '@/components/client/ClientLogin';
import ClientDashboard from '@/components/client/ClientDashboard';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';

const ClientPortal = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is admin and redirect if needed
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          // Special case for main admin account
          if (user.email === 'contact@automatizalo.co') {
            console.log('Main admin detected in client portal, redirecting to admin');
            navigate('/admin');
            toast.info('Redirected to admin panel');
            return;
          }
          
          // For other users, check role
          const { data, error } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error checking user role:', error);
            return;
          }
          
          // Admins should be redirected to admin panel
          if (data?.role === 'admin') {
            console.log('Admin user detected, redirecting to admin panel');
            navigate('/admin');
            toast.info('Redirected to admin panel');
          }
        } catch (error) {
          console.error('Error in role check:', error);
        }
      }
    };
    
    if (!isLoading && user) {
      checkUserRole();
    }
  }, [user, isLoading, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Handle different routes within the client portal
  const renderContent = () => {
    const path = location.pathname;
    
    // If user is not logged in, always show login component
    if (!user) {
      return <ClientLogin />;
    }

    // For logged in users, show the appropriate content based on the path
    if (path === '/client-portal/support/new') {
      return <NewSupportTicketForm />;
    }
    
    // Default to dashboard
    return <ClientDashboard />;
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      {renderContent()}
    </div>
  );
};

export default ClientPortal;

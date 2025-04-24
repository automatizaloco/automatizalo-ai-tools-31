
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import ClientLogin from '@/components/client/ClientLogin';
import ClientDashboard from '@/components/client/ClientDashboard';
import NewSupportTicketForm from '@/components/client/NewSupportTicketForm';
import { useNotification } from '@/hooks/useNotification';
import { ArrowLeft } from 'lucide-react';

const ClientPortal = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isViewingAsAdmin, setIsViewingAsAdmin] = useState(false);
  const notification = useNotification();

  // Check user role
  useEffect(() => {
    const checkUserRole = async () => {
      if (user) {
        try {
          // Special case for main admin account
          if (user.email === 'contact@automatizalo.co') {
            console.log('Main admin detected in client portal');
            setUserRole('admin');
            setIsViewingAsAdmin(true);
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
          
          setUserRole(data?.role);
          
          // If admin user but not redirecting
          if (data?.role === 'admin') {
            console.log('Admin user detected in client portal');
            setIsViewingAsAdmin(true);
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
      {isViewingAsAdmin && (
        <div className="bg-amber-50 border border-amber-200 p-3 mb-6 rounded-md flex justify-between items-center">
          <div>
            <p className="font-medium text-amber-800">
              You are viewing the client portal as an admin
            </p>
            <p className="text-sm text-amber-700">
              This is a view-only mode to check the client experience
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin')}
            className="border-amber-300 text-amber-800 hover:bg-amber-100"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Admin
          </Button>
        </div>
      )}
      {renderContent()}
    </div>
  );
};

export default ClientPortal;

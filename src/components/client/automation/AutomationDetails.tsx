
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import IntegrationView from './IntegrationView';
import type { Automation, ClientAutomation } from '@/types/automation';

const AutomationDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [clientAutomation, setClientAutomation] = useState<ClientAutomation | null>(null);

  const { 
    data: automation, 
    isLoading: loadingAutomation 
  } = useQuery({
    queryKey: ['automation', id],
    queryFn: async () => {
      if (!id) throw new Error('No automation ID provided');
      
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .eq('id', id)
        .eq('active', true)
        .maybeSingle();
      
      if (error) throw error;
      return data as Automation;
    },
  });

  const { 
    data: clientSubscription,
    isLoading: loadingSubscription,
    refetch: refetchSubscription
  } = useQuery({
    queryKey: ['client-automation', id, user?.id],
    queryFn: async () => {
      if (!id || !user) throw new Error('Missing required parameters');
      
      const { data, error } = await supabase
        .from('client_automations')
        .select(`
          *,
          automation:automation_id (*)
        `)
        .eq('client_id', user.id)
        .eq('automation_id', id)
        .eq('status', 'active')
        .maybeSingle();
      
      if (error) throw error;
      setClientAutomation(data as ClientAutomation);
      return data as ClientAutomation;
    },
    enabled: !!user && !!id,
  });

  const handleCancelSubscription = async () => {
    if (!clientSubscription) return;
    
    try {
      const { error } = await supabase
        .from('client_automations')
        .update({ status: 'canceled' })
        .eq('id', clientSubscription.id);
      
      if (error) throw error;
      
      toast.success('Subscription canceled successfully');
      refetchSubscription();
    } catch (error) {
      console.error('Error canceling subscription:', error);
      toast.error('Failed to cancel subscription');
    }
  };
  
  const isLoading = loadingAutomation || loadingSubscription;
  const isSubscribed = !!clientSubscription;
  
  // Determine if integrations are set up and ready
  const setupCompleted = clientSubscription?.setup_status === 'completed';
  const hasIntegrations = automation?.has_webhook || 
                         automation?.has_custom_prompt || 
                         automation?.has_form_integration || 
                         automation?.has_table_integration;
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2">Loading automation details...</span>
      </div>
    );
  }
  
  if (!automation) {
    return (
      <div className="text-center p-12 border rounded-lg bg-gray-50">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Automation Not Found</h2>
        <p className="text-gray-600 mb-4">
          The automation you're looking for doesn't exist or is not active.
        </p>
        <Button 
          variant="outline" 
          asChild
        >
          <Link to="/client-portal/marketplace">Back to Marketplace</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{automation.title}</CardTitle>
              {isSubscribed && (
                <div className="mt-1">
                  <Badge className="bg-green-100 text-green-700">
                    Active Subscription
                  </Badge>
                </div>
              )}
            </div>
            {automation.image_url && (
              <img 
                src={automation.image_url} 
                alt={automation.title} 
                className="rounded-lg w-20 h-20 object-cover"
                onError={(e) => {
                  e.currentTarget.src = 'https://placehold.co/120x120?text=Automation';
                }}
              />
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-700">{automation.description}</p>
          
          {isSubscribed && clientSubscription && (
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4 text-sm">
              <div>
                <span className="text-gray-500">Purchase Date</span>
                <p>{format(new Date(clientSubscription.purchase_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <span className="text-gray-500">Next Billing</span>
                <p>{format(new Date(clientSubscription.next_billing_date), 'MMM d, yyyy')}</p>
              </div>
              <div>
                <span className="text-gray-500">Monthly Price</span>
                <p className="font-medium">${automation.monthly_price.toFixed(2)}</p>
              </div>
              <div>
                <span className="text-gray-500">Setup Status</span>
                <p>
                  {clientSubscription.setup_status === 'completed' ? (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200">
                      Ready to use
                    </Badge>
                  ) : clientSubscription.setup_status === 'in_progress' ? (
                    <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-200">
                      Setup in progress
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                      Awaiting setup
                    </Badge>
                  )}
                </p>
              </div>
            </div>
          )}
          
          {/* Features list */}
          {(automation.has_custom_prompt || automation.has_webhook || 
            automation.has_form_integration || automation.has_table_integration) && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-1">Features:</p>
              <div className="flex flex-wrap gap-1">
                {automation.has_custom_prompt && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    Custom Prompt
                  </Badge>
                )}
                {automation.has_webhook && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700">
                    Webhook
                  </Badge>
                )}
                {automation.has_form_integration && (
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    Form Integration
                  </Badge>
                )}
                {automation.has_table_integration && (
                  <Badge variant="outline" className="bg-amber-50 text-amber-700">
                    Table Integration
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
        
        {isSubscribed && (
          <CardFooter className="border-t pt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
              onClick={handleCancelSubscription}
            >
              Cancel Subscription
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {isSubscribed && hasIntegrations && clientSubscription && (
        <>
          {setupCompleted ? (
            <IntegrationView 
              clientAutomationId={clientSubscription.id}
              automationTitle={automation.title}
              hasCustomPrompt={automation.has_custom_prompt}
              hasWebhook={automation.has_webhook}
              hasFormIntegration={automation.has_form_integration}
              hasTableIntegration={automation.has_table_integration}
            />
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="bg-gray-50 p-6 rounded-md text-center">
                  <p className="text-gray-500 font-medium">Your automation is being set up</p>
                  <p className="text-sm text-gray-400 mt-1">
                    Our team is currently setting up your automation. 
                    The integrations will be available once setup is complete.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AutomationDetails;

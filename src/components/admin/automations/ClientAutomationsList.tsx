
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ClientAutomationWithDetails } from './client-integration-utils';

interface ClientAutomationsListProps {
  clientAutomations: ClientAutomationWithDetails[];
  isLoading: boolean;
  onViewConfig: (automation: ClientAutomationWithDetails) => void;
}

const ClientAutomationsList: React.FC<ClientAutomationsListProps> = ({
  clientAutomations,
  isLoading,
  onViewConfig
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Loading client automations...</p>
        </div>
      </div>
    );
  }

  if (clientAutomations.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">No active client automations found</p>
        <p className="text-gray-400 text-sm mt-1">Clients need to purchase automations from the marketplace</p>
      </div>
    );
  }

  const getSetupStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Setup Pending</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Setup In Progress</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Setup Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {clientAutomations.map((clientAutomation) => (
        <Card key={clientAutomation.id}>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-lg">{clientAutomation.automation?.title || 'Unknown Automation'}</h3>
                  {getSetupStatusBadge(clientAutomation.setup_status)}
                </div>
                
                <p className="text-sm text-gray-500 mt-1">
                  Client: {clientAutomation.client?.email || 'Unknown Client'}
                </p>
                
                <p className="text-sm text-gray-500">
                  Purchased: {format(new Date(clientAutomation.purchase_date), 'MMM d, yyyy')} | 
                  Next Billing: {format(new Date(clientAutomation.next_billing_date), 'MMM d, yyyy')}
                </p>
                
                <div className="mt-2 flex flex-wrap gap-1">
                  {clientAutomation.automation?.has_webhook && 
                    <Badge variant="outline" className="bg-purple-50 text-purple-700">Webhook</Badge>}
                  {clientAutomation.automation?.has_custom_prompt && 
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">Custom Prompt</Badge>}
                  {clientAutomation.automation?.has_form_integration && 
                    <Badge variant="outline" className="bg-green-50 text-green-700">Form</Badge>}
                  {clientAutomation.automation?.has_table_integration && 
                    <Badge variant="outline" className="bg-amber-50 text-amber-700">Table</Badge>}
                </div>
              </div>
              
              <div>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                  onClick={() => onViewConfig(clientAutomation)}
                >
                  <Settings className="mr-1 h-3 w-3" />
                  Configure
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ClientAutomationsList;

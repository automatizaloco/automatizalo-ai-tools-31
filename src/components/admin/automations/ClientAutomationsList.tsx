
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Settings } from 'lucide-react';
import { format } from 'date-fns';
import { ClientAutomationWithDetails } from './client-integration-utils';
import EmptyClientAutomationsState from './EmptyClientAutomationsState';
import ClientFilter from './ClientFilter';
import StatusFilter from './StatusFilter';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClientAutomationsListProps {
  clientAutomations: ClientAutomationWithDetails[];
  isLoading: boolean;
  onViewConfig: (automation: ClientAutomationWithDetails) => void;
  selectedClientId: string | null;
  onClientFilterChange: (clientId: string | null) => void;
  selectedStatus: string | null;
  onStatusFilterChange: (status: string | null) => void;
}

const ClientAutomationsList: React.FC<ClientAutomationsListProps> = ({
  clientAutomations,
  isLoading,
  onViewConfig,
  selectedClientId,
  onClientFilterChange,
  selectedStatus,
  onStatusFilterChange
}) => {
  const isMobile = useIsMobile();

  // Filter and sort automations
  const filteredAndSortedAutomations = React.useMemo(() => {
    let filtered = clientAutomations;

    // Filter by client
    if (selectedClientId) {
      filtered = filtered.filter(automation => automation.client_id === selectedClientId);
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter(automation => automation.setup_status === selectedStatus);
    }

    // Sort: completed first, then in_progress, then pending
    return filtered.sort((a, b) => {
      const statusOrder = { 'completed': 0, 'in_progress': 1, 'pending': 2 };
      return statusOrder[a.setup_status as keyof typeof statusOrder] - statusOrder[b.setup_status as keyof typeof statusOrder];
    });
  }, [clientAutomations, selectedClientId, selectedStatus]);

  // Calculate status counts for the filter
  const statusCounts = React.useMemo(() => {
    const baseAutomations = selectedClientId 
      ? clientAutomations.filter(automation => automation.client_id === selectedClientId)
      : clientAutomations;

    return {
      pending: baseAutomations.filter(a => a.setup_status === 'pending').length,
      in_progress: baseAutomations.filter(a => a.setup_status === 'in_progress').length,
      completed: baseAutomations.filter(a => a.setup_status === 'completed').length,
      total: baseAutomations.length
    };
  }, [clientAutomations, selectedClientId]);

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
    <div className="space-y-4 max-w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Client Automations</h2>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {statusCounts.completed} Ready
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            {filteredAndSortedAutomations.length} of {clientAutomations.length}
          </Badge>
        </div>
      </div>

      <div className={`flex gap-4 ${isMobile ? 'flex-col' : 'flex-row'}`}>
        <ClientFilter
          selectedClientId={selectedClientId}
          onClientChange={onClientFilterChange}
        />
        <StatusFilter
          selectedStatus={selectedStatus}
          onStatusChange={onStatusFilterChange}
          statusCounts={statusCounts}
        />
      </div>

      {filteredAndSortedAutomations.length === 0 ? (
        selectedClientId || selectedStatus ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No automations found with the selected filters.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                onClientFilterChange(null);
                onStatusFilterChange(null);
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <EmptyClientAutomationsState />
        )
      ) : (
        filteredAndSortedAutomations.map((clientAutomation) => (
          <Card key={clientAutomation.id} className="overflow-hidden">
            <CardContent className={`pt-6 ${isMobile ? 'px-3' : 'px-6'}`}>
              <div className={`${isMobile ? 'flex flex-col' : 'flex justify-between'}`}>
                <div className={`${isMobile ? 'mb-4' : ''}`}>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className={`font-bold ${isMobile ? 'text-base' : 'text-lg'} break-words`}>
                      {clientAutomation.automation?.title || 'Unknown Automation'}
                    </h3>
                    {getSetupStatusBadge(clientAutomation.setup_status)}
                  </div>
                  
                  <p className="text-sm text-gray-500 mt-1 break-words">
                    Client: {clientAutomation.client?.email || 'Unknown Client'}
                  </p>
                  
                  <p className="text-sm text-gray-500">
                    {isMobile ? (
                      <>
                        Purchased: {format(new Date(clientAutomation.purchase_date), 'MMM d, yyyy')}
                        <br />
                        Next Billing: {format(new Date(clientAutomation.next_billing_date), 'MMM d, yyyy')}
                      </>
                    ) : (
                      <>
                        Purchased: {format(new Date(clientAutomation.purchase_date), 'MMM d, yyyy')} | 
                        Next Billing: {format(new Date(clientAutomation.next_billing_date), 'MMM d, yyyy')}
                      </>
                    )}
                  </p>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {clientAutomation.automation?.has_webhook && 
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">Webhook</Badge>}
                    {clientAutomation.automation?.has_custom_prompt && 
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">Custom Prompt</Badge>}
                    {clientAutomation.automation?.has_form_integration && 
                      <Badge variant="outline" className="bg-green-50 text-green-700">Form</Badge>}
                    {clientAutomation.automation?.has_button_integration && 
                      <Badge variant="outline" className="bg-amber-50 text-amber-700">Button</Badge>}
                  </div>
                </div>
                
                <div className={`${isMobile ? 'w-full' : ''}`}>
                  <Button
                    size={isMobile ? "sm" : "default"}
                    variant="outline"
                    className={`bg-blue-50 text-blue-600 hover:bg-blue-100 ${isMobile ? 'w-full' : ''}`}
                    onClick={() => onViewConfig(clientAutomation)}
                  >
                    <Settings className="mr-1 h-3 w-3" />
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default ClientAutomationsList;


import React, { useState, useEffect } from 'react';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { Loader2, Users, BarChart3 } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ClientAutomationWithDetails,
  fetchClientAutomations,
  initializeClientIntegrationSettings
} from '@/components/admin/automations/client-integration-utils';
import ClientAutomationsList from '@/components/admin/automations/ClientAutomationsList';
import ClientIntegrationForm from '@/components/admin/automations/ClientIntegrationForm';
import AdminAutomationStats from '@/components/admin/automations/AdminAutomationStats';
import { useIsMobile } from '@/hooks/use-mobile';
import AdminContent from '@/components/layout/admin/AdminContent';

const ClientAutomationsManager: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [clientAutomations, setClientAutomations] = useState<ClientAutomationWithDetails[]>([]);
  const [selectedAutomation, setSelectedAutomation] = useState<ClientAutomationWithDetails | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('automations');
  const { isAdmin, isVerifying } = useAdminVerification();
  const isMobile = useIsMobile();

  const fetchData = async () => {
    setIsLoading(true);
    console.log('Fetching client automations...');
    try {
      const data = await fetchClientAutomations();
      console.log(`Successfully fetched ${data.length} client automations`);
      setClientAutomations(data);
    } catch (error) {
      console.error('Error fetching client automations:', error);
      toast.error('Failed to load client autom   ations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isVerifying) {
      fetchData();
    }
  }, [isAdmin, isVerifying]);

  const handleViewConfig = async (automation: ClientAutomationWithDetails) => {
    setSelectedAutomation(automation);
    
    // Initialize settings if this is a new automation (setup_status is pending)
    if (automation.setup_status === 'pending') {
      const initialized = await initializeClientIntegrationSettings(automation);
      if (initialized) {
        toast.success('Integration settings initialized successfully');
      }
    }
  };

  const handleBack = () => {
    setSelectedAutomation(null);
    fetchData();
  };

  const handleClientFilterChange = (clientId: string | null) => {
    setSelectedClientId(clientId);
  };

  const handleStatusFilterChange = (status: string | null) => {
    setSelectedStatus(status);
  };

  if (isVerifying) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Verifying admin permissions...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-2 font-semibold">Access denied</p>
        <p className="text-gray-600">You don't have permission to access this section.</p>
      </div>
    );
  }

  return (
    <AdminContent>
      {selectedAutomation ? (
        <ClientIntegrationForm 
          clientAutomation={selectedAutomation}
          onBack={handleBack}
          onConfigUpdate={fetchData}
        />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="automations" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Automatizaciones
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Estadísticas Generales
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="automations" className="mt-6">
            <ClientAutomationsList 
              clientAutomations={clientAutomations}
              isLoading={isLoading}
              onViewConfig={handleViewConfig}
              selectedClientId={selectedClientId}
              onClientFilterChange={handleClientFilterChange}
              selectedStatus={selectedStatus}
              onStatusFilterChange={handleStatusFilterChange}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <AdminAutomationStats />
          </TabsContent>
        </Tabs>
      )}
    </AdminContent>
  );
};

export default ClientAutomationsManager;

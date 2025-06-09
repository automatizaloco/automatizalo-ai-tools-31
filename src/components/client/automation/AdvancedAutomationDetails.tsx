import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { Loader2, ArrowLeft, Activity, Settings, BarChart3, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import IntegrationView from './IntegrationView';
import WebhookAnalyticsDashboard from './WebhookAnalyticsDashboard';
import CustomPromptEditor from './CustomPromptEditor';
import FormIntegrationViewer from './FormIntegrationViewer';
import TableDataManager from './TableDataManager';
import CreateTicketModal from './CreateTicketModal';

interface AutomationWithDetails {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  has_custom_prompt: boolean;
  has_webhook: boolean;
  has_form_integration: boolean;
  has_table_integration: boolean;
}

interface ClientAutomationDetails {
  id: string;
  client_id: string;
  automation_id: string;
  purchase_date: string;
  status: string;
  next_billing_date: string;
  setup_status: string;
  automation: AutomationWithDetails;
}

const AdvancedAutomationDetails: React.FC = () => {
  const { automationId } = useParams<{ automationId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch client automation details
  const { data: clientAutomation, isLoading, error } = useQuery({
    queryKey: ['client-automation-details', automationId, user?.id],
    queryFn: async () => {
      if (!user || !automationId) throw new Error('Missing required parameters');

      const { data, error } = await supabase
        .from('client_automations')
        .select(`
          *,
          automation:automations(*)
        `)
        .eq('client_id', user.id)
        .eq('automation_id', automationId)
        .eq('status', 'active')
        .single();

      if (error) throw error;
      return data as ClientAutomationDetails;
    },
    enabled: !!user && !!automationId,
  });

  // Set initial tab based on available integrations
  useEffect(() => {
    if (clientAutomation?.automation) {
      const { has_webhook, has_custom_prompt, has_form_integration, has_table_integration } = clientAutomation.automation;
      
      if (has_webhook) setActiveTab('webhooks');
      else if (has_custom_prompt) setActiveTab('prompts');
      else if (has_form_integration) setActiveTab('forms');
      else if (has_table_integration) setActiveTab('tables');
    }
  }, [clientAutomation]);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: { variant: 'outline' as const, className: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Setup Pending' },
      in_progress: { variant: 'outline' as const, className: 'bg-blue-100 text-blue-800 border-blue-200', text: 'Setup In Progress' },
      completed: { variant: 'outline' as const, className: 'bg-green-100 text-green-800 border-green-200', text: 'Active' },
    };
    
    const config = variants[status as keyof typeof variants] || variants.pending;
    return <Badge variant={config.variant} className={config.className}>{config.text}</Badge>;
  };

  const getAvailableTabs = () => {
    if (!clientAutomation?.automation) return [];
    
    const tabs = [];
    const automation = clientAutomation.automation;
    
    if (automation.has_webhook) tabs.push({ id: 'webhooks', label: 'Webhooks', icon: Activity });
    if (automation.has_custom_prompt) tabs.push({ id: 'prompts', label: 'Custom Prompts', icon: FileText });
    if (automation.has_form_integration) tabs.push({ id: 'forms', label: 'Forms', icon: Settings });
    if (automation.has_table_integration) tabs.push({ id: 'tables', label: 'Tables', icon: BarChart3 });
    
    return tabs;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-gray-600">Loading automation details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !clientAutomation) {
    return (
      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Automation Not Found</h2>
          <p className="text-gray-600 mb-6">
            The automation you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/client-portal')} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portal
          </Button>
        </div>
      </div>
    );
  }

  const automation = clientAutomation.automation;
  const availableTabs = getAvailableTabs();

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header with proper spacing and z-index */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <Button 
            onClick={() => navigate('/client-portal')} 
            variant="outline" 
            size="sm"
            className="relative z-20 bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portal
          </Button>
          
          <div className="flex items-center gap-3">
            {/* Add ticket creation button */}
            {clientAutomation && (
              <CreateTicketModal
                automationId={automationId!}
                automationTitle={automation.title}
                clientAutomationId={clientAutomation.id}
              />
            )}
            {getStatusBadge(clientAutomation?.setup_status || 'pending')}
          </div>
        </div>

        {/* Automation Info */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {automation.image_url && (
              <div className="md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img 
                  src={automation.image_url} 
                  alt={automation.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://placehold.co/300x200?text=Automation';
                  }}
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{automation.title}</h1>
              <p className="text-gray-600 mb-4">{automation.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 block">Purchase Date</span>
                  <span className="font-medium">{format(new Date(clientAutomation.purchase_date), 'MMM d, yyyy')}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Next Billing</span>
                  <span className="font-medium">{format(new Date(clientAutomation.next_billing_date), 'MMM d, yyyy')}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Status</span>
                  <span className="font-medium capitalize">{clientAutomation.status}</span>
                </div>
                <div>
                  <span className="text-gray-500 block">Setup</span>
                  <span className="font-medium">{getStatusBadge(clientAutomation.setup_status)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {clientAutomation.setup_status === 'pending' ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Setup in Progress</h3>
                <p className="text-gray-600">
                  Our team is currently configuring your automation. You'll receive a notification once it's ready to use.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : availableTabs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Integrations Available</h3>
                <p className="text-gray-600">
                  This automation doesn't have any active integrations configured yet.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full mb-6" style={{ gridTemplateColumns: `repeat(${availableTabs.length}, 1fr)` }}>
              {availableTabs.map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                  <tab.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {automation.has_webhook && (
              <TabsContent value="webhooks">
                <WebhookAnalyticsDashboard 
                  clientAutomationId={clientAutomation.id}
                  automationTitle={automation.title}
                />
              </TabsContent>
            )}

            {automation.has_custom_prompt && (
              <TabsContent value="prompts">
                <CustomPromptEditor 
                  clientAutomationId={clientAutomation.id}
                  automationName={automation.title}
                />
              </TabsContent>
            )}

            {automation.has_form_integration && (
              <TabsContent value="forms">
                <FormIntegrationViewer 
                  clientAutomationId={clientAutomation.id}
                  automationTitle={automation.title}
                />
              </TabsContent>
            )}

            {automation.has_table_integration && (
              <TabsContent value="tables">
                <TableDataManager 
                  clientAutomationId={clientAutomation.id}
                  automationTitle={automation.title}
                />
              </TabsContent>
            )}
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default AdvancedAutomationDetails;

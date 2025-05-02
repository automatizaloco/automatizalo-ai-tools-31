
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle, Trash, Settings, PlusCircle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Automation } from '@/types/automation';
import { Badge } from '@/components/ui/badge';

interface AutomationsListProps {
  automations: Automation[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentlyActive: boolean) => Promise<void>;
  onEdit: (automation: Automation) => void;
  onDelete?: (id: string) => Promise<void>;
  onManageIntegrations?: (automation: Automation) => void;
  error: string | null;
  onRetry: () => void;
}

const AutomationsList: React.FC<AutomationsListProps> = ({
  automations,
  isLoading,
  onToggleStatus,
  onEdit,
  onDelete,
  onManageIntegrations,
  error,
  onRetry
}) => {
  const [pendingIds, setPendingIds] = React.useState<string[]>([]);
  const [automationToDelete, setAutomationToDelete] = React.useState<string | null>(null);

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    try {
      setPendingIds(prev => [...prev, id]);
      await onToggleStatus(id, currentlyActive);
    } catch (error) {
      console.error('Error toggling automation status:', error);
    } finally {
      setPendingIds(prev => prev.filter(pendingId => pendingId !== id));
    }
  };

  const handleDelete = async () => {
    if (automationToDelete && onDelete) {
      try {
        setPendingIds(prev => [...prev, automationToDelete]);
        await onDelete(automationToDelete);
      } catch (error) {
        console.error('Error deleting automation:', error);
      } finally {
        setPendingIds(prev => prev.filter(id => id !== automationToDelete));
        setAutomationToDelete(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-500">Loading automations...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isPermissionError = error.toLowerCase().includes('permission') || 
                             error.toLowerCase().includes('policy') ||
                             error.toLowerCase().includes('recursive');
                             
    return (
      <div className="border rounded-lg p-6">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-red-500 mb-2 font-medium">{error}</p>
          <p className="text-sm text-gray-500 mb-4">
            {isPermissionError 
              ? "This is related to database permissions. Please make sure you're logged in as an admin user."
              : "This could be due to a network issue. Please try again."}
          </p>
          <Button 
            onClick={onRetry} 
            variant="outline" 
            size="sm" 
            className="mt-2"
          >
            <Loader2 className={`mr-2 h-4 w-4 ${onRetry ? 'animate-spin' : ''}`} />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (automations.length === 0) {
    return (
      <div className="border rounded-lg p-8 text-center">
        <p className="text-gray-500">No automations found</p>
        <p className="text-gray-400 text-sm mt-1">Create your first automation using the form</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {automations.map((automation) => (
          <Card key={automation.id} className={automation.active ? 'border-green-300' : 'border-gray-300 opacity-75'}>
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-lg">{automation.title}</h3>
                    {automation.has_custom_prompt && <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Custom Prompt</Badge>}
                    {automation.has_webhook && <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">Webhook</Badge>}
                    {automation.has_form_integration && <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Form</Badge>}
                    {automation.has_table_integration && <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">Table</Badge>}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Installation: ${automation.installation_price.toFixed(2)} | 
                    Monthly: ${automation.monthly_price.toFixed(2)}
                  </p>
                  <p className="mt-2 text-gray-600">{automation.description}</p>
                  {automation.image_url && (
                    <div className="mt-2">
                      <img 
                        src={automation.image_url} 
                        alt={automation.title}
                        className="h-16 rounded object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/100x100?text=No+Image';
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => onEdit(automation)}
                  >
                    Edit
                  </Button>
                  
                  {onManageIntegrations && 
                   (automation.has_custom_prompt || 
                    automation.has_webhook || 
                    automation.has_form_integration || 
                    automation.has_table_integration) && (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100"
                      onClick={() => onManageIntegrations(automation)}
                    >
                      <Settings className="mr-1 h-3 w-3" />
                      Integrations
                    </Button>
                  )}
                  
                  <Button 
                    size="sm" 
                    variant={automation.active ? "destructive" : "default"}
                    onClick={() => handleToggleStatus(automation.id, automation.active)}
                    disabled={pendingIds.includes(automation.id)}
                  >
                    {pendingIds.includes(automation.id) ? (
                      <>
                        <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        {automation.active ? 'Deactivating...' : 'Activating...'}
                      </>
                    ) : (
                      automation.active ? 'Deactivate' : 'Activate'
                    )}
                  </Button>
                  {onDelete && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => setAutomationToDelete(automation.id)}
                      disabled={pendingIds.includes(automation.id)}
                    >
                      {pendingIds.includes(automation.id) && automation.id === automationToDelete ? (
                        <>
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash className="h-3 w-3 mr-1" />
                          Delete
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!automationToDelete} onOpenChange={() => setAutomationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this automation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the automation and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AutomationsList;

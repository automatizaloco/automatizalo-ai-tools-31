
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import type { Automation } from '@/types/automation';

interface AutomationsListProps {
  automations: Automation[];
  isLoading: boolean;
  onToggleStatus: (id: string, currentlyActive: boolean) => Promise<void>;
  onEdit: (automation: Automation) => void;
  error: string | null;
  onRetry: () => void;
}

const AutomationsList: React.FC<AutomationsListProps> = ({
  automations,
  isLoading,
  onToggleStatus,
  onEdit,
  error,
  onRetry
}) => {
  const [pendingIds, setPendingIds] = React.useState<string[]>([]);

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    try {
      setPendingIds(prev => [...prev, id]);
      await onToggleStatus(id, currentlyActive);
    } finally {
      setPendingIds(prev => prev.filter(pendingId => pendingId !== id));
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
    return (
      <div className="border rounded-lg p-6">
        <div className="flex flex-col items-center text-center">
          <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
          <p className="text-red-500 mb-2 font-medium">{error}</p>
          <p className="text-sm text-gray-500 mb-4">This could be due to a network issue or database permissions.</p>
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
    <div className="space-y-4">
      {automations.map((automation) => (
        <Card key={automation.id} className={automation.active ? 'border-green-300' : 'border-gray-300 opacity-75'}>
          <CardContent className="pt-6">
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{automation.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Installation: ${automation.installation_price.toFixed(2)} | 
                  Monthly: ${automation.monthly_price.toFixed(2)}
                </p>
                <p className="mt-2 text-gray-600">{automation.description}</p>
              </div>
              <div className="flex flex-col space-y-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => onEdit(automation)}
                >
                  Edit
                </Button>
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
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AutomationsList;

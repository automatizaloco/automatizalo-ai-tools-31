
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { useNotification } from '@/hooks/useNotification';
import { Loader2 } from 'lucide-react';
import type { Automation } from '@/types/automation';
import AutomationForm from '@/components/admin/automations/AutomationForm';
import AutomationsList from '@/components/admin/automations/AutomationsList';

const AutomationManager = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const { isAdmin, isVerifying } = useAdminVerification();
  const notification = useNotification();

  const fetchAutomations = async () => {
    try {
      setIsLoading(true);
      setFetchError(null);
      
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching automations:', error);
        setFetchError('Failed to load automations. Please try again.');
        return;
      }
      
      setAutomations(data || []);
    } catch (error) {
      console.error('Error processing automations:', error);
      setFetchError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isVerifying) {
      fetchAutomations();
    }
  }, [isAdmin, isVerifying]);

  const handleSubmit = async (formData: Omit<Automation, 'id' | 'created_at' | 'updated_at' | 'active'>) => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from('automations')
        .insert([{
          ...formData,
          active: true
        }]);
        
      if (error) {
        console.error('Error creating automation:', error);
        notification.showError(
          'Error', 
          'Could not create the automation. Please try again.'
        );
        return;
      }
      
      notification.showSuccess('Success', 'Automation created successfully');
      fetchAutomations();
    } catch (error) {
      console.error('Error saving automation:', error);
      notification.showError(
        'Error',
        'An unexpected error occurred. Please try again.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    try {
      const { error } = await supabase
        .from('automations')
        .update({ 
          active: !currentlyActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating automation status:', error);
        notification.showError(
          'Error',
          'Could not update automation status. Please try again.'
        );
        return;
      }
      
      setAutomations(prevAutomations => 
        prevAutomations.map(item => 
          item.id === id ? {...item, active: !currentlyActive} : item
        )
      );
      
      notification.showSuccess(
        'Status updated',
        `Automation ${currentlyActive ? 'deactivated' : 'activated'}`
      );
    } catch (error) {
      console.error('Error toggling automation status:', error);
      notification.showError(
        'Error',
        'An unexpected error occurred. Please try again.'
      );
    }
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Verifying admin permissions...</p>
          <p className="mt-1 text-sm text-gray-500">This might take a few seconds</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="border rounded-lg p-8 text-center">
          <p className="text-red-500 mb-2 font-semibold">Access denied</p>
          <p className="text-gray-600">You don't have permission to access this section.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Automation Management</h1>
        <Button 
          onClick={fetchAutomations} 
          variant="outline" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : 'Refresh'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AutomationForm 
            onSubmit={handleSubmit}
            isSaving={isSaving}
          />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Automations List</h2>
          <AutomationsList
            automations={automations}
            isLoading={isLoading}
            onToggleStatus={handleToggleStatus}
            onEdit={() => {}} // Will implement edit functionality later if needed
            error={fetchError}
            onRetry={fetchAutomations}
          />
        </div>
      </div>
    </div>
  );
};

export default AutomationManager;

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { useNotification } from '@/hooks/useNotification';
import { Loader2 } from 'lucide-react';
import type { Automation } from '@/types/automation';
import AutomationForm from '@/components/admin/automations/AutomationForm';
import AutomationsList from '@/components/admin/automations/AutomationsList';
import AutomationIntegrations from '@/components/admin/automations/AutomationIntegrations';
import { toast } from 'sonner';

const AutomationManager = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const { isAdmin, isVerifying } = useAdminVerification();
  const notification = useNotification();

  const fetchAutomations = async () => {
    try {
      console.log('Fetching automations...');
      setIsLoading(true);
      setFetchError(null);
      
      await syncUserAccount();
      
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching automations:', error);
        console.log('Error details:', error.message, error.details, error.hint);
        setFetchError(`Failed to load automations: ${error.message}`);
        return;
      }
      
      console.log(`Successfully fetched ${data?.length || 0} automations`);
      setAutomations(data || []);
    } catch (error: any) {
      console.error('Exception in fetchAutomations:', error);
      setFetchError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const syncUserAccount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!existingUser) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: user.id,
          email: user.email,
          role: user.email === 'contact@automatizalo.co' ? 'admin' : 'client'
        });

      if (insertError) {
        console.error('Error syncing user account:', insertError);
        toast.error('Failed to sync user account');
      } else {
        toast.success('Account synchronized successfully');
      }
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
      
      if (isEditing && selectedAutomation) {
        // Update existing automation
        console.log('Updating automation with ID:', selectedAutomation.id);
        console.log('Update data:', formData);
        
        const { data, error } = await supabase
          .from('automations')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedAutomation.id)
          .select();
          
        if (error) {
          console.error('Error updating automation:', error);
          console.log('Error details:', error.message, error.details, error.hint);
          notification.showError(
            'Error', 
            `Could not update the automation: ${error.message}`
          );
          return;
        }
        
        console.log('Automation updated successfully:', data);
        notification.showSuccess('Success', 'Automation updated successfully');
        
        // Update the local state
        setAutomations(prevAutomations => 
          prevAutomations.map(item => 
            item.id === selectedAutomation.id ? { ...item, ...formData } : item
          )
        );
        
        // Exit edit mode after update
        setIsEditing(false);
        setSelectedAutomation(null);
        setShowIntegrations(false);
      } else {
        // Create new automation
        console.log('Creating automation with data:', formData);
        
        const { data, error } = await supabase
          .from('automations')
          .insert([{
            ...formData,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select();
          
        if (error) {
          console.error('Error creating automation:', error);
          console.log('Error details:', error.message, error.details, error.hint);
          notification.showError(
            'Error', 
            `Could not create the automation: ${error.message}`
          );
          return;
        }
        
        console.log('Automation created successfully:', data);
        notification.showSuccess('Success', 'Automation created successfully');
        
        // Simply refresh the list without redirecting to integrations
        fetchAutomations();
      }
    } catch (error: any) {
      console.error('Exception in handleSubmit:', error);
      notification.showError(
        'Error',
        `An unexpected error occurred: ${error.message || 'Unknown error'}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    try {
      console.log(`Toggling automation ${id} from ${currentlyActive ? 'active' : 'inactive'} to ${!currentlyActive ? 'active' : 'inactive'}`);
      
      const { error } = await supabase
        .from('automations')
        .update({ 
          active: !currentlyActive,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating automation status:', error);
        console.log('Error details:', error.message, error.details, error.hint);
        notification.showError(
          'Error',
          `Could not update automation status: ${error.message}`
        );
        return;
      }
      
      console.log('Automation status updated successfully');
      setAutomations(prevAutomations => 
        prevAutomations.map(item => 
          item.id === id ? {...item, active: !currentlyActive} : item
        )
      );
      
      toast.success(
        `Automation ${currentlyActive ? 'deactivated' : 'activated'} successfully`
      );
    } catch (error: any) {
      console.error('Exception in handleToggleStatus:', error);
      notification.showError(
        'Error',
        `An unexpected error occurred: ${error.message || 'Unknown error'}`
      );
    }
  };

  const handleEdit = (automation: Automation) => {
    setSelectedAutomation(automation);
    setIsEditing(true);
    setShowIntegrations(false);
    // Scroll to the form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedAutomation(null);
    setShowIntegrations(false);
  };

  const handleNewAutomation = () => {
    setIsEditing(false);
    setSelectedAutomation(null);
    setShowIntegrations(false);
  };

  const handleDelete = async (id: string) => {
    try {
      console.log(`Deleting automation with ID: ${id}`);
      
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);
        
      if (error) {
        console.error('Error deleting automation:', error);
        console.log('Error details:', error.message, error.details, error.hint);
        notification.showError(
          'Error', 
          `Could not delete automation: ${error.message}`
        );
        return;
      }
      
      console.log('Automation deleted successfully');
      setAutomations(prevAutomations => prevAutomations.filter(item => item.id !== id));
      toast.success('Automation deleted successfully');
      
      // If the deleted automation was being edited, exit edit mode
      if (selectedAutomation?.id === id) {
        setIsEditing(false);
        setSelectedAutomation(null);
        setShowIntegrations(false);
      }
    } catch (error: any) {
      console.error('Exception in handleDelete:', error);
      notification.showError(
        'Error',
        `An unexpected error occurred: ${error.message || 'Unknown error'}`
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
        <div className="flex space-x-2">
          {isEditing && (
            <Button 
              onClick={handleCancelEdit} 
              variant="outline" 
            >
              Cancel Edit
            </Button>
          )}
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
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <AutomationForm 
            onSubmit={handleSubmit}
            isSaving={isSaving}
            automation={selectedAutomation || undefined}
            isEditing={isEditing}
            onNewAutomation={handleNewAutomation}
          />
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? 'Edit Mode: Select Another Automation to Edit' : 'Automations List'}
          </h2>
          <AutomationsList
            automations={automations}
            isLoading={isLoading}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEdit}
            onDelete={handleDelete}
            error={fetchError}
            onRetry={fetchAutomations}
          />
        </div>
      </div>
    </div>
  );
};

export default AutomationManager;

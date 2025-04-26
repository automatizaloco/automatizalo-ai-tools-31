
import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Automation } from '@/types/automation';
import { useAdminVerification } from '@/hooks/useAdminVerification';
import { useNotification } from '@/hooks/useNotification';
import { Loader2 } from 'lucide-react';

const INITIAL_FORM_STATE = {
  title: '',
  description: '',
  installation_price: 0,
  monthly_price: 0,
  image_url: '',
};

const AutomationManager = () => {
  // State for automations and loading
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  
  // Use the improved admin verification hook with fewer retries
  const { isAdmin, isVerifying } = useAdminVerification(2, 8000);
  const notification = useNotification();

  // Debounced fetch with useCallback to prevent multiple calls
  const fetchAutomations = useCallback(async () => {
    if (!isAdmin || isLoading) return;
    
    setIsLoading(true);
    setFetchError(null);
    
    try {
      console.log('Fetching automations...');
      
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching automations:', error);
        
        if (error.message.includes('policy')) {
          setFetchError('Permission error. You do not have access to view automations.');
          notification.showError(
            'Permission Error', 
            'You do not have permission to view automations. Please verify your admin role.'
          );
        } else {
          setFetchError('Failed to load automations. Please try again.');
          notification.showError(
            'Error', 
            'Failed to load automations. Please try again.'
          );
        }
        return;
      }
      
      console.log('Automations fetched successfully:', data?.length || 0);
      setAutomations(data || []);
    } catch (error) {
      console.error('Error processing automations:', error);
      setFetchError('An unexpected error occurred while loading automations.');
      notification.showError(
        'Error', 
        'An unexpected error occurred while loading automations.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin, notification, isLoading]);

  // Fetch data once admin status is confirmed
  useEffect(() => {
    if (isAdmin && !isVerifying && !isLoading) {
      fetchAutomations();
    }
  }, [isAdmin, isVerifying, fetchAutomations, isLoading]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAdmin) {
      notification.showError('Access denied', 'You do not have permissions to perform this action.');
      return;
    }
    
    setIsSaving(true);
    try {
      console.log(`${editMode ? 'Updating' : 'Creating'} automation...`);
      
      if (editMode && currentId) {
        const { error } = await supabase
          .from('automations')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentId);
          
        if (error) {
          console.error('Error updating automation:', error);
          
          if (error.message.includes('row-level security')) {
            notification.showError(
              'Permission error', 
              'You do not have permissions to update automations. Verify that your user has admin role.'
            );
            return;
          }
          
          throw error;
        }
        
        notification.showSuccess('Automation updated', 'The automation was successfully updated');
      } else {
        const { error } = await supabase
          .from('automations')
          .insert([{
            ...formData,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) {
          console.error('Error creating automation:', error);
          
          if (error.message.includes('row-level security')) {
            notification.showError(
              'Permission error', 
              'You do not have permissions to create automations. Verify that your user has admin role.'
            );
            return;
          }
          
          throw error;
        }
        
        notification.showSuccess('Automation created', 'The automation was successfully created');
      }
      
      resetForm();
      // Fetch automations after a short delay to ensure the backend has updated
      setTimeout(() => fetchAutomations(), 300);
    } catch (error: any) {
      console.error('Error saving automation:', error);
      notification.showError('Error', error.message || 'Could not save the automation');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (automation: Automation) => {
    setFormData({
      title: automation.title,
      description: automation.description,
      installation_price: automation.installation_price,
      monthly_price: automation.monthly_price,
      image_url: automation.image_url || '',
    });
    setCurrentId(automation.id);
    setEditMode(true);
  };

  const handleToggleStatus = async (id: string, currentlyActive: boolean) => {
    if (!isAdmin) {
      notification.showError('Access denied', 'You do not have permissions to perform this action.');
      return;
    }
    
    try {
      const { error } = await supabase
        .from('automations')
        .update({ active: !currentlyActive, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) {
        console.error('Error updating automation status:', error);
        
        if (error.message.includes('row-level security')) {
          notification.showError(
            'Permission error', 
            'You do not have permissions to update automation status.'
          );
          return;
        }
        
        throw error;
      }
      
      // Update local state to avoid another fetch
      setAutomations(prevAutomations => 
        prevAutomations.map(item => 
          item.id === id ? {...item, active: !currentlyActive} : item
        )
      );
      
      notification.showSuccess(
        'Status updated', 
        `Automation ${currentlyActive ? 'deactivated' : 'activated'}`
      );
    } catch (error: any) {
      console.error('Error updating automation status:', error);
      notification.showError('Error', error.message || 'Could not update automation status');
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE);
    setCurrentId(null);
    setEditMode(false);
  };

  // Unified loading state
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
          onClick={() => fetchAutomations()} 
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
          <Card>
            <CardHeader>
              <CardTitle>{editMode ? 'Edit Automation' : 'Create Automation'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Enter automation title"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter automation description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="installation_price">Installation price ($)</Label>
                  <Input
                    id="installation_price"
                    name="installation_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.installation_price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="monthly_price">Monthly maintenance price ($)</Label>
                  <Input
                    id="monthly_price"
                    name="monthly_price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.monthly_price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editMode ? 'Updating...' : 'Creating...'}
                      </>
                    ) : (
                      editMode ? 'Update' : 'Create'
                    )}
                  </Button>
                  {editMode && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Automations List</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-gray-500">Loading automations...</p>
              </div>
            </div>
          ) : fetchError ? (
            <div className="border rounded-lg p-6 text-center">
              <p className="text-red-500 mb-2">{fetchError}</p>
              <Button 
                onClick={() => fetchAutomations()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {automations.length > 0 ? (
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
                              onClick={() => handleEdit(automation)}
                            >
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant={automation.active ? "destructive" : "default"}
                              onClick={() => handleToggleStatus(automation.id, automation.active)}
                            >
                              {automation.active ? 'Deactivate' : 'Activate'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <p className="text-gray-500">No automations found</p>
                  <p className="text-gray-400 text-sm mt-1">Create your first automation using the form</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AutomationManager;

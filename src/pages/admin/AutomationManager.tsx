
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Automation } from '@/types/automation';

const AutomationManager = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    installation_price: 0,
    monthly_price: 0,
    image_url: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);

  const fetchAutomations = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setAutomations(data || []);
    } catch (error) {
      console.error('Error fetching automations:', error);
      toast.error('Failed to load automations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAutomations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editMode && currentId) {
        const { error } = await supabase
          .from('automations')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentId);
          
        if (error) throw error;
        toast.success('Automation updated successfully');
      } else {
        const { error } = await supabase
          .from('automations')
          .insert([{
            ...formData,
            active: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }]);
          
        if (error) throw error;
        toast.success('Automation created successfully');
      }
      
      resetForm();
      fetchAutomations();
    } catch (error: any) {
      console.error('Error saving automation:', error);
      toast.error(error.message || 'Failed to save automation');
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
    try {
      const { error } = await supabase
        .from('automations')
        .update({ active: !currentlyActive, updated_at: new Date().toISOString() })
        .eq('id', id);
        
      if (error) throw error;
      
      fetchAutomations();
      toast.success(`Automation ${currentlyActive ? 'disabled' : 'enabled'}`);
    } catch (error: any) {
      console.error('Error updating automation status:', error);
      toast.error(error.message || 'Failed to update automation status');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      installation_price: 0,
      monthly_price: 0,
      image_url: '',
    });
    setCurrentId(null);
    setEditMode(false);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Automation Management</h1>
        <Button onClick={fetchAutomations} variant="outline">Refresh</Button>
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
                  <Label htmlFor="installation_price">Installation Price ($)</Label>
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
                  <Label htmlFor="monthly_price">Monthly Maintenance Price ($)</Label>
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
                  <Button type="submit">
                    {editMode ? 'Update Automation' : 'Create Automation'}
                  </Button>
                  {editMode && (
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Automation List</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
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
                              {automation.active ? 'Disable' : 'Enable'}
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

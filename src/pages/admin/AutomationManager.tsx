import React, { useState, useEffect } from 'react';
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

const AutomationManager = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    installation_price: 0,
    monthly_price: 0,
    image_url: '',
  });
  const [editMode, setEditMode] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
  const { isAdmin, isVerifying } = useAdminVerification();
  const notification = useNotification();

  const fetchAutomations = async () => {
    if (!isAdmin) {
      return; // Don't fetch if not admin
    }
    
    setIsLoading(true);
    try {
      console.log('Fetching automations...');
      
      // First check if admin view is working correctly
      const { data: adminCheck, error: adminCheckError } = await supabase.rpc('is_admin', { 
        user_uid: (await supabase.auth.getUser()).data.user?.id 
      });
      
      if (adminCheckError) {
        console.error('Error checking admin status:', adminCheckError);
        notification.showError(
          'Permission Error', 
          'Failed to verify your admin permissions. Please try again later.'
        );
        setIsLoading(false);
        return;
      }
      
      if (!adminCheck) {
        console.warn('User is not an admin but reached the automation manager');
        notification.showError(
          'Access Denied', 
          'You do not have admin privileges to view this page.'
        );
        setIsLoading(false);
        return;
      }
      
      // Now fetch the automations
      const { data, error } = await supabase
        .from('automations')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching automations:', error);
        
        // Check if this is an RLS error
        if (error.message.includes('row-level security')) {
          notification.showError(
            'Error de permisos', 
            'No tienes permisos para ver las automatizaciones. Verifica que tu usuario tenga rol de administrador.'
          );
          return;
        }
        
        throw error;
      }
      
      console.log('Automations fetched successfully:', data?.length || 0);
      setAutomations(data || []);
    } catch (error) {
      console.error('Error processing automations:', error);
      notification.showError('Error', 'No se pudieron cargar las automatizaciones');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin && !isVerifying) {
      fetchAutomations();
    }
  }, [isAdmin, isVerifying]);

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
      notification.showError('Acceso denegado', 'No tienes permisos para realizar esta acción.');
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
              'Error de permisos', 
              'No tienes permisos para actualizar automatizaciones. Verifica que tu usuario tenga rol de administrador.'
            );
            return;
          }
          
          throw error;
        }
        
        notification.showSuccess('Automatización actualizada', 'La automatización se actualizó correctamente');
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
              'Error de permisos', 
              'No tienes permisos para crear automatizaciones. Verifica que tu usuario tenga rol de administrador.'
            );
            return;
          }
          
          throw error;
        }
        
        notification.showSuccess('Automatización creada', 'La automatización se creó correctamente');
      }
      
      resetForm();
      fetchAutomations();
    } catch (error: any) {
      console.error('Error saving automation:', error);
      notification.showError('Error', error.message || 'No se pudo guardar la automatización');
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
      notification.showError('Acceso denegado', 'No tienes permisos para realizar esta acción.');
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
            'Error de permisos', 
            'No tienes permisos para actualizar el estado de automatizaciones.'
          );
          return;
        }
        
        throw error;
      }
      
      fetchAutomations();
      notification.showSuccess(
        'Estado actualizado', 
        `Automatización ${currentlyActive ? 'desactivada' : 'activada'}`
      );
    } catch (error: any) {
      console.error('Error updating automation status:', error);
      notification.showError('Error', error.message || 'No se pudo actualizar el estado de la automatización');
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

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="border rounded-lg p-8 text-center">
          <p className="text-red-500 mb-2 font-semibold">Acceso denegado</p>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Automatizaciones</h1>
        <Button onClick={fetchAutomations} variant="outline" disabled={isLoading}>
          {isLoading ? 'Cargando...' : 'Actualizar'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>{editMode ? 'Editar Automatización' : 'Crear Automatización'}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Ingrese el título de la automatización"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Ingrese la descripción de la automatización"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="installation_price">Precio de instalación ($)</Label>
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
                  <Label htmlFor="monthly_price">Precio de mantenimiento mensual ($)</Label>
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
                  <Label htmlFor="image_url">URL de imagen (Opcional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? 'Guardando...' : editMode ? 'Actualizar' : 'Crear'}
                  </Button>
                  {editMode && (
                    <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                      Cancelar
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Lista de Automatizaciones</h2>
          
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
                              Instalación: ${automation.installation_price.toFixed(2)} | 
                              Mensual: ${automation.monthly_price.toFixed(2)}
                            </p>
                            <p className="mt-2 text-gray-600">{automation.description}</p>
                          </div>
                          <div className="flex flex-col space-y-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => handleEdit(automation)}
                            >
                              Editar
                            </Button>
                            <Button 
                              size="sm" 
                              variant={automation.active ? "destructive" : "default"}
                              onClick={() => handleToggleStatus(automation.id, automation.active)}
                            >
                              {automation.active ? 'Desactivar' : 'Activar'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="border rounded-lg p-8 text-center">
                  <p className="text-gray-500">No se encontraron automatizaciones</p>
                  <p className="text-gray-400 text-sm mt-1">Cree su primera automatización usando el formulario</p>
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

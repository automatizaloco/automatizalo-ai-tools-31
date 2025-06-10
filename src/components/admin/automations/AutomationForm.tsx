import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { FileUploader } from '@/components/admin/FileUploader';
import { supabase } from '@/integrations/supabase/client';
import { Switch } from '@/components/ui/switch';

interface AutomationFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    installation_price: number;
    monthly_price: number;
    image_url?: string;
    has_custom_prompt?: boolean;
    has_form_integration?: boolean;
    has_button_integration?: boolean;
  }) => Promise<void>;
  isSaving: boolean;
  automation?: {
    id: string;
    title: string;
    description: string;
    installation_price: number;
    monthly_price: number;
    image_url?: string;
    has_custom_prompt?: boolean;
    has_form_integration?: boolean;
    has_button_integration?: boolean;
  };
  isEditing?: boolean;
  onNewAutomation?: () => void;
}

const AutomationForm: React.FC<AutomationFormProps> = ({ 
  onSubmit, 
  isSaving, 
  automation = null, 
  isEditing = false,
  onNewAutomation
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    installation_price: 0,
    monthly_price: 0,
    image_url: '',
    has_custom_prompt: false,
    has_form_integration: false,
    has_button_integration: false,
  });
  const [errorFields, setErrorFields] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUrlField, setShowImageUrlField] = useState(true);

  // Load existing automation data when editing
  useEffect(() => {
    if (automation) {
      setFormData({
        title: automation.title || '',
        description: automation.description || '',
        installation_price: automation.installation_price || 0,
        monthly_price: automation.monthly_price || 0,
        image_url: automation.image_url || '',
        has_custom_prompt: automation.has_custom_prompt || false,
        has_form_integration: automation.has_form_integration || false,
        has_button_integration: automation.has_button_integration || false,
      });
      setShowImageUrlField(!!automation.image_url);
    }
  }, [automation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') ? parseFloat(value) || 0 : value
    }));
    
    // Clear error state when field is modified
    if (errorFields.includes(name)) {
      setErrorFields(prev => prev.filter(field => field !== name));
    }
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleNewAutomation = () => {
    // Reset form data
    setFormData({
      title: '',
      description: '',
      installation_price: 0,
      monthly_price: 0,
      image_url: '',
      has_custom_prompt: false,
      has_form_integration: false,
      has_button_integration: false,
    });
    setErrorFields([]);
    setShowImageUrlField(true);
    
    if (onNewAutomation) {
      onNewAutomation();
    }
  };

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `automations/${fileName}`;
      
      // Upload image to Supabase Storage
      const { error: uploadError, data } = await supabase.storage
        .from('content')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('content')
        .getPublicUrl(filePath);
      
      // Update form data with the new image URL
      setFormData(prev => ({
        ...prev,
        image_url: publicUrl
      }));
      
      setShowImageUrlField(false);
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: string[] = [];
    
    if (!formData.title.trim()) errors.push('title');
    if (!formData.description.trim()) errors.push('description');
    if (formData.installation_price < 0) errors.push('installation_price');
    if (formData.monthly_price < 0) errors.push('monthly_price');
    
    setErrorFields(errors);
    return errors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly.');
      return;
    }
    
    try {
      await onSubmit(formData);
      if (!isEditing) {
        // Only reset the form when creating a new automation
        setFormData({
          title: '',
          description: '',
          installation_price: 0,
          monthly_price: 0,
          image_url: '',
          has_custom_prompt: false,
          has_form_integration: false,
          has_button_integration: false,
        });
      }
      toast.success(isEditing ? 'Automation updated successfully!' : 'Automation created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is managed by the parent component
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{isEditing ? 'Update Automation' : 'Create Automation'}</CardTitle>
          {!isEditing && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNewAutomation}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              New Automation
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className={errorFields.includes('title') ? 'text-red-500' : ''}>
              Title {errorFields.includes('title') && <span className="text-red-500">*</span>}
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter automation title"
              required
              className={errorFields.includes('title') ? 'border-red-500' : ''}
            />
            {errorFields.includes('title') && (
              <p className="text-red-500 text-xs mt-1">Title is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="description" className={errorFields.includes('description') ? 'text-red-500' : ''}>
              Description {errorFields.includes('description') && <span className="text-red-500">*</span>}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter automation description"
              rows={4}
              required
              className={errorFields.includes('description') ? 'border-red-500' : ''}
            />
            {errorFields.includes('description') && (
              <p className="text-red-500 text-xs mt-1">Description is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="installation_price" className={errorFields.includes('installation_price') ? 'text-red-500' : ''}>
              Installation price ($)
            </Label>
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
              className={errorFields.includes('installation_price') ? 'border-red-500' : ''}
            />
            {errorFields.includes('installation_price') && (
              <p className="text-red-500 text-xs mt-1">Price cannot be negative</p>
            )}
          </div>

          <div>
            <Label htmlFor="monthly_price" className={errorFields.includes('monthly_price') ? 'text-red-500' : ''}>
              Monthly maintenance price ($)
            </Label>
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
              className={errorFields.includes('monthly_price') ? 'border-red-500' : ''}
            />
            {errorFields.includes('monthly_price') && (
              <p className="text-red-500 text-xs mt-1">Price cannot be negative</p>
            )}
          </div>

          <div>
            <Label>Automation Image</Label>
            <div className="mt-1 space-y-3">
              <FileUploader
                onUpload={handleImageUpload}
                label={isUploading ? "Uploading..." : "Upload Image"}
                buttonVariant="outline"
                className="w-full"
                acceptedFileTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
                maxSizeMB={5}
              />
              
              {showImageUrlField && (
                <div className="mt-2">
                  <Label htmlFor="image_url">Image URL (Optional)</Label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
              )}

              {formData.image_url && (
                <div className="mt-2">
                  <div className="border rounded p-2">
                    <div className="aspect-video w-full bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img 
                        src={formData.image_url} 
                        alt="Automation preview" 
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://placehold.co/600x400?text=Image+Not+Found';
                        }}
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFormData(prev => ({ ...prev, image_url: '' }));
                          setShowImageUrlField(true);
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove Image
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="font-medium text-md mb-2">Automation Features</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="has_custom_prompt" className="cursor-pointer">Custom Prompt</Label>
                  <p className="text-sm text-gray-500">Allow custom AI prompt configuration with webhook integration</p>
                </div>
                <Switch 
                  id="has_custom_prompt"
                  checked={formData.has_custom_prompt}
                  onCheckedChange={(checked) => handleSwitchChange('has_custom_prompt', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="has_form_integration" className="cursor-pointer">Form Integration</Label>
                  <p className="text-sm text-gray-500">Add n8n form to launch automation</p>
                </div>
                <Switch 
                  id="has_form_integration"
                  checked={formData.has_form_integration}
                  onCheckedChange={(checked) => handleSwitchChange('has_form_integration', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="has_button_integration" className="cursor-pointer">Button Integration</Label>
                  <p className="text-sm text-gray-500">Add external button link integration</p>
                </div>
                <Switch 
                  id="has_button_integration"
                  checked={formData.has_button_integration}
                  onCheckedChange={(checked) => handleSwitchChange('has_button_integration', checked)}
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isSaving || isUploading} className="w-full">
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              isEditing ? 'Update' : 'Create'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AutomationForm;

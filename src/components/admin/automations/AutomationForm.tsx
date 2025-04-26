
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AutomationFormProps {
  onSubmit: (data: {
    title: string;
    description: string;
    installation_price: number;
    monthly_price: number;
    image_url?: string;
  }) => Promise<void>;
  isSaving: boolean;
}

const AutomationForm: React.FC<AutomationFormProps> = ({ onSubmit, isSaving }) => {
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    installation_price: 0,
    monthly_price: 0,
    image_url: '',
  });
  const [errorFields, setErrorFields] = React.useState<string[]>([]);

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
      setFormData({
        title: '',
        description: '',
        installation_price: 0,
        monthly_price: 0,
        image_url: '',
      });
      toast.success('Automation created successfully!');
    } catch (error) {
      console.error('Form submission error:', error);
      // Error handling is managed by the parent component
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Automation</CardTitle>
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
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AutomationForm;


import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('price') ? parseFloat(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      installation_price: 0,
      monthly_price: 0,
      image_url: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Automation</CardTitle>
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


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Save, ExternalLink } from 'lucide-react';

interface BlogFormConfig {
  id?: string;
  form_url: string;
  updated_at?: string;
}

const BlogFormManager: React.FC = () => {
  const [formUrl, setFormUrl] = useState('https://automatizalo-n8n.v4zcph.easypanel.host/form/53adc78b-4ee7-4fa6-a657-c922847e965a');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadFormConfig();
  }, []);

  const loadFormConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('*')
        .eq('page', 'admin')
        .eq('section_name', 'blog_form_url')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setFormUrl(data.content);
      }
    } catch (error) {
      console.error('Error loading form config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveFormConfig = async () => {
    if (!formUrl.trim()) {
      toast.error('Por favor ingresa una URL válida');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('page_content')
        .upsert({
          page: 'admin',
          section_name: 'blog_form_url',
          content: formUrl.trim(),
          language: 'es'
        });

      if (error) throw error;

      toast.success('URL del formulario actualizada correctamente');
    } catch (error) {
      console.error('Error saving form config:', error);
      toast.error('Error al guardar la configuración');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración del Formulario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="form-url">URL del Formulario</Label>
          <Input
            id="form-url"
            type="url"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            placeholder="https://automatizalo-n8n.v4zcph.easypanel.host/form/..."
            className="mt-1"
          />
          <p className="text-sm text-gray-500 mt-1">
            Pega aquí la nueva URL del formulario cuando necesites actualizarlo
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            onClick={saveFormConfig}
            disabled={isSaving}
            className="flex-1"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Guardar URL
              </>
            )}
          </Button>

          {formUrl && (
            <Button
              variant="outline"
              onClick={() => window.open(formUrl, '_blank')}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogFormManager;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Settings } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import BlogFormManager from "@/components/admin/blog/BlogFormManager";

const AutomaticBlog = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [formUrl, setFormUrl] = useState('https://automatizalo-n8n.v4zcph.easypanel.host/form/53adc78b-4ee7-4fa6-a657-c922847e965a');
  const [isLoading, setIsLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    loadFormUrl();
  }, []);

  const loadFormUrl = async () => {
    try {
      const { data, error } = await supabase
        .from('page_content')
        .select('content')
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
      console.error('Error loading form URL:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshFormUrl = () => {
    loadFormUrl();
    setShowSettings(false);
  };

  return (
    <div className="container mx-auto px-0 md:px-4 py-2 md:py-6 max-w-4xl">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-2 md:pb-4">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg md:text-xl">Create AI-Generated Blog Post</CardTitle>
              <CardDescription>
                Fill out the form below to generate a complete blog post automatically using AI.
              </CardDescription>
            </div>
            
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Configurar Formulario</DialogTitle>
                </DialogHeader>
                <BlogFormManager />
                <div className="flex justify-end pt-4">
                  <Button onClick={refreshFormUrl}>
                    Aplicar Cambios
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="ml-2">Cargando formulario...</span>
            </div>
          ) : (
            <div className="w-full">
              <iframe
                src={formUrl}
                width="100%"
                height="600"
                frameBorder="0"
                style={{ border: 'none', borderRadius: '8px' }}
                title="AI Blog Generation Form"
                className="w-full"
                onError={() => {
                  console.error('Error loading form iframe');
                }}
              />
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex flex-col md:flex-row justify-end md:space-x-4 border-t border-gray-100 pt-4 space-y-2 md:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/blog")}
            className="w-full md:w-auto transition-all duration-200"
          >
            Back to Blog Admin
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AutomaticBlog;

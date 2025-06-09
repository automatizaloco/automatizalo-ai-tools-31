
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Code, Eye } from 'lucide-react';

interface FormUrlConverterProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FormUrlConverter: React.FC<FormUrlConverterProps> = ({
  value,
  onChange,
  placeholder = "Enter form URL or iframe code..."
}) => {
  const [displayMode, setDisplayMode] = useState<'url' | 'iframe'>('url');

  const isValidUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const isIframeCode = (text: string): boolean => {
    return text.includes('<iframe') && text.includes('</iframe>');
  };

  const isN8nUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.includes('n8n') || 
             urlObj.pathname.includes('/webhook/') ||
             urlObj.pathname.includes('/form/');
    } catch {
      return false;
    }
  };

  const convertToIframe = (input: string): string => {
    if (isIframeCode(input)) {
      return input;
    }

    if (isValidUrl(input)) {
      const url = new URL(input);
      
      // Para n8n, usar configuraciones específicas
      if (isN8nUrl(input)) {
        return `<iframe src="${url.toString()}" width="100%" height="700" frameborder="0" style="border:none; background: white;" allow="clipboard-write" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>`;
      }
      
      // Para otros formularios
      return `<iframe src="${url.toString()}" width="100%" height="600" frameborder="0" style="border:none;"></iframe>`;
    }

    return input;
  };

  const extractUrlFromIframe = (iframeCode: string): string => {
    const srcMatch = iframeCode.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : iframeCode;
  };

  const currentUrl = isIframeCode(value) ? extractUrlFromIframe(value) : value;
  const currentIframe = isIframeCode(value) ? value : convertToIframe(value);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    
    if (displayMode === 'iframe') {
      onChange(input);
    } else {
      // Si está en modo URL, convertir automáticamente a iframe al guardar
      const converted = convertToIframe(input);
      onChange(converted);
    }
  };

  const handleModeToggle = (mode: 'url' | 'iframe') => {
    setDisplayMode(mode);
  };

  const openInNewTab = () => {
    if (isValidUrl(currentUrl)) {
      window.open(currentUrl, '_blank');
    }
  };

  const getDisplayValue = () => {
    if (displayMode === 'url') {
      return currentUrl;
    } else {
      return currentIframe;
    }
  };

  const getFormType = () => {
    if (isN8nUrl(currentUrl)) return 'n8n';
    if (currentUrl.includes('google.com/forms')) return 'google-forms';
    if (currentUrl.includes('typeform.com')) return 'typeform';
    if (currentUrl.includes('jotform.com')) return 'jotform';
    return 'custom';
  };

  const formType = getFormType();

  return (
    <div className="space-y-4">
      {/* Mode Toggle */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Display mode:</span>
        <Button
          type="button"
          variant={displayMode === 'url' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeToggle('url')}
        >
          <ExternalLink className="h-3 w-3 mr-1" />
          URL
        </Button>
        <Button
          type="button"
          variant={displayMode === 'iframe' ? 'default' : 'outline'}
          size="sm"
          onClick={() => handleModeToggle('iframe')}
        >
          <Code className="h-3 w-3 mr-1" />
          Iframe
        </Button>
      </div>

      {/* Input Area */}
      <div className="space-y-2">
        <textarea
          rows={displayMode === 'iframe' ? 8 : 4}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500 font-mono text-sm"
          placeholder={displayMode === 'url' ? 'https://your-form-url.com' : '<iframe src="..."></iframe>'}
          value={getDisplayValue()}
          onChange={handleInputChange}
        />
        
        {/* Status Indicators */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {formType !== 'custom' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {formType === 'n8n' && '⚡ n8n'}
                {formType === 'google-forms' && '📝 Google Forms'}
                {formType === 'typeform' && '📋 Typeform'}
                {formType === 'jotform' && '📄 JotForm'}
              </Badge>
            )}
            
            {isIframeCode(value) && (
              <Badge variant="outline" className="bg-green-50 text-green-700">
                ✓ Valid iframe
              </Badge>
            )}
            
            {isValidUrl(currentUrl) && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                ✓ Valid URL
              </Badge>
            )}
          </div>
          
          {isValidUrl(currentUrl) && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={openInNewTab}
            >
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
          )}
        </div>
      </div>

      {/* Help Text */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>
          💡 <strong>URL mode:</strong> Paste the direct link to your form. Will be automatically converted to iframe.
        </p>
        <p>
          💡 <strong>Iframe mode:</strong> Paste the complete iframe embed code for advanced customization.
        </p>
        {formType === 'n8n' && (
          <p className="text-blue-600">
            ⚡ <strong>n8n detected:</strong> Using optimized settings for n8n forms with proper permissions.
          </p>
        )}
      </div>
    </div>
  );
};

export default FormUrlConverter;

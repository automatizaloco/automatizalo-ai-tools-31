
import React from 'react';

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
  const convertUrlToIframe = (input: string): string => {
    // If it's already an iframe, return as is
    if (input.includes('<iframe')) {
      return input;
    }
    
    // Check if it's a URL
    try {
      const url = new URL(input);
      // Convert URL to iframe
      return `<iframe src="${url.toString()}" width="100%" height="600" frameborder="0" style="border:none;"></iframe>`;
    } catch {
      // If not a valid URL, return the input as is
      return input;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    const converted = convertUrlToIframe(input);
    onChange(converted);
  };

  const isUrl = (text: string): boolean => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const displayValue = (() => {
    // If the stored value is an iframe but user might have entered a URL
    if (value.includes('<iframe')) {
      // Try to extract the URL from the iframe src
      const srcMatch = value.match(/src="([^"]+)"/);
      if (srcMatch) {
        const extractedUrl = srcMatch[1];
        // Show the URL if it's clean, otherwise show the full iframe
        return isUrl(extractedUrl) ? extractedUrl : value;
      }
    }
    return value;
  })();

  return (
    <div className="space-y-2">
      <textarea
        rows={6}
        className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-blue-500"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
      />
      <div className="text-xs text-gray-500">
        💡 Tip: You can paste either a form URL or complete iframe code. URLs will be automatically converted to iframes.
      </div>
      {value.includes('<iframe') && (
        <div className="text-xs text-green-600">
          ✓ Valid iframe code detected
        </div>
      )}
    </div>
  );
};

export default FormUrlConverter;

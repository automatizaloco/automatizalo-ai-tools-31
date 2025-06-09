export const isValidUrl = (text: string): boolean => {
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
};

export const isN8nUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.includes('n8n') || 
           urlObj.pathname.includes('/webhook/') ||
           urlObj.pathname.includes('/form/');
  } catch {
    return false;
  }
};

export const processFormCode = (code: string) => {
  // Basic validation and processing of embed code
  if (!code) return null;
  
  // Check if it's already an iframe
  if (code.includes('<iframe')) {
    return { type: 'iframe', code };
  }
  
  // Check if it's a script
  if (code.includes('<script')) {
    return { type: 'script', code };
  }
  
  // Check if it's a URL that needs to be converted to iframe
  if (isValidUrl(code.trim())) {
    const url = code.trim();
    let iframeCode;
    
    if (isN8nUrl(url)) {
      // n8n forms need specific settings
      iframeCode = `<iframe src="${url}" width="100%" height="700" frameborder="0" style="border:none; background: white;" allow="clipboard-write" sandbox="allow-same-origin allow-scripts allow-forms allow-popups"></iframe>`;
    } else {
      // Other forms
      iframeCode = `<iframe src="${url}" width="100%" height="600" frameborder="0" style="border:none;"></iframe>`;
    }
    
    return { type: 'iframe', code: iframeCode };
  }
  
  // Default to raw HTML
  return { type: 'html', code };
};

export const extractUrlFromCode = (code: string): string | null => {
  if (code.includes('<iframe')) {
    const srcMatch = code.match(/src="([^"]+)"/);
    return srcMatch ? srcMatch[1] : null;
  }
  
  // If it's just a URL, return it directly
  if (isValidUrl(code.trim())) {
    return code.trim();
  }
  
  return null;
};


import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface FooterLinkProps {
  to: string;
  textId: string;
  defaultText: string;
  external?: boolean;
}

const FooterLink = ({ to, textId, defaultText, external = false }: FooterLinkProps) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  const linkClasses = `${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`;
  
  const content = isAuthenticated ? (
    <EditableText 
      id={textId} 
      defaultText={defaultText}
    />
  ) : (
    defaultText
  );
  
  if (external) {
    return (
      <a 
        href={to} 
        target="_blank" 
        rel="noopener noreferrer"
        className={linkClasses}
      >
        {content}
      </a>
    );
  }
  
  return (
    <Link to={to} className={linkClasses}>
      {content}
    </Link>
  );
};

export default FooterLink;

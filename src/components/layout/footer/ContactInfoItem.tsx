
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';
import { ContactInfo } from '@/stores/contactInfoStore';

interface ContactInfoItemProps {
  fieldId: string;
  label: string;
  value: string;
  multiline?: boolean;
  isLink?: boolean;
  href?: string;
  onSave?: (value: string) => void;
}

const ContactInfoItem = ({ 
  fieldId, 
  label, 
  value, 
  multiline = false,
  isLink = false,
  href,
  onSave 
}: ContactInfoItemProps) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  const textClasses = theme === 'dark' ? 'text-gray-400 mb-2' : 'text-gray-600 mb-2';
  
  const content = isAuthenticated ? (
    <EditableText 
      id={fieldId} 
      defaultText={value}
      multiline={multiline}
      onSave={onSave}
    />
  ) : (
    <span> {value}</span>
  );
  
  return (
    <p className={textClasses}>
      <span className="font-medium">{label}:</span> 
      {isLink && href ? (
        <a 
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-800'} transition-colors`}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </p>
  );
};

export default ContactInfoItem;

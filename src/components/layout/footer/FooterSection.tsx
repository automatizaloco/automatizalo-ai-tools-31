
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface FooterSectionProps {
  titleId: string;
  defaultTitle: string;
  children: React.ReactNode;
}

const FooterSection = ({ titleId, defaultTitle, children }: FooterSectionProps) => {
  const { theme } = useTheme();
  const { isAuthenticated } = useAuth();
  
  return (
    <div>
      <h3 className={`font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        {isAuthenticated ? (
          <EditableText 
            id={titleId} 
            defaultText={defaultTitle}
          />
        ) : (
          defaultTitle
        )}
      </h3>
      <ul className="space-y-2">
        {children}
      </ul>
    </div>
  );
};

export default FooterSection;

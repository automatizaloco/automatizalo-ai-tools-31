
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { LucideIcon } from 'lucide-react';

interface SocialIconProps {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const SocialIcon = ({ href, label, icon }: SocialIconProps) => {
  const { theme } = useTheme();
  
  return (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors p-2 rounded-full flex items-center justify-center ${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-200'}`}
      aria-label={label}
    >
      {icon}
    </a>
  );
};

export default SocialIcon;

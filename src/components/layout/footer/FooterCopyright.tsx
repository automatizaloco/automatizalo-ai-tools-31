
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const FooterCopyright = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <div className="border-t border-gray-800 mt-12 pt-8">
      <div className="flex flex-col md:flex-row md:justify-between items-center">
        <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}>
          &copy; {currentYear} Automatízalo.
        </p>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <Link 
            to="/privacy-policy" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
          >
            Privacy Policy
          </Link>
          <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
          <Link 
            to="/privacy-policy?tab=terms" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
          >
            Terms of Service
          </Link>
          <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
          <Link 
            to="/unsubscribe" 
            className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors`}
          >
            Unsubscribe
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FooterCopyright;

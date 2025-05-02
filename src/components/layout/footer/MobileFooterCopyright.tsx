
import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/context/ThemeContext';

const MobileFooterCopyright = () => {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();
  
  return (
    <div className={`border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'} pt-4 text-center`}>
      <p className={theme === 'dark' ? 'text-gray-500 text-sm' : 'text-gray-600 text-sm'}>
        &copy; {currentYear} Automatízalo.
      </p>
      <div className="mt-3 flex flex-wrap justify-center gap-2 text-sm">
        <Link 
          to="/privacy-policy" 
          className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors px-2`}
        >
          Privacy
        </Link>
        <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
        <Link 
          to="/privacy-policy?tab=terms" 
          className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors px-2`}
        >
          Terms
        </Link>
        <span className={theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>•</span>
        <Link 
          to="/unsubscribe" 
          className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors px-2`}
        >
          Unsubscribe
        </Link>
      </div>
    </div>
  );
};

export default MobileFooterCopyright;

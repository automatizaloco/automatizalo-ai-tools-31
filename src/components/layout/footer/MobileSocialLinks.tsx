
import React from 'react';
import { Instagram } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import SocialIcon from './SocialIcon';

const MobileSocialLinks = () => {
  const { theme } = useTheme();

  return (
    <div className="flex space-x-4 justify-center mt-4 mb-6">
      <SocialIcon
        href="https://www.facebook.com/automatizalo.co"
        label="Facebook"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
          </svg>
        }
      />
      <SocialIcon
        href="https://x.com/Automatizalo_co"
        label="X (Twitter)"
        icon={
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
          </svg>
        }
      />
      <SocialIcon
        href="https://www.instagram.com/automatizalo.co/"
        label="Instagram"
        icon={<Instagram size={20} />}
      />
    </div>
  );
};

export default MobileSocialLinks;

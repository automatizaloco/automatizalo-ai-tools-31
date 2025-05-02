
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

const FooterWhatsAppButton = () => {
  const { theme } = useTheme();

  const handleWhatsAppClick = () => {
    const whatsappNumber = "+57 3192963363";
    const cleanPhone = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent("Hello, I would like more information");
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <button 
      onClick={handleWhatsAppClick}
      className={`${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'} transition-colors flex items-center gap-2 mb-2`}
    >
      <MessageCircle size={16} />
      <span>WhatsApp: +57 3192963363</span>
    </button>
  );
};

export default FooterWhatsAppButton;

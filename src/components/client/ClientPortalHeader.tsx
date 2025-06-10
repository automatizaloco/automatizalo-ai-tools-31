
import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ClientPortalHeader: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('clientPortal.title')}</h1>
      <p className="text-gray-600">{t('clientPortal.subtitle')}</p>
    </div>
  );
};

export default ClientPortalHeader;

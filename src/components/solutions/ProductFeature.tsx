
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface ProductFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  isEditable?: boolean;
  pageName?: string;
  sectionName?: string;
}

const ProductFeature = ({ 
  icon, 
  title, 
  description, 
  index, 
  isEditable = false,
  pageName,
  sectionName
}: ProductFeatureProps) => {
  const { isAuthenticated } = useAuth();
  const shouldShowEditable = isAuthenticated && isEditable && pageName && sectionName;

  return (
    <div
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 opacity-0 animate-in slide-in-from-bottom-8 fill-mode-forwards`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {shouldShowEditable ? (
              <EditableText
                id={`${pageName}-${sectionName}-title`}
                defaultText={title}
                pageName={pageName}
                sectionName={`${sectionName}.title`}
              />
            ) : (
              title
            )}
          </h3>
          <p className="text-gray-600">
            {shouldShowEditable ? (
              <EditableText
                id={`${pageName}-${sectionName}-description`}
                defaultText={description}
                pageName={pageName}
                sectionName={`${sectionName}.description`}
                multiline
              />
            ) : (
              description
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductFeature;

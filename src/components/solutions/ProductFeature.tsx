
import React from 'react';
import { useAuth } from '@/context/AuthContext';
import EditableText from '@/components/admin/EditableText';

interface ProductFeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  image: string;
  reverse?: boolean;
  delay?: number;
  index?: number;
  isEditable?: boolean;
  pageName?: string;
  sectionName?: string;
}

const ProductFeature = ({ 
  icon, 
  title, 
  description, 
  features,
  image,
  reverse = false,
  delay = 0,
  index = 0,
  isEditable = false,
  pageName,
  sectionName
}: ProductFeatureProps) => {
  const { isAuthenticated } = useAuth();
  const shouldShowEditable = isAuthenticated && isEditable && pageName && sectionName;

  return (
    <div
      className={`flex flex-col lg:flex-row items-center gap-8 mb-16 ${reverse ? 'lg:flex-row-reverse' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex-1">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mr-4">
            {icon}
          </div>
          <h3 className="text-2xl font-heading font-bold text-gray-900">
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
        </div>
        <p className="text-lg text-gray-600 mb-6">
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
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-center text-gray-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <img 
          src={image} 
          alt={title}
          className="w-full h-64 lg:h-80 object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default ProductFeature;

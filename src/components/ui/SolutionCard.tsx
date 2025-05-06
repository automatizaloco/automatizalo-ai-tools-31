import React, { useEffect, useState } from 'react';
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import withEditableImage from '@/components/admin/withEditableImage';
import { useLanguage } from '@/context/LanguageContext';
import { getPageContent } from '@/services/pageContentService';
interface SolutionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  imageUrl: string;
  delay?: number;
  index?: number;
  isEditable?: boolean;
  pageName?: string;
  sectionName?: string;
  imageId?: string;
}
const SolutionCard: React.FC<SolutionCardProps> = ({
  title,
  description,
  icon,
  features,
  imageUrl,
  delay = 0,
  index = 0,
  isEditable = false,
  pageName = "",
  sectionName = "",
  imageId = ""
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    language
  } = useLanguage();
  const [customFeature4, setCustomFeature4] = useState<string | null>(null);

  // Check if this is the Lead Generation card
  const isLeadGeneration = title.toLowerCase().includes('lead generation');
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100 + delay);

    // If this is the lead generation card, load the custom feature4 content
    if (isLeadGeneration) {
      const loadFeature4 = async () => {
        try {
          const content = await getPageContent('solutions', 'leadGeneration.feature4', language);
          if (content) {
            setCustomFeature4(content);
          }
        } catch (error) {
          console.error('Error loading lead generation feature4:', error);
        }
      };
      loadFeature4();
    }
    return () => clearTimeout(timer);
  }, [delay, isLeadGeneration, language]);

  // Create an editable image component using withEditableImage HOC
  const EditableImage = withEditableImage(({
    src,
    alt,
    className
  }: {
    src: string;
    alt: string;
    className?: string;
  }) => <img src={src} alt={alt} className={className} />);
  return <motion.div initial={{
    opacity: 0,
    y: 20
  }} animate={isVisible ? {
    opacity: 1,
    y: 0
  } : {}} transition={{
    duration: 0.5,
    delay: delay / 1000
  }} className="h-full">
      <Card className="h-full overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
        {/* Card image */}
        <div className="h-48 overflow-hidden">
          {isEditable && pageName && sectionName && imageId ? <EditableImage src={imageUrl} alt={title} pageName={pageName} sectionName={sectionName} imageId={imageId} className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110" /> : <img src={imageUrl} alt={title} className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-110" />}
        </div>
        
        <CardContent className="p-6 flex flex-col flex-grow">
          {/* Icon and title */}
          <div className="flex items-start mb-4">
            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-4">
              {icon}
            </div>
            <h3 className="text-xl font-heading font-semibold">{title}</h3>
          </div>
          
          {/* Description */}
          <p className="text-gray-600 mb-5">{description}</p>
          
          {/* Features list */}
          <div className="space-y-2 mb-6 flex-grow">
            {features.map((feature, idx) => <div key={idx} className="flex items-start">
                <div className="h-5 w-5 mt-0.5 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3 shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm text-gray-600">{feature}</span>
              </div>)}
              
            {/* Add channel options for Lead Generation card */}
            {isLeadGeneration && customFeature4}
          </div>
        </CardContent>
      </Card>
    </motion.div>;
};
export default SolutionCard;
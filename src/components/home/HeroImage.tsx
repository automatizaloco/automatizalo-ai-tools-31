
import React from 'react';
import withEditableImage from '@/components/admin/withEditableImage';

interface HeroImageProps {
  isEditable?: boolean;
}

const HeroImage: React.FC<HeroImageProps> = ({ isEditable = false }) => {
  // Create an editable image component using withEditableImage HOC
  const EditableImage = withEditableImage(({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} />
  ));

  return (
    <div className="rounded-xl overflow-hidden mb-8 shadow-lg border border-gray-200">
      {isEditable ? (
        <EditableImage 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800"
          alt="Person using computer"
          pageName="home"
          sectionName="hero"
          imageId="main"
          className="w-full h-auto object-cover"
        />
      ) : (
        <img 
          src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=800" 
          alt="Person using computer" 
          className="w-full h-auto object-cover"
        />
      )}
    </div>
  );
};

export default HeroImage;

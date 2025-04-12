
import React from 'react';
import HeroSection from './HeroSection';

interface HeroProps {
  isEditable?: boolean;
}

const Hero: React.FC<HeroProps> = ({ isEditable = false }) => {
  return <HeroSection isEditable={isEditable} />;
};

export default Hero;

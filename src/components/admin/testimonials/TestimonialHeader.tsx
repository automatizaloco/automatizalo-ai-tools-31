
import React from 'react';

interface TestimonialHeaderProps {
  email?: string;
}

const TestimonialHeader: React.FC<TestimonialHeaderProps> = ({ email }) => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-bold">Testimonial Manager</h1>
      <p className="text-gray-600 mt-2">Add and edit client testimonials</p>
      
      {email && (
        <div className="mt-2 text-sm text-green-600">
          Logged in as: {email}
        </div>
      )}
    </div>
  );
};

export default TestimonialHeader;

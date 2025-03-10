
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import EditableText from "@/components/admin/EditableText";

interface SolutionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  imageUrl: string;
  delay?: number;
  index?: number;
  isEditable?: boolean;
}

const SolutionCard = ({
  title,
  description,
  icon,
  features,
  imageUrl,
  delay = 0,
  index = 0,
  isEditable = false,
}: SolutionCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100 transition-all duration-700",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-16",
        index % 2 === 0 ? "lg:translate-y-8" : ""
      )}
      style={{ transitionDelay: `${(delay + 100) * 1}ms` }}
    >
      <div className="h-48 overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="bg-gray-100 p-2 rounded-lg text-gray-800 mr-3">
            {icon}
          </div>
          <h3 className="text-lg font-semibold">
            {isEditable ? (
              <EditableText 
                id={`solution-title-${index}`}
                defaultText={title}
              />
            ) : (
              title
            )}
          </h3>
        </div>

        <p className="text-gray-600 mb-5">
          {isEditable ? (
            <EditableText 
              id={`solution-description-${index}`}
              defaultText={description}
            />
          ) : (
            description
          )}
        </p>

        <ul className="space-y-2">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-800 shrink-0 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-gray-700">
                {isEditable ? (
                  <EditableText 
                    id={`solution-feature-${index}-${idx}`}
                    defaultText={feature}
                  />
                ) : (
                  feature
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SolutionCard;

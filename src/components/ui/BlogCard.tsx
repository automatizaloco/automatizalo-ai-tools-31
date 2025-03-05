
import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, ArrowRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  imageUrl: string;
  author: string;
  date: string;
  readTime: string;
  delay?: number;
  className?: string;
  featured?: boolean;
}

const BlogCard = ({
  id,
  title,
  excerpt,
  category,
  imageUrl,
  author,
  date,
  readTime,
  delay = 0,
  className,
  featured = false,
}: BlogCardProps) => {
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
        "bg-white rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-700 hover:shadow-lg",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16",
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <Link to={`/blog/${id}`} className="block">
        <div className={`relative ${featured ? 'h-64' : 'h-48'} overflow-hidden`}>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium">
            {category}
          </div>
        </div>
      </Link>

      <div className="p-5">
        <div className="flex items-center text-gray-500 text-xs mb-3 space-x-4">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{readTime}</span>
          </div>
        </div>

        <Link to={`/blog/${id}`} className="block">
          <h3 className={cn(
            "font-heading font-semibold mb-2 hover:text-automatizalo-blue transition-colors", 
            featured ? "text-2xl" : "text-lg"
          )}>
            {title}
          </h3>
        </Link>

        <p className={cn(
          "text-gray-600 mb-4",
          featured ? "text-base" : "text-sm"
        )}>
          {excerpt}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mr-2">
              <User size={16} />
            </div>
            <span className="text-xs text-gray-600">{author}</span>
          </div>

          <Link to={`/blog/${id}`} className="text-automatizalo-blue hover:text-automatizalo-blue/80 flex items-center text-sm font-medium">
            Read more
            <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;


import { Button } from "@/components/ui/button";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }: CategoryFilterProps) => {
  return (
    <div className="mb-10">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={activeCategory === category ? "default" : "outline"}
            className={`rounded-full ${
              activeCategory === category ? "bg-gray-800 text-white" : "border-gray-300 text-gray-700"
            }`}
            onClick={() => onCategoryChange(category)}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

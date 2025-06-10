
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TagFilterProps {
  tags: string[];
  activeTags: string[];
  onTagToggle: (tag: string) => void;
  onClearTags: () => void;
}

const TagFilter = ({ tags, activeTags, onTagToggle, onClearTags }: TagFilterProps) => {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Filtrar por tags</h3>
        {activeTags.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearTags}
            className="text-red-600 hover:text-red-700"
          >
            <X className="w-4 h-4 mr-1" />
            Limpiar filtros
          </Button>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Button
            key={tag}
            variant={activeTags.includes(tag) ? "default" : "outline"}
            size="sm"
            className={`rounded-full text-sm ${
              activeTags.includes(tag) 
                ? "bg-blue-600 text-white hover:bg-blue-700" 
                : "border-gray-300 text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => onTagToggle(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;

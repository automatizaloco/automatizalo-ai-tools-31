
import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { MoreVertical, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MobilePostCardProps {
  post: BlogPost;
  onToggleStatus: (post: BlogPost) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const MobilePostCard = ({ post, onToggleStatus, onEdit, onDelete }: MobilePostCardProps) => {
  const hasTranslations = (post: BlogPost) => {
    return post.translations && Object.keys(post.translations).length > 0;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{post.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onToggleStatus(post)}>
                {post.status === 'draft' ? 'Publish' : 'Move to Draft'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(post.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600" 
                onClick={() => onDelete(post.id)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-sm text-gray-600 mb-2">
          {post.category} • {post.date}
        </div>
        <div className="flex items-center gap-2 mb-2">
          <Badge className={post.status === 'draft' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'}>
            {post.status === 'draft' ? 'Draft' : 'Published'}
          </Badge>
          {post.featured && (
            <Badge className="bg-purple-100 text-purple-800">
              Featured
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {hasTranslations(post) ? (
            <>
              <Globe className="h-4 w-4 text-green-500" />
              <span className="text-green-500 text-xs">Translated</span>
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 text-gray-400" />
              <span className="text-gray-400 text-xs">English Only</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobilePostCard;


import { BlogPost } from "@/types/blog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Globe } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface BlogPostsTableProps {
  posts: BlogPost[];
  onToggleStatus: (post: BlogPost) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const BlogPostsTable = ({ posts, onToggleStatus, onEdit, onDelete }: BlogPostsTableProps) => {
  const hasTranslations = (post: BlogPost) => {
    return post.translations && Object.keys(post.translations).length > 0;
  };
  
  // Sort posts by date (newest first)
  const sortedPosts = [...posts].sort((a, b) => {
    // Use date property instead of created_at (which doesn't exist in BlogPost type)
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateB - dateA; // Descending order (newest first)
  });

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No posts found. Create your first blog post.
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Featured</TableHead>
          <TableHead>Translations</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedPosts.map((post) => (
          <TableRow key={post.id} className="hover:bg-gray-50">
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{post.category}</TableCell>
            <TableCell>{post.date}</TableCell>
            <TableCell>
              <Badge className={post.status === 'draft' ? 'bg-amber-100 text-amber-800 hover:bg-amber-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}>
                {post.status === 'draft' ? 'Draft' : 'Published'}
              </Badge>
            </TableCell>
            <TableCell>
              {post.featured ? "Yes" : "No"}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1">
                {hasTranslations(post) ? (
                  <>
                    <Globe className="h-4 w-4 text-green-500" />
                    <span className="text-green-500">Translated</span>
                  </>
                ) : (
                  <>
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">English Only</span>
                  </>
                )}
              </div>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline"
                  size="sm" 
                  className={post.status === 'draft' ? 'text-green-600 hover:text-green-800 border-green-200 hover:bg-green-50' : 'text-amber-600 hover:text-amber-800 border-amber-200 hover:bg-amber-50'}
                  onClick={() => onToggleStatus(post)}
                >
                  {post.status === 'draft' ? 'Publish' : 'To Draft'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit(post.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDelete(post.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BlogPostsTable;

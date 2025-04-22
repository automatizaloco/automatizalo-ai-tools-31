
import { Button } from "@/components/ui/button";
import { PlusCircle, Webhook, Wand2, Bell } from "lucide-react";

interface BlogAdminHeaderProps {
  onCreatePost: () => void;
  onCreateAutomatic: () => void;
  onWebhookSettings: () => void;
  onNotifications: () => void;
  isMobile: boolean;
}

const BlogAdminHeader = ({ 
  onCreatePost, 
  onCreateAutomatic, 
  onWebhookSettings,
  onNotifications, 
  isMobile 
}: BlogAdminHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-8 gap-3">
      <h1 className="text-xl md:text-3xl font-bold">Blog Management</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline"
          onClick={onWebhookSettings}
          className="flex items-center gap-2 text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <Webhook className="w-4 h-4" />
          {isMobile ? "Webhooks" : "Webhook Settings"}
        </Button>
        <Button 
          variant="outline"
          onClick={onNotifications}
          className="flex items-center gap-2 text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <Bell className="w-4 h-4" />
          {isMobile ? "Notifs" : "Notifications"}
        </Button>
        <Button 
          variant="outline"
          onClick={onCreateAutomatic}
          className="flex items-center gap-2 text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <Wand2 className="w-4 h-4" />
          {isMobile ? "AI" : "AI Generate"}
        </Button>
        <Button 
          onClick={onCreatePost}
          className="bg-gray-900 hover:bg-gray-800 text-sm"
          size={isMobile ? "sm" : "default"}
        >
          <PlusCircle className={isMobile ? "h-4 w-4" : "mr-2 h-4 w-4"} />
          {!isMobile && "Create New Post"}
        </Button>
      </div>
    </div>
  );
};

export default BlogAdminHeader;

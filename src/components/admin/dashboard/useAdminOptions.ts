
import { useMemo } from 'react';
import { 
  PenSquare, 
  MessageSquare, 
  Mail, 
  Webhook, 
  Wand2, 
  Bell, 
  Settings, 
  Bot, 
  HelpCircle 
} from "lucide-react";
import { AdminOption } from './types';

export const useAdminOptions = () => {
  const adminOptions: AdminOption[] = useMemo(() => [
    {
      title: "User Management",
      description: "Manage admin and client users",
      route: "/admin/users",
      icon: Settings,
      category: "Management"
    },
    {
      title: "Blog Posts",
      description: "Create, edit, and manage blog posts",
      route: "/admin/blog",
      icon: PenSquare,
      category: "Content"
    },
    {
      title: "AI Blog",
      description: "Generate blog posts using AI assistance",
      route: "/admin/automatic-blog",
      icon: Wand2,
      category: "Content"
    },
    {
      title: "Automations",
      description: "Create and manage automations for clients",
      route: "/admin/automations",
      icon: Bot,
      category: "Client Services"
    },
    {
      title: "Support Tickets",
      description: "Manage client support requests",
      route: "/admin/support",
      icon: HelpCircle,
      category: "Client Services"
    },
    {
      title: "Webhooks",
      description: "Configure webhook endpoints for blog posts and social media",
      route: "/admin/webhooks",
      icon: Webhook,
      category: "Integrations"
    },
    {
      title: "Testimonials",
      description: "Manage customer testimonials",
      route: "/admin/testimonials",
      icon: MessageSquare,
      category: "Content"
    },
    {
      title: "Newsletter",
      description: "Manage newsletter templates and send newsletters",
      route: "/admin/newsletters",
      icon: Mail,
      category: "Communications"
    },
    {
      title: "Notifications",
      description: "View system notifications and alerts",
      route: "/admin/notifications",
      icon: Bell,
      category: "System"
    }
  ], []);

  // Group options by category
  const groupedOptions = useMemo(() => adminOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, AdminOption[]>), [adminOptions]);

  // Sort categories to ensure a consistent order
  const sortedCategories = useMemo(() => 
    Object.keys(groupedOptions).sort(), 
    [groupedOptions]
  );

  return {
    adminOptions,
    groupedOptions,
    sortedCategories
  };
};

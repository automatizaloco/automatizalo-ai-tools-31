import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PenSquare, MessageSquare, Mail, LayoutDashboard, Webhook, Wand2, Bell, Settings, Bot, HelpCircle } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ContentManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const adminOptions = [
    {
      title: "User Management",
      description: "Manage admin and client users",
      route: "/admin/users",
      icon: Settings
    },
    {
      title: "Blog Posts",
      description: "Create, edit, and manage blog posts",
      route: "/admin/blog",
      icon: PenSquare
    },
    {
      title: "AI Blog",
      description: "Generate blog posts using AI assistance",
      route: "/admin/automatic-blog",
      icon: Wand2
    },
    {
      title: "Automations",
      description: "Create and manage automations for clients",
      route: "/admin/automations",
      icon: Bot
    },
    {
      title: "Support Tickets",
      description: "Manage client support requests",
      route: "/admin/support",
      icon: HelpCircle
    },
    {
      title: "Webhooks",
      description: "Configure webhook endpoints for blog posts and social media",
      route: "/admin/webhooks",
      icon: Webhook
    },
    {
      title: "Testimonials",
      description: "Manage customer testimonials",
      route: "/admin/testimonials",
      icon: MessageSquare
    },
    {
      title: "Newsletter",
      description: "Manage newsletter templates and send newsletters",
      route: "/admin/newsletters",
      icon: Mail
    },
    {
      title: "Notifications",
      description: "View system notifications and alerts",
      route: "/admin/notifications",
      icon: Bell
    }
  ];

  return (
    <div className="container mx-auto px-0 md:px-4">
      <div className="mb-4 md:mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl md:text-3xl font-bold">Admin Dashboard</h1>
          {!isMobile && (
            <Button onClick={() => navigate("/")}>Back to Homepage</Button>
          )}
        </div>
        
        {user && (
          <div className="text-sm text-gray-600">
            Logged in as: {user.email}
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {adminOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card 
              key={option.route} 
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-2 md:pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <CardTitle className="text-lg md:text-xl">{option.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pb-2 md:pb-4">
                <CardDescription className="text-sm md:text-base">{option.description}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => navigate(option.route)}
                  className="w-full"
                  size={isMobile ? "sm" : "default"}
                >
                  Manage {isMobile ? "" : option.title}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContentManager;

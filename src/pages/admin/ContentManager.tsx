import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
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
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import AdminBaseLayout from "./layout/AdminBaseLayout";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

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
      <AdminBaseLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AdminBaseLayout>
    );
  }

  const adminOptions = [
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
  ];

  // Group options by category
  const groupedOptions = adminOptions.reduce((acc, option) => {
    if (!acc[option.category]) {
      acc[option.category] = [];
    }
    acc[option.category].push(option);
    return acc;
  }, {} as Record<string, typeof adminOptions>);

  // Sort categories to ensure a consistent order
  const sortedCategories = Object.keys(groupedOptions).sort();

  return (
    <AdminBaseLayout hideTitle={false}>
      <div className="container mx-auto px-0 md:px-4">
        <div className="mb-4 md:mb-4">
          {user && (
            <div className="text-sm text-gray-600">
              Logged in as: {user.email}
            </div>
          )}
        </div>
        
        {isMobile ? (
          <Accordion type="single" collapsible className="w-full">
            {sortedCategories.map((category) => (
              <AccordionItem key={category} value={category}>
                <AccordionTrigger className="px-2">
                  <span className="font-medium">{category}</span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="grid grid-cols-1 gap-3 px-2">
                    {groupedOptions[category].map((option) => {
                      const Icon = option.icon;
                      return (
                        <Card 
                          key={option.route} 
                          className="hover:shadow-lg transition-shadow"
                        >
                          <div className="p-4">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="p-2 bg-gray-50 rounded-lg">
                                <Icon className="h-5 w-5 text-gray-600" />
                              </div>
                              <h3 className="text-lg font-medium">{option.title}</h3>
                            </div>
                            <p className="text-gray-500 text-sm mb-3">{option.description}</p>
                            <Button 
                              onClick={() => navigate(option.route)}
                              className="w-full"
                              size="sm"
                            >
                              Manage
                            </Button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
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
                      Manage {option.title}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </AdminBaseLayout>
  );
};

export default ContentManager;

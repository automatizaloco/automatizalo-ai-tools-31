
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PenSquare, MessageSquare, Mail, LayoutDashboard, Globe, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const ContentManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Redirect if not logged in
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
      title: "Blog Posts",
      description: "Create, edit, and manage blog posts",
      route: "/admin/blog",
      icon: PenSquare
    },
    {
      title: "Automatic Blog",
      description: "Generate blog posts automatically with AI",
      route: "/admin/automatic-blog",
      icon: Sparkles
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
      route: "/admin/newsletter",
      icon: Mail
    },
    {
      title: "Website Content",
      description: "Edit content, images, and text across all website pages",
      route: "/admin/content-editor",
      icon: Globe
    },
    {
      title: "Page Layout",
      description: "Manage page sections and their arrangements",
      route: "/admin/layout-manager",
      icon: LayoutDashboard
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
            <div 
              key={option.route} 
              className="bg-white shadow-md rounded-lg p-4 md:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <Icon className="h-5 w-5 text-gray-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold">{option.title}</h2>
              </div>
              <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">{option.description}</p>
              <Button 
                onClick={() => navigate(option.route)}
                className="w-full"
                size={isMobile ? "sm" : "default"}
              >
                Manage {isMobile ? "" : option.title}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentManager;

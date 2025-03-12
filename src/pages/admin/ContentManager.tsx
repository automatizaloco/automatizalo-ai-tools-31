
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { PenSquare, MessageSquare, Mail, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ContentManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if not logged in
  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  if (!user) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  const adminOptions = [
    {
      title: "Blog Posts",
      description: "Create, edit, and manage blog posts",
      route: "/admin/blog",
      icon: PenSquare
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
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <Button onClick={() => navigate("/")}>Back to Homepage</Button>
            </div>
            
            {user && (
              <div className="text-sm text-gray-600">
                Logged in as: {user.email}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminOptions.map((option) => {
              const Icon = option.icon;
              return (
                <div 
                  key={option.route} 
                  className="bg-white shadow-md rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      <Icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <h2 className="text-xl font-semibold">{option.title}</h2>
                  </div>
                  <p className="text-gray-600 mb-4">{option.description}</p>
                  <Button 
                    onClick={() => navigate(option.route)}
                    className="w-full"
                  >
                    Manage {option.title}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentManager;


import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

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
      route: "/admin/blog"
    },
    {
      title: "Testimonials",
      description: "Manage customer testimonials",
      route: "/admin/testimonials"
    },
    {
      title: "Newsletter",
      description: "Manage newsletter templates and send newsletters",
      route: "/admin/newsletter"
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => navigate("/")}>Back to Homepage</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminOptions.map((option) => (
          <div key={option.route} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
            <p className="text-gray-600 mb-4">{option.description}</p>
            <Button onClick={() => navigate(option.route)}>
              Manage {option.title}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;

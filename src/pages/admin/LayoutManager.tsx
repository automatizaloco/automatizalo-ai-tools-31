
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ArrowUp, ArrowDown, Trash2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const LayoutManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin/layout-manager');
    }
  }, [user, navigate]);

  const sections = [
    { id: 1, name: 'Hero Section', visible: true },
    { id: 2, name: 'About Section', visible: true },
    { id: 3, name: 'Solutions Section', visible: true },
    { id: 4, name: 'Testimonials Section', visible: true },
    { id: 5, name: 'Call to Action Section', visible: true },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Page Layout Manager</h1>
              <Button onClick={() => navigate("/admin")}>Back to Admin</Button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Homepage Sections</h2>
            <div className="space-y-4">
              {sections.map((section) => (
                <div 
                  key={section.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{section.name}</span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LayoutManager;

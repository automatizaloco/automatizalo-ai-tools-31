
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RichTextEditor } from "@/components/editor/RichTextEditor";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const ContentEditor = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  React.useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin/content-editor');
    }
  }, [user, navigate]);

  const handleContentUpdate = (page: string, content: string) => {
    console.log(`Updating content for ${page}:`, content);
    // TODO: Implement content update logic
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Website Content Editor</h1>
              <Button onClick={() => navigate("/admin")}>Back to Admin</Button>
            </div>
          </div>

          <Tabs defaultValue="home" className="space-y-4">
            <TabsList>
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="about">About Section</TabsTrigger>
              <TabsTrigger value="solutions">Solutions Page</TabsTrigger>
              <TabsTrigger value="contact">Contact Page</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Hero Section</h2>
                <RichTextEditor
                  value="<h1>Edit your hero content here</h1>"
                  onChange={(content) => handleContentUpdate('home-hero', content)}
                />
              </div>
            </TabsContent>

            <TabsContent value="about" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">About Section</h2>
                <RichTextEditor
                  value="<h2>Edit your about section content here</h2>"
                  onChange={(content) => handleContentUpdate('about', content)}
                />
              </div>
            </TabsContent>

            <TabsContent value="solutions" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Solutions Page</h2>
                <RichTextEditor
                  value="<h2>Edit your solutions page content here</h2>"
                  onChange={(content) => handleContentUpdate('solutions', content)}
                />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Contact Page</h2>
                <RichTextEditor
                  value="<h2>Edit your contact page content here</h2>"
                  onChange={(content) => handleContentUpdate('contact', content)}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ContentEditor;

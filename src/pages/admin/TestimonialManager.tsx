import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Trash2 } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
}

const TestimonialManager = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { t } = useLanguage();
  
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: 1,
      name: t("testimonials.client1.name"),
      company: t("testimonials.client1.company"),
      text: t("testimonials.client1.text"),
      rating: 5
    },
    {
      id: 2,
      name: t("testimonials.client2.name"),
      company: t("testimonials.client2.company"),
      text: t("testimonials.client2.text"),
      rating: 5
    },
    {
      id: 3,
      name: t("testimonials.client3.name"),
      company: t("testimonials.client3.company"),
      text: t("testimonials.client3.text"),
      rating: 5
    }
  ]);
  
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id'>>({
    name: "",
    company: "",
    text: "",
    rating: 5
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleTestimonialChange = (id: number, field: keyof Testimonial, value: string | number) => {
    setTestimonials(prev => 
      prev.map(testimonial => 
        testimonial.id === id ? { ...testimonial, [field]: value } : testimonial
      )
    );
  };

  const handleAddTestimonial = () => {
    if (!newTestimonial.name || !newTestimonial.company || !newTestimonial.text) {
      toast.error("Please fill in all fields");
      return;
    }
    
    const newId = Math.max(0, ...testimonials.map(t => t.id)) + 1;
    
    setTestimonials(prev => [
      ...prev,
      { ...newTestimonial, id: newId }
    ]);
    
    setNewTestimonial({
      name: "",
      company: "",
      text: "",
      rating: 5
    });
    
    toast.success("Testimonial added successfully!");
  };

  const handleDeleteTestimonial = (id: number) => {
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
    toast.success("Testimonial deleted successfully!");
  };

  const handleSaveAllTestimonials = () => {
    // In a real app, this would save to your backend
    toast.success("All testimonials saved successfully!");
  };

  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      toast.error("Please login to access the testimonial manager");
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Testimonial Manager</h1>
            <p className="text-gray-600 mt-2">Add and edit client testimonials</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
            {/* Add New Testimonial */}
            <Card>
              <CardHeader>
                <CardTitle>Add New Testimonial</CardTitle>
                <CardDescription>Create a new client testimonial to display on your website</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Client Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newTestimonial.name}
                    onChange={handleInputChange}
                    placeholder="e.g. John Smith"
                  />
                </div>
                
                <div>
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    name="company"
                    value={newTestimonial.company}
                    onChange={handleInputChange}
                    placeholder="e.g. Acme Inc."
                  />
                </div>
                
                <div>
                  <Label htmlFor="text">Testimonial Text</Label>
                  <Textarea
                    id="text"
                    name="text"
                    value={newTestimonial.text}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="What did the client say about your service?"
                  />
                </div>
                
                <div>
                  <Label htmlFor="rating">Rating (1-5)</Label>
                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="1"
                    max="5"
                    value={newTestimonial.rating}
                    onChange={handleInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleAddTestimonial} className="ml-auto">
                  Add Testimonial
                </Button>
              </CardFooter>
            </Card>
            
            {/* Existing Testimonials */}
            <Card>
              <CardHeader>
                <CardTitle>Existing Testimonials</CardTitle>
                <CardDescription>Edit or delete existing testimonials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 w-full">
                        <div>
                          <Label htmlFor={`name-${testimonial.id}`}>Client Name</Label>
                          <Input
                            id={`name-${testimonial.id}`}
                            value={testimonial.name}
                            onChange={(e) => handleTestimonialChange(testimonial.id, 'name', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`company-${testimonial.id}`}>Company</Label>
                          <Input
                            id={`company-${testimonial.id}`}
                            value={testimonial.company}
                            onChange={(e) => handleTestimonialChange(testimonial.id, 'company', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`text-${testimonial.id}`}>Testimonial Text</Label>
                          <Textarea
                            id={`text-${testimonial.id}`}
                            value={testimonial.text}
                            onChange={(e) => handleTestimonialChange(testimonial.id, 'text', e.target.value)}
                            rows={3}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`rating-${testimonial.id}`}>Rating (1-5)</Label>
                          <Input
                            id={`rating-${testimonial.id}`}
                            type="number"
                            min="1"
                            max="5"
                            value={testimonial.rating}
                            onChange={(e) => handleTestimonialChange(testimonial.id, 'rating', parseInt(e.target.value))}
                          />
                        </div>
                      </div>
                      
                      <Button
                        variant="destructive"
                        size="icon"
                        className="ml-4"
                        onClick={() => handleDeleteTestimonial(testimonial.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {testimonials.length === 0 && (
                  <div className="text-center p-8 text-gray-500">
                    No testimonials yet. Add your first one above.
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveAllTestimonials} className="ml-auto">
                  Save All Changes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestimonialManager;

import React, { useState, useEffect } from "react";
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
import { Trash2, Loader2, AlertTriangle } from "lucide-react";
import { 
  fetchTestimonials, 
  createTestimonial, 
  updateTestimonial, 
  deleteTestimonial 
} from "@/services/supabaseService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Testimonial {
  id: string;
  name: string;
  company: string | null;
  text: string;
}

const TestimonialManager = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id'>>({
    name: "",
    company: "",
    text: ""
  });

  // Fetch testimonials from Supabase
  const { data: testimonials = [], isLoading, error: fetchError } = useQuery({
    queryKey: ['testimonials'],
    queryFn: fetchTestimonials,
    // Only attempt to fetch if the user is authenticated
    enabled: isAuthenticated,
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (testimonial: Omit<Testimonial, 'id'>) => createTestimonial(testimonial),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success("Testimonial added successfully!");
      setNewTestimonial({
        name: "",
        company: "",
        text: ""
      });
    },
    onError: (error: any) => {
      console.error('Error creating testimonial:', error);
      toast.error(`Failed to add testimonial: ${error.message || "Unknown error"}`);
    }
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Testimonial> }) => 
      updateTestimonial(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success("Testimonial updated successfully!");
    },
    onError: (error: any) => {
      console.error('Error updating testimonial:', error);
      toast.error(`Failed to update testimonial: ${error.message || "Unknown error"}`);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteTestimonial(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['testimonials'] });
      toast.success("Testimonial deleted successfully!");
    },
    onError: (error: any) => {
      console.error('Error deleting testimonial:', error);
      toast.error(`Failed to delete testimonial: ${error.message || "Unknown error"}`);
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestimonialChange = (id: string, field: keyof Testimonial, value: string) => {
    updateMutation.mutate({ 
      id, 
      updates: { [field]: value } 
    });
  };

  const handleAddTestimonial = () => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to add testimonials");
      return;
    }

    if (!newTestimonial.name || !newTestimonial.text) {
      toast.error("Please fill in at least name and testimonial text");
      return;
    }
    
    createMutation.mutate(newTestimonial);
  };

  const handleDeleteTestimonial = (id: string) => {
    if (!isAuthenticated) {
      toast.error("You must be logged in to delete testimonials");
      return;
    }
    
    deleteMutation.mutate(id);
  };

  useEffect(() => {
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
            
            {user && (
              <div className="mt-2 text-sm text-green-600">
                Logged in as: {user.email}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
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
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input
                    id="company"
                    name="company"
                    value={newTestimonial.company || ""}
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
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleAddTestimonial} 
                  className="ml-auto"
                  disabled={createMutation.isPending || !isAuthenticated}
                >
                  {createMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Testimonial"
                  )}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Existing Testimonials</CardTitle>
                <CardDescription>Edit or delete existing testimonials</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {fetchError ? (
                  <div className="p-4 border border-red-200 rounded-md bg-red-50 text-red-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    <div>
                      <p className="font-medium">Error loading testimonials</p>
                      <p className="text-sm">{(fetchError as Error).message}</p>
                    </div>
                  </div>
                ) : isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                  </div>
                ) : (
                  <>
                    {testimonials.length > 0 ? (
                      testimonials.map((testimonial) => (
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
                                <Label htmlFor={`company-${testimonial.id}`}>Company (Optional)</Label>
                                <Input
                                  id={`company-${testimonial.id}`}
                                  value={testimonial.company || ""}
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
                            </div>
                            
                            <Button
                              variant="destructive"
                              size="icon"
                              className="ml-4"
                              onClick={() => handleDeleteTestimonial(testimonial.id)}
                              disabled={deleteMutation.isPending}
                            >
                              {deleteMutation.isPending ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center p-8 text-gray-500">
                        No testimonials yet. Add your first one above.
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TestimonialManager;

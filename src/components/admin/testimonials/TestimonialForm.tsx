
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Testimonial } from "@/services/testimonialService";

interface TestimonialFormProps {
  onSubmit: (testimonial: Omit<Testimonial, 'id'>) => void;
  isPending: boolean;
}

const TestimonialForm: React.FC<TestimonialFormProps> = ({ onSubmit, isPending }) => {
  const [newTestimonial, setNewTestimonial] = useState<Omit<Testimonial, 'id'>>({
    name: "",
    company: "",
    text: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTestimonial(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = () => {
    onSubmit(newTestimonial);
  };

  return (
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
          onClick={handleSubmit} 
          className="ml-auto"
          disabled={isPending}
        >
          {isPending ? (
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
  );
};

export default TestimonialForm;

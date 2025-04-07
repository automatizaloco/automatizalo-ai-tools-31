
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendPostToN8N, processAndSaveWebhookResponse } from "@/services/blog/writeBlogPosts";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { BlogPost, NewBlogPost } from "@/types/blog";
import { useIsMobile } from "@/hooks/use-mobile";

const AutomaticBlog = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  });
  const [error, setError] = useState("");
  const isMobile = useIsMobile();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear any previous error when user makes changes
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title) {
      toast.error("Please enter a title");
      return;
    }

    setIsLoading(true);
    setError("");
    
    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      // Prepare data for the webhook
      const slug = formData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-');
      const blogPostData: NewBlogPost = {
        title: formData.title,
        slug: slug,
        excerpt: "", // Will be generated by the webhook
        content: "", // Will be generated by the webhook
        category: "Automatic",
        tags: ["automatic", "ai-generated"],
        author: "AI Assistant",
        date: new Date().toISOString().split('T')[0],
        readTime: "3 min", // This will be mapped to read_time in createBlogPost
        image: "https://via.placeholder.com/800x400",
        featured: false,
        status: 'draft', // Set as draft by default
        url: formData.url || "",
      };

      console.log("Sending data to webhook:", blogPostData);

      // Send to webhook and get response
      const responseText = await sendPostToN8N(blogPostData);
      console.log("Webhook response received:", responseText);
      
      // Process the response from N8N and save to database
      const savedBlogPost = await processAndSaveWebhookResponse(
        responseText, 
        formData.title,
        slug
      );
      
      console.log("Blog post saved to database:", savedBlogPost);
      
      // Set progress to 100% before redirecting
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("Blog post has been generated and saved as a draft");
      
      // Wait a moment to show the completed progress
      setTimeout(() => {
        // Trigger an event to refresh the blog list
        window.dispatchEvent(new CustomEvent('blogPostUpdated'));
        navigate("/admin/blog");
      }, 1000);
      
    } catch (error) {
      console.error("Error generating blog post:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Failed to generate blog post");
      clearInterval(progressInterval);
      setProgress(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-0 md:px-4 py-2 md:py-6 max-w-2xl">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
        {isMobile ? "Auto Blog" : "Automatic Blog Generator"}
      </h1>
      
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Create AI-Generated Blog Post</CardTitle>
          <CardDescription>
            Enter a title and optional source URL to generate a complete blog post automatically.
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter the blog post title"
                className="border-gray-200 focus:border-blue-500 transition-all duration-200"
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url" className="text-sm font-medium">
                Source URL (optional)
              </Label>
              <Input
                id="url"
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://example.com/source-article"
                className="border-gray-200 focus:border-blue-500 transition-all duration-200"
                disabled={isLoading}
              />
              <p className="text-xs md:text-sm text-gray-500 mt-1">
                If provided, the AI will use this URL as reference
              </p>
            </div>
            
            {isLoading && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Generating blog post draft...</p>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
                <p className="font-medium mb-1">Error:</p>
                <p>{error}</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col md:flex-row justify-end md:space-x-4 border-t border-gray-100 pt-4 space-y-2 md:space-y-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blog")}
              disabled={isLoading}
              className="w-full md:w-auto transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.title}
              className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
            >
              {isLoading ? "Generating..." : isMobile ? "Generate" : "Generate Blog Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AutomaticBlog;

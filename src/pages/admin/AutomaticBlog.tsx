
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { sendPostToN8N, createBlogPost } from "@/services/blog/writeBlogPosts";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { BlogPost, NewBlogPost } from "@/types/blog";

const AutomaticBlog = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
  });
  const [error, setError] = useState("");

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
      const blogPostData = {
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, '-'),
        excerpt: "", // Will be generated by the webhook
        content: "", // Will be generated by the webhook
        category: "Automatic",
        tags: ["automatic", "ai-generated"],
        author: "AI Assistant",
        date: new Date().toISOString().split('T')[0],
        readTime: "3 min",
        image: "https://via.placeholder.com/800x400",
        featured: false,
        url: formData.url || "",
      };

      // Send to webhook and get response
      const response = await sendPostToN8N(blogPostData);
      console.info("Webhook response:", response);
      
      // Process the response from N8N
      if (response && response.output) {
        try {
          // Extract the JSON data from the response output (which is enclosed in ```json ... ```)
          const jsonMatch = response.output.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            const generatedContent = JSON.parse(jsonMatch[1]);
            
            // Create a new blog post with the generated content
            const newBlogPost: NewBlogPost = {
              title: generatedContent.title || formData.title,
              slug: generatedContent.slug || blogPostData.slug,
              excerpt: generatedContent.excerpt || "Auto-generated blog post",
              content: generatedContent.content || "",
              category: generatedContent.category || "Automatic",
              tags: generatedContent.tags || ["automatic", "ai-generated"],
              author: generatedContent.author || "AI Assistant",
              date: generatedContent.date || blogPostData.date,
              readTime: generatedContent.read_time || "3 min",
              image: response.data?.[0]?.url || blogPostData.image,
              featured: false
            };
            
            // Save the new blog post to the database
            await createBlogPost(newBlogPost);
          }
        } catch (parseError) {
          console.error("Error parsing webhook response:", parseError);
          setError("Error processing the generated content. Please try again.");
          toast.error("Failed to process the generated content");
          clearInterval(progressInterval);
          setIsLoading(false);
          return;
        }
      }
      
      // Set progress to 100% before redirecting
      setProgress(100);
      clearInterval(progressInterval);
      
      toast.success("Blog post has been generated and saved successfully!");
      
      // Wait a moment to show the completed progress
      setTimeout(() => {
        navigate("/admin/blog");
      }, 1000);
      
    } catch (error) {
      console.error("Error generating blog post:", error);
      setError(error instanceof Error ? error.message : "Unknown error occurred");
      toast.error("Failed to generate blog post");
      clearInterval(progressInterval);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Automatic Blog Generator</h1>
      
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader>
          <CardTitle className="text-xl">Create AI-Generated Blog Post</CardTitle>
          <CardDescription>
            Enter a title and optional source URL to generate a complete blog post automatically
          </CardDescription>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
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
              <p className="text-sm text-gray-500 mt-1">
                If provided, the AI will use this URL as reference for the content
              </p>
            </div>
            
            {isLoading && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">Generating blog post...</p>
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
          
          <CardFooter className="flex justify-end space-x-4 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/admin/blog")}
              disabled={isLoading}
              className="transition-all duration-200"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !formData.title}
              className="bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
            >
              {isLoading ? "Generating..." : "Generate Blog Post"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default AutomaticBlog;

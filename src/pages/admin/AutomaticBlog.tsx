
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

const AutomaticBlog = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  return (
    <div className="container mx-auto px-0 md:px-4 py-2 md:py-6 max-w-4xl">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-lg md:text-xl">Create AI-Generated Blog Post</CardTitle>
          <CardDescription>
            Fill out the form below to generate a complete blog post automatically using AI.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4 md:space-y-6">
          {/* Embedded Form */}
          <div className="w-full">
            <iframe
              src="https://automatizalo-n8n.v4zcph.easypanel.host/form/53adc78b-4ee7-4fa6-a657-c922847e965a"
              width="100%"
              height="600"
              frameBorder="0"
              style={{ border: 'none', borderRadius: '8px' }}
              title="AI Blog Generation Form"
              className="w-full"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col md:flex-row justify-end md:space-x-4 border-t border-gray-100 pt-4 space-y-2 md:space-y-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/admin/blog")}
            className="w-full md:w-auto transition-all duration-200"
          >
            Back to Blog Admin
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AutomaticBlog;


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Settings, Webhook, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { useWebhookStore, WebhookMode } from "@/stores/webhookStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const WebhookManager = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [testingStatus, setTestingStatus] = useState<Record<string, "idle" | "success" | "error">>({
    blogCreation: "idle",
    blogSocial: "idle",
  });
  const [requestMethods, setRequestMethods] = useState<Record<string, "POST" | "GET">>({
    blogCreation: "POST",
    blogSocial: "POST",
  });

  const {
    blogCreationUrl,
    blogSocialShareUrl,
    updateBlogCreationUrl,
    updateBlogSocialShareUrl,
    getActiveBlogCreationUrl,
    getActiveBlogSocialShareUrl
  } = useWebhookStore();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
  }, [isAuthenticated, navigate]);

  const handleModeChange = (type: "blogCreation" | "blogSocial", newMode: WebhookMode) => {
    if (type === "blogCreation") {
      updateBlogCreationUrl({ mode: newMode });
      toast.success(`Blog creation webhook set to ${newMode} mode`);
    } else {
      updateBlogSocialShareUrl({ mode: newMode });
      toast.success(`Blog social sharing webhook set to ${newMode} mode`);
    }
  };

  const handleUrlUpdate = (
    type: "blogCreation" | "blogSocial", 
    mode: "test" | "production", 
    value: string
  ) => {
    if (type === "blogCreation") {
      updateBlogCreationUrl({ [mode]: value });
    } else {
      updateBlogSocialShareUrl({ [mode]: value });
    }
  };
  
  const handleMethodChange = (type: "blogCreation" | "blogSocial", method: "POST" | "GET") => {
    setRequestMethods(prev => ({ ...prev, [type]: method }));
  };

  const testWebhook = async (type: "blogCreation" | "blogSocial") => {
    let url = "";
    let testData = {};
    const method = requestMethods[type];

    if (type === "blogCreation") {
      url = getActiveBlogCreationUrl();
      testData = {
        title: "Test Blog Post",
        slug: "test-blog-post",
        content: "This is a test blog post sent to verify the webhook functionality."
      };
    } else {
      url = getActiveBlogSocialShareUrl();
      testData = {
        title: "Test Social Share",
        url: window.location.origin + "/blog/test-post",
        image: "https://via.placeholder.com/800x400"
      };
    }

    setTestingStatus(prev => ({ ...prev, [type]: "idle" }));
    
    try {
      console.log(`Testing webhook: ${url} with ${method} request`, testData);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      let response;
      
      if (method === "POST") {
        response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testData),
          signal: controller.signal
        });
      } else {
        // For GET requests, append params to the URL
        const params = new URLSearchParams();
        Object.entries(testData).forEach(([key, value]) => {
          params.append(key, String(value));
        });
        const getUrl = `${url}?${params.toString()}`;
        response = await fetch(getUrl, {
          method: "GET",
          signal: controller.signal
        });
      }
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        setTestingStatus(prev => ({ ...prev, [type]: "success" }));
        toast.success("Webhook test completed successfully");
        
        // Try to log the response for debugging
        try {
          const responseText = await response.text();
          console.log("Webhook response:", responseText);
        } catch (err) {
          console.log("Could not parse webhook response");
        }
      } else {
        setTestingStatus(prev => ({ ...prev, [type]: "error" }));
        const errorText = await response.text();
        console.error(`Webhook test failed: ${errorText}`);
        toast.error(`Webhook test failed: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error(`Error testing webhook:`, error);
      setTestingStatus(prev => ({ ...prev, [type]: "error" }));
      
      if (error.name === 'AbortError') {
        toast.error("Webhook request timed out");
      } else {
        toast.error(`Failed to test webhook connection: ${error.message}`);
      }
    }
  };

  const saveChanges = () => {
    toast.success("Webhook settings saved successfully");
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Settings className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Webhook Configuration</h1>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>What are Webhooks?</CardTitle>
          <CardDescription>
            Webhooks allow our system to send automated notifications to external services
            when specific events occur, such as creating a new blog post or changing a post's status.
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="blogSocial">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="blogSocial">Social Media Sharing</TabsTrigger>
          <TabsTrigger value="blogCreation">Blog Creation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="blogSocial">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="h-5 w-5 mr-2" />
                Social Media Sharing Webhook
              </CardTitle>
              <CardDescription>
                This webhook is triggered when a blog post status changes from draft to published.
                It sends the post information to social media automation services.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Switch 
                  id="blogSocialMode"
                  checked={blogSocialShareUrl.mode === "production"}
                  onCheckedChange={(checked) => 
                    handleModeChange("blogSocial", checked ? "production" : "test")
                  }
                />
                <Label htmlFor="blogSocialMode" className="font-medium">
                  {blogSocialShareUrl.mode === "production" ? "Production Mode" : "Test Mode"}
                </Label>
                <span className={`text-xs px-2 py-1 rounded ${
                  blogSocialShareUrl.mode === "production" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {blogSocialShareUrl.mode === "production" ? "Live" : "Testing"}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testBlogSocialUrl">Test URL</Label>
                  <div className="flex mt-1">
                    <Input
                      id="testBlogSocialUrl"
                      value={blogSocialShareUrl.test}
                      onChange={(e) => handleUrlUpdate("blogSocial", "test", e.target.value)}
                      placeholder="https://webhook-test-url"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Use this URL for testing without affecting production systems
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="prodBlogSocialUrl">Production URL</Label>
                  <div className="flex mt-1">
                    <Input
                      id="prodBlogSocialUrl"
                      value={blogSocialShareUrl.production}
                      onChange={(e) => handleUrlUpdate("blogSocial", "production", e.target.value)}
                      placeholder="https://webhook-production-url"
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    The live webhook endpoint that will be called in production
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Request Method</Label>
                <Select 
                  value={requestMethods.blogSocial} 
                  onValueChange={(value) => handleMethodChange("blogSocial", value as "POST" | "GET")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  Select GET if the webhook requires a GET request instead of POST
                </p>
              </div>
              
              <div>
                <Label className="block mb-2">Active Endpoint</Label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm font-mono break-all">
                  {getActiveBlogSocialShareUrl()}
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded border border-blue-100">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Important Note</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      If testing fails with a POST request, try changing to GET. Some webhook providers 
                      only accept specific request methods. When publishing posts, the system will automatically use the method
                      you configure here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center">
                {testingStatus.blogSocial === "success" && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Test successful
                  </div>
                )}
                {testingStatus.blogSocial === "error" && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Test failed
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => testWebhook("blogSocial")}
                >
                  Test Webhook
                </Button>
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="blogCreation">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Webhook className="h-5 w-5 mr-2" />
                Blog Creation Webhook
              </CardTitle>
              <CardDescription>
                This webhook is called when automatically generating blog content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Switch 
                  id="blogCreationMode"
                  checked={blogCreationUrl.mode === "production"}
                  onCheckedChange={(checked) => 
                    handleModeChange("blogCreation", checked ? "production" : "test")
                  }
                />
                <Label htmlFor="blogCreationMode" className="font-medium">
                  {blogCreationUrl.mode === "production" ? "Production Mode" : "Test Mode"}
                </Label>
                <span className={`text-xs px-2 py-1 rounded ${
                  blogCreationUrl.mode === "production" 
                    ? "bg-green-100 text-green-800" 
                    : "bg-amber-100 text-amber-800"
                }`}>
                  {blogCreationUrl.mode === "production" ? "Live" : "Testing"}
                </span>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="testBlogCreationUrl">Test URL</Label>
                  <div className="flex mt-1">
                    <Input
                      id="testBlogCreationUrl"
                      value={blogCreationUrl.test}
                      onChange={(e) => handleUrlUpdate("blogCreation", "test", e.target.value)}
                      placeholder="https://webhook-test-url"
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="prodBlogCreationUrl">Production URL</Label>
                  <div className="flex mt-1">
                    <Input
                      id="prodBlogCreationUrl"
                      value={blogCreationUrl.production}
                      onChange={(e) => handleUrlUpdate("blogCreation", "production", e.target.value)}
                      placeholder="https://webhook-production-url"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label className="block mb-2">Request Method</Label>
                <Select 
                  value={requestMethods.blogCreation} 
                  onValueChange={(value) => handleMethodChange("blogCreation", value as "POST" | "GET")}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="GET">GET</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="block mb-2">Active Endpoint</Label>
                <div className="p-2 bg-gray-50 rounded border border-gray-200 text-sm font-mono break-all">
                  {getActiveBlogCreationUrl()}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="flex items-center">
                {testingStatus.blogCreation === "success" && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Test successful
                  </div>
                )}
                {testingStatus.blogCreation === "error" && (
                  <div className="flex items-center text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    Test failed
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => testWebhook("blogCreation")}
                >
                  Test Webhook
                </Button>
                <Button onClick={saveChanges}>Save Changes</Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebhookManager;

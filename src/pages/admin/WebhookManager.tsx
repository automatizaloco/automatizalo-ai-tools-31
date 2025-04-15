
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { toast } from 'sonner';
import { useWebhookStore, WebhookMode, RequestMethod } from '@/stores/webhookStore';
import { Webhook, Globe, Send, Server } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const WebhookManager = () => {
  const webhookStore = useWebhookStore();
  const [activeTab, setActiveTab] = useState('blog-creation');

  // Initialize local state from the store
  const [blogCreation, setBlogCreation] = useState({
    test: webhookStore.blogCreationUrl.test,
    production: webhookStore.blogCreationUrl.production,
    mode: webhookStore.blogCreationUrl.mode,
    method: webhookStore.blogCreationUrl.method
  });

  const [blogSocialShare, setBlogSocialShare] = useState({
    test: webhookStore.blogSocialShareUrl.test,
    production: webhookStore.blogSocialShareUrl.production,
    mode: webhookStore.blogSocialShareUrl.mode,
    method: webhookStore.blogSocialShareUrl.method
  });

  const [websiteDomain, setWebsiteDomain] = useState(webhookStore.websiteDomain);

  // Effect to sync with store whenever it changes
  useEffect(() => {
    console.log("Webhook store updated, syncing local state");
    console.log("Current store state:", {
      blogCreation: webhookStore.blogCreationUrl,
      blogSocial: webhookStore.blogSocialShareUrl,
      domain: webhookStore.websiteDomain
    });
    
    setBlogCreation({
      test: webhookStore.blogCreationUrl.test,
      production: webhookStore.blogCreationUrl.production,
      mode: webhookStore.blogCreationUrl.mode,
      method: webhookStore.blogCreationUrl.method
    });
    
    setBlogSocialShare({
      test: webhookStore.blogSocialShareUrl.test,
      production: webhookStore.blogSocialShareUrl.production,
      mode: webhookStore.blogSocialShareUrl.mode,
      method: webhookStore.blogSocialShareUrl.method
    });
    
    setWebsiteDomain(webhookStore.websiteDomain);
  }, [
    webhookStore.blogCreationUrl,
    webhookStore.blogSocialShareUrl,
    webhookStore.websiteDomain
  ]);

  const handleBlogCreationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving blog creation webhook with:", blogCreation);
    
    // Save values individually to ensure update
    webhookStore.updateBlogCreationUrl({
      test: blogCreation.test,
      production: blogCreation.production,
      mode: blogCreation.mode,
      method: blogCreation.method
    });
    
    // Verify the update was applied
    const current = useWebhookStore.getState().blogCreationUrl;
    console.log("After save - current state:", current);
    
    toast.success("Blog creation webhook settings saved");
    
    // Force a local storage sync
    localStorage.setItem('webhook-settings-sync', Date.now().toString());
  };

  const handleBlogSocialShareSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving blog social share webhook with:", blogSocialShare);
    
    // Save values individually to ensure update
    webhookStore.updateBlogSocialShareUrl({
      test: blogSocialShare.test,
      production: blogSocialShare.production,
      mode: blogSocialShare.mode,
      method: blogSocialShare.method
    });
    
    // Verify the update was applied
    const current = useWebhookStore.getState().blogSocialShareUrl;
    console.log("After save - current state:", current);
    
    toast.success("Blog social share webhook settings saved");
    
    // Force a local storage sync
    localStorage.setItem('webhook-settings-sync', Date.now().toString());
  };

  const handleDomainSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saving website domain:", websiteDomain);
    webhookStore.updateWebsiteDomain(websiteDomain);
    
    // Verify the update was applied
    const current = useWebhookStore.getState().websiteDomain;
    console.log("After save - current domain:", current);
    
    toast.success("Website domain saved");
    
    // Force a local storage sync
    localStorage.setItem('webhook-settings-sync', Date.now().toString());
  };

  const handleTestWebhook = async (type: 'blog-creation' | 'blog-social') => {
    try {
      const webhookUrl = type === 'blog-creation' 
        ? webhookStore.getActiveBlogCreationUrl() 
        : webhookStore.getActiveBlogSocialShareUrl();
      
      const method = type === 'blog-creation' 
        ? webhookStore.getActiveBlogCreationMethod()
        : webhookStore.getActiveBlogSocialShareMethod();
      
      console.log(`Testing ${type} webhook with URL: ${webhookUrl} and method: ${method}`);

      const testData = type === 'blog-creation' 
        ? {
            title: "Test Blog Post",
            content: "This is a test content for the webhook",
            date: new Date().toISOString()
          }
        : {
            title: "Test Social Share",
            slug: "test-social-share",
            url: `${webhookStore.getWebsiteDomain()}/blog/test-social-share`
          };

      toast.info(`Testing ${type} webhook...`);
      
      if (method === 'GET') {
        const params = new URLSearchParams();
        Object.entries(testData).forEach(([key, value]) => {
          params.append(key, value as string);
        });
        
        const urlWithParams = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}${params.toString()}`;
        console.log("Making GET request to:", urlWithParams);
        
        const response = await fetch(urlWithParams, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          toast.success(`${type} webhook test succeeded!`);
        } else {
          throw new Error(`HTTP error: ${response.status}`);
        }
      } else {
        console.log("Making POST request to:", webhookUrl);
        console.log("With test data:", testData);
        
        const response = await fetch(webhookUrl, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testData),
        });
        
        console.log("Response status:", response.status);
        
        if (response.ok) {
          toast.success(`${type} webhook test succeeded!`);
        } else {
          throw new Error(`HTTP error: ${response.status}`);
        }
      }
    } catch (error) {
      console.error(`Error testing ${type} webhook:`, error);
      toast.error(`Failed to test ${type} webhook: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Webhook Manager</h1>
          <p className="text-gray-600">
            Configure and manage webhooks for your application. Webhooks allow your application to communicate with external services when certain events occur.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="blog-creation" className="flex items-center gap-1">
              <Webhook className="h-4 w-4" />
              <span>Blog Creation</span>
            </TabsTrigger>
            <TabsTrigger value="social-media" className="flex items-center gap-1">
              <Globe className="h-4 w-4" />
              <span>Social Media</span>
            </TabsTrigger>
            <TabsTrigger value="domain-settings" className="flex items-center gap-1">
              <Server className="h-4 w-4" />
              <span>Domain Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="blog-creation">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Webhook className="h-5 w-5" />
                  Blog Creation Webhook
                </CardTitle>
                <CardDescription>
                  This webhook is called when generating new blog posts with AI
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleBlogCreationSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="blog-creation-test">Test URL</Label>
                    <Input 
                      id="blog-creation-test"
                      value={blogCreation.test}
                      onChange={(e) => setBlogCreation({...blogCreation, test: e.target.value})}
                      placeholder="https://test-webhook.example.com/blog-creation"
                    />
                    <p className="text-xs text-gray-500">Used for testing in development</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="blog-creation-production">Production URL</Label>
                    <Input 
                      id="blog-creation-production"
                      value={blogCreation.production}
                      onChange={(e) => setBlogCreation({...blogCreation, production: e.target.value})}
                      placeholder="https://webhook.example.com/blog-creation"
                    />
                    <p className="text-xs text-gray-500">Used in production environment</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Request Method</Label>
                    <RadioGroup 
                      value={blogCreation.method}
                      onValueChange={(value) => setBlogCreation({...blogCreation, method: value as RequestMethod})}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="POST" id="blog-creation-post" />
                        <Label htmlFor="blog-creation-post">POST</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="GET" id="blog-creation-get" />
                        <Label htmlFor="blog-creation-get">GET</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="blog-creation-mode">Production Mode</Label>
                      <Switch 
                        id="blog-creation-mode" 
                        checked={blogCreation.mode === 'production'}
                        onCheckedChange={(checked) => 
                          setBlogCreation({...blogCreation, mode: checked ? 'production' : 'test'})
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      When enabled, the production URL will be used. Otherwise, the test URL will be used.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => handleTestWebhook('blog-creation')}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                  <Button type="submit">Save Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="social-media">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Social Media Webhook
                </CardTitle>
                <CardDescription>
                  This webhook is triggered when a blog post is published to share on social media
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleBlogSocialShareSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="social-test">Test URL</Label>
                    <Input 
                      id="social-test"
                      value={blogSocialShare.test}
                      onChange={(e) => setBlogSocialShare({...blogSocialShare, test: e.target.value})}
                      placeholder="https://test-webhook.example.com/social-share"
                    />
                    <p className="text-xs text-gray-500">Used for testing in development</p>
                  </div>
                  
                  <div className="space-y-1">
                    <Label htmlFor="social-production">Production URL</Label>
                    <Input 
                      id="social-production"
                      value={blogSocialShare.production}
                      onChange={(e) => setBlogSocialShare({...blogSocialShare, production: e.target.value})}
                      placeholder="https://webhook.example.com/social-share"
                    />
                    <p className="text-xs text-gray-500">Used in production environment</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Request Method</Label>
                    <RadioGroup 
                      value={blogSocialShare.method}
                      onValueChange={(value) => setBlogSocialShare({...blogSocialShare, method: value as RequestMethod})}
                      className="flex space-x-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="POST" id="social-post" />
                        <Label htmlFor="social-post">POST</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="GET" id="social-get" />
                        <Label htmlFor="social-get">GET</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="social-mode">Production Mode</Label>
                      <Switch 
                        id="social-mode" 
                        checked={blogSocialShare.mode === 'production'}
                        onCheckedChange={(checked) => 
                          setBlogSocialShare({...blogSocialShare, mode: checked ? 'production' : 'test'})
                        }
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      When enabled, the production URL will be used. Otherwise, the test URL will be used.
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => handleTestWebhook('blog-social')}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Test Webhook
                  </Button>
                  <Button type="submit">Save Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="domain-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="h-5 w-5" />
                  Website Domain Settings
                </CardTitle>
                <CardDescription>
                  Configure the domain used for generating links in webhooks
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleDomainSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="website-domain">Website Domain</Label>
                    <Input 
                      id="website-domain"
                      value={websiteDomain}
                      onChange={(e) => setWebsiteDomain(e.target.value)}
                      placeholder="https://www.example.com"
                    />
                    <p className="text-xs text-gray-500">
                      This domain will be used to generate full URLs for blog posts and other resources
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="ml-auto">Save Domain</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default WebhookManager;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';
import { useWebhookStore, WebhookMode, RequestMethod } from '@/stores/webhookStore';
import { Webhook, Globe, Send, Server } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WebhookConfigCard from '@/components/admin/webhooks/WebhookConfigCard';

const WebhookManager = () => {
  const [activeTab, setActiveTab] = useState('blog-creation');
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    blogCreationUrl, 
    blogSocialShareUrl, 
    websiteDomain,
    updateBlogCreationUrl,
    updateBlogSocialShareUrl,
    updateWebsiteDomain,
    initializeFromSupabase,
    isInitialized
  } = useWebhookStore();

  useEffect(() => {
    const loadWebhookConfigs = async () => {
      setIsLoading(true);
      try {
        await initializeFromSupabase();
      } catch (error) {
        console.error('Failed to load webhook configs:', error);
        toast.error('Failed to load webhook settings');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadWebhookConfigs();
  }, [initializeFromSupabase]);

  const [localBlogCreation, setLocalBlogCreation] = useState({
    test: '',
    production: '',
    mode: 'production' as WebhookMode,
    method: 'POST' as RequestMethod
  });

  const [localBlogSocialShare, setLocalBlogSocialShare] = useState({
    test: '',
    production: '',
    mode: 'test' as WebhookMode,
    method: 'GET' as RequestMethod
  });

  const [localWebsiteDomain, setLocalWebsiteDomain] = useState('');

  useEffect(() => {
    if (isInitialized) {
      console.log("Syncing local state with store");
      setLocalBlogCreation({
        test: blogCreationUrl.test,
        production: blogCreationUrl.production,
        mode: blogCreationUrl.mode,
        method: blogCreationUrl.method
      });
      
      setLocalBlogSocialShare({
        test: blogSocialShareUrl.test,
        production: blogSocialShareUrl.production,
        mode: blogSocialShareUrl.mode,
        method: blogSocialShareUrl.method
      });
      
      setLocalWebsiteDomain(websiteDomain);
    }
  }, [blogCreationUrl, blogSocialShareUrl, websiteDomain, isInitialized]);

  const handleBlogCreationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlogCreationUrl(localBlogCreation);
      toast.success("Blog creation webhook settings saved successfully");
    } catch (error) {
      console.error('Error saving blog creation settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleBlogSocialShareSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateBlogSocialShareUrl(localBlogSocialShare);
      toast.success("Blog social share webhook settings saved successfully");
    } catch (error) {
      console.error('Error saving blog social share settings:', error);
      toast.error('Failed to save settings');
    }
  };

  const handleDomainSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateWebsiteDomain(localWebsiteDomain);
      toast.success("Website domain saved successfully");
    } catch (error) {
      console.error('Error saving domain settings:', error);
      toast.error('Failed to save domain');
    }
  };

  const handleTestWebhook = async (type: 'blog-creation' | 'blog-social') => {
    try {
      const webhookStore = useWebhookStore.getState();
      
      const webhookUrl = type === 'blog-creation' 
        ? webhookStore.getActiveBlogCreationUrl() 
        : webhookStore.getActiveBlogSocialShareUrl();
      
      if (!webhookUrl || webhookUrl.trim() === '') {
        toast.error('No webhook URL configured');
        return;
      }
      
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Webhook Manager</h1>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  return (
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
          <WebhookConfigCard
            title="Blog Creation Webhook"
            description="This webhook is called when generating new blog posts with AI"
            icon={<Webhook className="h-5 w-5" />}
            testUrl={localBlogCreation.test}
            productionUrl={localBlogCreation.production}
            method={localBlogCreation.method}
            mode={localBlogCreation.mode}
            onTestUrlChange={(value) => setLocalBlogCreation({...localBlogCreation, test: value})}
            onProductionUrlChange={(value) => setLocalBlogCreation({...localBlogCreation, production: value})}
            onMethodChange={(value) => setLocalBlogCreation({...localBlogCreation, method: value})}
            onModeChange={(isProduction) => setLocalBlogCreation({...localBlogCreation, mode: isProduction ? 'production' : 'test'})}
            onTest={() => handleTestWebhook('blog-creation')}
            onSave={handleBlogCreationSubmit}
          />
        </TabsContent>

        <TabsContent value="social-media">
          <WebhookConfigCard
            title="Social Media Webhook"
            description="This webhook is triggered when a blog post is published to share on social media"
            icon={<Globe className="h-5 w-5" />}
            testUrl={localBlogSocialShare.test}
            productionUrl={localBlogSocialShare.production}
            method={localBlogSocialShare.method}
            mode={localBlogSocialShare.mode}
            onTestUrlChange={(value) => setLocalBlogSocialShare({...localBlogSocialShare, test: value})}
            onProductionUrlChange={(value) => setLocalBlogSocialShare({...localBlogSocialShare, production: value})}
            onMethodChange={(value) => setLocalBlogSocialShare({...localBlogSocialShare, method: value})}
            onModeChange={(isProduction) => setLocalBlogSocialShare({...localBlogSocialShare, mode: isProduction ? 'production' : 'test'})}
            onTest={() => handleTestWebhook('blog-social')}
            onSave={handleBlogSocialShareSubmit}
          />
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
                    value={localWebsiteDomain}
                    onChange={(e) => setLocalWebsiteDomain(e.target.value)}
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
  );
};

export default WebhookManager;

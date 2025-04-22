
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NewsletterManager from "@/components/admin/newsletter/NewsletterManager";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Subscriber {
  id: string;
  email: string;
  frequency: string;
  created_at: string;
}

const NewsletterAdmin = () => {
  const navigate = useNavigate();
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState({
    automation: false,
    subscribers: false
  });

  const checkAutomationStatus = async () => {
    setLoading(prev => ({ ...prev, automation: true }));
    try {
      const { data, error } = await supabase.functions.invoke('check-newsletter-automation', {
        body: {}
      });
      
      if (!error && data) {
        setIsAutomationEnabled(data.enabled);
      }
    } catch (error) {
      console.error("Failed to check automation status:", error);
    } finally {
      setLoading(prev => ({ ...prev, automation: false }));
    }
  };

  const fetchSubscribers = async () => {
    setLoading(prev => ({ ...prev, subscribers: true }));
    try {
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Type safety: ensure we only set valid subscriber objects
      if (data && Array.isArray(data)) {
        const validSubscribers: Subscriber[] = data
          .filter(item => 
            item && 
            typeof item === 'object' && 
            'id' in item && 
            'email' in item && 
            'frequency' in item &&
            'created_at' in item
          )
          .map(item => ({
            id: item.id as string,
            email: item.email as string,
            frequency: item.frequency as string,
            created_at: item.created_at as string
          }));
            
        setSubscribers(validSubscribers);
      }
    } catch (error) {
      console.error("Failed to fetch subscribers:", error);
    } finally {
      setLoading(prev => ({ ...prev, subscribers: false }));
    }
  };

  // Check automation status on component mount
  useEffect(() => {
    checkAutomationStatus();
    fetchSubscribers();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Administration</h1>
        <Button onClick={() => navigate("/admin")}>Back to Admin Dashboard</Button>
      </div>
      
      <Tabs defaultValue="manager" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="manager">Newsletter Manager</TabsTrigger>
          <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="manager" className="bg-white shadow-md rounded-lg p-6">
          <NewsletterManager 
            isAutomationEnabled={isAutomationEnabled} 
            onAutomationToggle={setIsAutomationEnabled} 
          />
        </TabsContent>
        
        <TabsContent value="subscribers">
          <Card>
            <CardHeader>
              <CardTitle>Newsletter Subscribers</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.subscribers ? (
                <div className="space-y-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : subscribers.length === 0 ? (
                <p className="text-center py-6 text-gray-500">No subscribers yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Frequency</TableHead>
                        <TableHead>Subscribed On</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.map((subscriber) => (
                        <TableRow key={subscriber.id}>
                          <TableCell>{subscriber.email}</TableCell>
                          <TableCell className="capitalize">{subscriber.frequency}</TableCell>
                          <TableCell>{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NewsletterAdmin;

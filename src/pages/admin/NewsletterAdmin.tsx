
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import NewsletterManager from "@/components/admin/newsletter/NewsletterManager";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const NewsletterAdmin = () => {
  const navigate = useNavigate();
  const [isAutomationEnabled, setIsAutomationEnabled] = useState(false);

  const checkAutomationStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-newsletter-automation', {
        body: {}
      });
      
      if (!error && data) {
        setIsAutomationEnabled(data.enabled);
      }
    } catch (error) {
      console.error("Failed to check automation status:", error);
    }
  };

  // Check automation status on component mount
  React.useEffect(() => {
    checkAutomationStatus();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Administration</h1>
        <Button onClick={() => navigate("/admin")}>Back to Admin Dashboard</Button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <NewsletterManager isAutomationEnabled={isAutomationEnabled} onAutomationToggle={setIsAutomationEnabled} />
      </div>
    </div>
  );
};

export default NewsletterAdmin;

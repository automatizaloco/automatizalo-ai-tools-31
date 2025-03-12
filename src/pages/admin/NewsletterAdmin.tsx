
import React from "react";
import { useNavigate } from "react-router-dom";
import NewsletterManager from "@/components/admin/newsletter/NewsletterManager";
import { Button } from "@/components/ui/button";

const NewsletterAdmin = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Administration</h1>
        <Button onClick={() => navigate("/admin")}>Back to Admin Dashboard</Button>
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <NewsletterManager />
      </div>
    </div>
  );
};

export default NewsletterAdmin;


import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

// This component is now just a redirect since we're removing the dashboard
const ContentManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin');
    } else {
      // Redirect to blog section
      navigate('/admin/blog');
    }
  }, [user, navigate]);

  // Return empty div while redirecting
  return <div></div>;
};

export default ContentManager;

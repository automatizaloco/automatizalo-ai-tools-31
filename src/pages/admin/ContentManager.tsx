
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import AdminBaseLayout from "./layout/AdminBaseLayout";
import MobileOptionsList from "@/components/admin/dashboard/MobileOptionsList";
import DesktopOptionsList from "@/components/admin/dashboard/DesktopOptionsList";
import { useAdminOptions } from "@/components/admin/dashboard/useAdminOptions";

const ContentManager = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { adminOptions, groupedOptions, sortedCategories } = useAdminOptions();

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/admin');
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <AdminBaseLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
        </div>
      </AdminBaseLayout>
    );
  }

  return (
    <AdminBaseLayout hideTitle={false}>
      <div className="container mx-auto px-0 md:px-4">
        <div className="mb-4 md:mb-4">
          {user && (
            <div className="text-sm text-gray-600">
              Logged in as: {user.email}
            </div>
          )}
        </div>
        
        {isMobile ? (
          <MobileOptionsList 
            groupedOptions={groupedOptions} 
            sortedCategories={sortedCategories} 
          />
        ) : (
          <DesktopOptionsList adminOptions={adminOptions} />
        )}
      </div>
    </AdminBaseLayout>
  );
};

export default ContentManager;

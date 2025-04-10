
import React from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import NotificationHistory from "@/components/admin/NotificationHistory";
import { PersistentToastProvider } from "@/context/PersistentToastContext";

interface NotificationAdminProps {
  children?: React.ReactNode;
}

const NotificationAdmin = ({ children }: NotificationAdminProps) => {
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        <PersistentToastProvider>
          <NotificationHistory />
          {children}
        </PersistentToastProvider>
      </div>
    </AdminLayout>
  );
};

export default NotificationAdmin;

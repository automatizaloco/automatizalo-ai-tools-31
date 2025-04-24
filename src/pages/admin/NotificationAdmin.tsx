
import React from "react";
import NotificationHistory from "@/components/admin/NotificationHistory";
import { useNotification } from "@/hooks/useNotification";

const NotificationAdmin = () => {
  const notification = useNotification();

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Notification History</h1>
      <NotificationHistory />
    </div>
  );
};

export default NotificationAdmin;

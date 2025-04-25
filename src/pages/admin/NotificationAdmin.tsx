
import React, { useState } from "react";
import NotificationHistory from "@/components/admin/NotificationHistory";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from "lucide-react";
import { usePersistentToast } from "@/context/PersistentToastContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const NotificationAdmin = () => {
  const notification = useNotification();
  const { toasts, clearToasts } = usePersistentToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Example notification for testing
  const handleTestNotification = () => {
    notification.showInfo(
      "Test Notification", 
      "This is a test notification to verify the system is working correctly."
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notification History</h1>
        <div className="flex gap-2">
          <Button 
            onClick={handleTestNotification}
            variant="outline"
            className="flex items-center gap-1"
          >
            <Bell className="h-4 w-4" />
            Test Notification
          </Button>
          
          <Button 
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="flex items-center gap-1 text-red-500 hover:text-red-600"
            disabled={toasts.length === 0}
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-gray-600">
          Total notifications: {toasts.length}
        </p>
      </div>
      
      <NotificationHistory />
      
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear All Notifications</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete all notification history. 
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                clearToasts();
                notification.showSuccess("Notifications Cleared", "All notification history has been cleared.");
              }}
              className="bg-red-500 hover:bg-red-600"
            >
              Clear All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotificationAdmin;

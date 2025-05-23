
import React, { useState } from "react";
import NotificationHistory from "@/components/admin/NotificationHistory";
import { useNotification } from "@/hooks/useNotification";
import { Button } from "@/components/ui/button";
import { Bell, Trash2 } from "lucide-react";
import { usePersistentToast } from "@/context/PersistentToastContext";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAdminVerification } from "@/hooks/useAdminVerification";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const NotificationAdmin = () => {
  const notification = useNotification();
  const { toasts, clearToasts } = usePersistentToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { isAdmin, isVerifying } = useAdminVerification();
  const isMobile = useIsMobile();
  
  // Example notification for testing
  const handleTestNotification = () => {
    notification.showInfo(
      "Test Notification", 
      "This is a test notification to verify the system is working correctly."
    );
  };

  if (isVerifying) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center h-64">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Verifying admin permissions...</p>
          <p className="mt-1 text-sm text-gray-500">This might take a few seconds</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="border rounded-lg p-8 text-center">
          <p className="text-red-500 mb-2 font-semibold">Access denied</p>
          <p className="text-gray-600">You don't have permission to access this section.</p>
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-4 mt-16">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-xl">Notifications</CardTitle>
            
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-600 text-sm">
                  Total: {toasts.length}
                </p>
              </div>
              
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={handleTestNotification}
                  variant="outline"
                  size="sm"
                  className="w-full flex justify-center items-center gap-1"
                >
                  <Bell className="h-4 w-4" />
                  Test Notification
                </Button>
                
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  variant="outline"
                  size="sm"
                  className="w-full flex justify-center items-center gap-1 text-red-500 hover:text-red-600"
                  disabled={toasts.length === 0}
                >
                  <Trash2 className="h-4 w-4" />
                  Clear All
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="px-0 py-4">
            <NotificationHistory />
          </CardContent>
        </Card>
        
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent className="max-w-[90%]">
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
  }
  
  // Desktop view
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

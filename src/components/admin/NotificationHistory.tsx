
import React, { useState, useEffect } from "react";
import { usePersistentToast } from "@/context/PersistentToastContext";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, Trash2, BellRing, RefreshCw } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const NotificationHistory = () => {
  const { toasts, clearToasts } = usePersistentToast();
  const [activeTab, setActiveTab] = useState<string>("all");
  const [refreshKey, setRefreshKey] = useState(0); // Used to force a refresh

  // Force a re-render on component mount to ensure notifications are loaded
  useEffect(() => {
    console.log("NotificationHistory mounted, loaded notifications:", toasts.length);
  }, [toasts]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
    toast.info("Refreshing notification list");
  };

  const filteredToasts = toasts.filter(toast => {
    if (activeTab === "all") return true;
    return toast.type === activeTab;
  });

  const groupedByDate = filteredToasts.reduce((groups: Record<string, typeof toasts>, toast) => {
    const date = new Date(toast.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(toast);
    return groups;
  }, {});

  const getIconForType = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6" key={refreshKey}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5" />
          <h2 className="text-xl font-semibold">Notification History</h2>
          <span className="text-sm text-gray-500 ml-2">
            ({filteredToasts.length} notifications)
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={handleRefresh}
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1"
            onClick={clearToasts}
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="success">Success</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          {Object.keys(groupedByDate).length > 0 ? (
            Object.entries(groupedByDate)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, toastsForDate]) => (
                <div key={date} className="mb-6">
                  <h3 className="text-sm font-medium mb-3 text-gray-500">{date}</h3>
                  <div className="space-y-3">
                    {toastsForDate
                      .sort((a, b) => b.timestamp - a.timestamp)
                      .map((toast) => (
                        <Alert 
                          key={toast.id} 
                          className={`border-l-4 ${
                            toast.type === "success" ? "border-l-green-500" : 
                            toast.type === "error" ? "border-l-red-500" : 
                            toast.type === "warning" ? "border-l-yellow-500" : 
                            "border-l-blue-500"
                          }`}
                        >
                          <div className="flex gap-2">
                            {getIconForType(toast.type)}
                            <div className="flex-1">
                              <AlertTitle>{toast.title}</AlertTitle>
                              <AlertDescription>{toast.message}</AlertDescription>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(toast.timestamp).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </Alert>
                      ))}
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BellRing className="h-12 w-12 mx-auto opacity-20 mb-3" />
              <p>No notifications to display</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NotificationHistory;

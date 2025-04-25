
import React from 'react';
import { usePersistentToast } from '@/context/PersistentToastContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { NotificationType } from '@/types/notification';

const getNotificationIcon = (type: NotificationType['type']) => {
  switch (type) {
    case 'success':
      return <span className="text-green-500 text-lg">✓</span>;
    case 'error':
      return <span className="text-red-500 text-lg">✕</span>;
    case 'warning':
      return <span className="text-amber-500 text-lg">⚠</span>;
    case 'info':
    default:
      return <span className="text-blue-500 text-lg">ℹ</span>;
  }
};

const getNotificationColor = (type: NotificationType['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-100';
    case 'error':
      return 'bg-red-50 border-red-100';
    case 'warning':
      return 'bg-amber-50 border-amber-100';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-100';
  }
};

const NotificationHistory = () => {
  const { toasts, removeToast } = usePersistentToast();

  if (toasts.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 pb-6 text-center">
          <p className="text-gray-500">No notifications found</p>
          <p className="text-sm text-gray-400 mt-1">
            Notifications will appear here when they are triggered
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {toasts.map((toast) => (
        <Card 
          key={toast.id} 
          className={`relative overflow-hidden border ${getNotificationColor(toast.type)}`}
        >
          <CardHeader className="pb-2 pt-4 px-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                {getNotificationIcon(toast.type)}
                <span className="font-medium">{toast.title}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">
                  {format(new Date(toast.timestamp), 'MMM d, yyyy h:mm a')}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-6 w-6 p-0" 
                  onClick={() => removeToast(toast.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0 pb-4 px-4">
            <p className="text-sm text-gray-600">{toast.message}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default NotificationHistory;

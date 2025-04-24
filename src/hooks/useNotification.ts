
import { toast } from 'sonner';
import { usePersistentToast } from '@/context/PersistentToastContext';

export function useNotification() {
  const { addToast } = usePersistentToast();

  const showNotification = (
    title: string,
    message: string, 
    type: 'success' | 'error' | 'info' | 'warning' = 'info',
    duration = 5000
  ) => {
    // Show immediate toast notification
    toast[type](title, {
      description: message,
      duration: duration,
    });
    
    // Also add to persistent storage for history
    addToast({
      title,
      message,
      type,
    });
    
    console.log(`Notification created: ${type} - ${title}`);
    return true;
  };

  return {
    showNotification,
    showSuccess: (title: string, message: string) => showNotification(title, message, 'success'),
    showError: (title: string, message: string) => showNotification(title, message, 'error'),
    showInfo: (title: string, message: string) => showNotification(title, message, 'info'),
    showWarning: (title: string, message: string) => showNotification(title, message, 'warning'),
  };
}

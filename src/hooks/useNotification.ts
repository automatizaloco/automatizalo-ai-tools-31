
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
    // Show immediate toast notification with improved duration and dismissal
    toast[type](title, {
      description: message,
      duration: duration,
      dismissible: true,
      position: 'top-right',
      closeButton: true,
      style: { 
        fontSize: '0.925rem',
        maxWidth: '350px'
      },
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

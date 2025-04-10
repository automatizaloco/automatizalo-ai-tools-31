
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface PersistentToast {
  id: string;
  title: string;
  message: string;
  type: "success" | "error" | "warning" | "info";
  timestamp: number;
}

interface PersistentToastContextType {
  toasts: PersistentToast[];
  addToast: (toast: Omit<PersistentToast, "id" | "timestamp">) => void;
  clearToasts: () => void;
  removeToast: (id: string) => void;
}

const PersistentToastContext = createContext<PersistentToastContextType>({
  toasts: [],
  addToast: () => {},
  clearToasts: () => {},
  removeToast: () => {},
});

interface PersistentToastProviderProps {
  children: ReactNode;
  storageKey?: string;
}

export const PersistentToastProvider: React.FC<PersistentToastProviderProps> = ({
  children,
  storageKey = "persistent-toasts",
}) => {
  const [toasts, setToasts] = useState<PersistentToast[]>([]);
  
  // Initialize toasts from localStorage
  useEffect(() => {
    try {
      const storedToasts = localStorage.getItem(storageKey);
      if (storedToasts) {
        const parsedToasts = JSON.parse(storedToasts);
        if (Array.isArray(parsedToasts)) {
          setToasts(parsedToasts);
          console.log("Loaded persistent toasts from storage:", parsedToasts.length);
        }
      }
    } catch (error) {
      console.error("Error loading toasts from localStorage:", error);
    }
    
    // Listen to custom events from external sources
    const handleExternalToast = (event: CustomEvent<PersistentToast>) => {
      console.log("Received external toast event:", event.detail);
      if (event.detail) {
        setToasts((currentToasts) => {
          const newToasts = [event.detail, ...currentToasts];
          try {
            localStorage.setItem(storageKey, JSON.stringify(newToasts));
            console.log("Saved external toast to localStorage, new count:", newToasts.length);
          } catch (error) {
            console.error("Error saving toasts to localStorage:", error);
          }
          return newToasts;
        });
      }
    };
    
    window.addEventListener('persistentToastAdded', handleExternalToast as EventListener);
    
    return () => {
      window.removeEventListener('persistentToastAdded', handleExternalToast as EventListener);
    };
  }, [storageKey]);
  
  // Add a new toast
  const addToast = (toastData: Omit<PersistentToast, "id" | "timestamp">) => {
    const newToast: PersistentToast = {
      ...toastData,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      timestamp: Date.now(),
    };
    
    console.log("Adding persistent toast:", newToast);
    
    // Also show the toast via Sonner
    toast[toastData.type](toastData.title, { description: toastData.message });
    
    // Update state and save to localStorage
    setToasts((currentToasts) => {
      const newToasts = [newToast, ...currentToasts];
      
      // Store in localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify(newToasts));
        console.log("Saved toasts to localStorage, new count:", newToasts.length);
      } catch (error) {
        console.error("Error saving toasts to localStorage:", error);
      }
      
      return newToasts;
    });
    
    // Also dispatch custom event for other parts of the app
    const event = new CustomEvent('persistentToastAdded', { 
      detail: newToast 
    });
    
    window.dispatchEvent(event);
  };
  
  // Clear all toasts
  const clearToasts = () => {
    setToasts([]);
    try {
      localStorage.removeItem(storageKey);
      console.log("Cleared all persistent toasts");
    } catch (error) {
      console.error("Error clearing toasts from localStorage:", error);
    }
  };
  
  // Remove a specific toast
  const removeToast = (id: string) => {
    setToasts((currentToasts) => {
      const newToasts = currentToasts.filter((toast) => toast.id !== id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(newToasts));
      } catch (error) {
        console.error("Error saving toasts to localStorage:", error);
      }
      return newToasts;
    });
  };
  
  return (
    <PersistentToastContext.Provider value={{ toasts, addToast, clearToasts, removeToast }}>
      {children}
    </PersistentToastContext.Provider>
  );
};

export const usePersistentToast = () => useContext(PersistentToastContext);

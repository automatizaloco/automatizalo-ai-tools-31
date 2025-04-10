import React, { createContext, useContext, useEffect, useState } from "react";
import PersistentToast, { Toast, ToastType } from "@/components/ui/persistent-toast";
import { v4 as uuidv4 } from "uuid";

interface ToastContextType {
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const usePersistentToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("usePersistentToast must be used within a PersistentToastProvider");
  }
  return context;
};

interface PersistentToastProviderProps {
  children: React.ReactNode;
}

export const PersistentToastProvider = ({ children }: PersistentToastProviderProps) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  
  // Load toasts from localStorage on mount
  useEffect(() => {
    try {
      const savedToasts = localStorage.getItem("persistent-toasts");
      if (savedToasts) {
        const parsedToasts = JSON.parse(savedToasts);
        // Only keep toasts from the last 24 hours
        const recentToasts = parsedToasts.filter((toast: Toast) => {
          return Date.now() - toast.timestamp < 24 * 60 * 60 * 1000;
        });
        setToasts(recentToasts);
      }
    } catch (error) {
      console.error("Error loading toasts from localStorage:", error);
    }
  }, []);
  
  // Save toasts to localStorage when they change
  useEffect(() => {
    try {
      localStorage.setItem("persistent-toasts", JSON.stringify(toasts));
    } catch (error) {
      console.error("Error saving toasts to localStorage:", error);
    }
  }, [toasts]);

  const addToast = (type: ToastType, title: string, message: string, duration?: number) => {
    const id = uuidv4();
    const newToast: Toast = {
      id,
      type,
      title,
      message,
      duration,
      timestamp: Date.now(),
    };
    
    setToasts((prev) => [newToast, ...prev]);
    
    console.log(`Toast added: ${type} - ${title}`);
    
    if (duration && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
    localStorage.removeItem("persistent-toasts");
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <div className="fixed right-4 bottom-4 z-50 flex flex-col space-y-4 max-w-md max-h-[80vh] overflow-y-auto">
        {toasts.map((toast) => (
          <PersistentToast
            key={toast.id}
            toast={toast}
            onRemove={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

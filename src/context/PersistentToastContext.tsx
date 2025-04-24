
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { NotificationType } from '@/types/notification';

export type PersistentToast = NotificationType;

interface PersistentToastContextType {
  toasts: PersistentToast[];
  addToast: (toast: Omit<PersistentToast, 'id' | 'timestamp'>) => void;
  clearToasts: () => void;
  removeToast: (id: string) => void;
}

const STORAGE_KEY = 'persistent_toasts';
const MAX_TOASTS = 100; // Maximum number of toasts to store

const PersistentToastContext = createContext<PersistentToastContextType | undefined>(undefined);

export const PersistentToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<PersistentToast[]>([]);

  // Load toasts from localStorage on component mount
  useEffect(() => {
    try {
      const savedToasts = localStorage.getItem(STORAGE_KEY);
      if (savedToasts) {
        const parsedToasts = JSON.parse(savedToasts) as PersistentToast[];
        setToasts(parsedToasts);
        console.log('Loaded', parsedToasts.length, 'persistent toasts from storage');
      } else {
        console.log('No persistent toasts found in storage');
      }
    } catch (error) {
      console.error('Error loading persistent toasts:', error);
    }
  }, []);

  // Save toasts to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toasts));
      console.info('Saved', toasts.length, 'persistent toasts to storage');
    } catch (error) {
      console.error('Error saving persistent toasts:', error);
    }
  }, [toasts]);

  const addToast = (toast: Omit<PersistentToast, 'id' | 'timestamp'>) => {
    const newToast: PersistentToast = {
      ...toast,
      id: uuidv4(),
      timestamp: Date.now(),
    };
    
    // Add new toast at the beginning and keep only the latest MAX_TOASTS
    setToasts(prevToasts => [newToast, ...prevToasts].slice(0, MAX_TOASTS));
    console.info('Added new persistent toast:', newToast);
  };

  const removeToast = (id: string) => {
    setToasts(prevToasts => prevToasts.filter(toast => toast.id !== id));
    console.info('Removed persistent toast:', id);
  };

  const clearToasts = () => {
    setToasts([]);
    console.info('Cleared all persistent toasts');
  };

  return (
    <PersistentToastContext.Provider value={{ toasts, addToast, clearToasts, removeToast }}>
      {children}
    </PersistentToastContext.Provider>
  );
};

export const usePersistentToast = () => {
  const context = useContext(PersistentToastContext);
  if (context === undefined) {
    throw new Error('usePersistentToast must be used within a PersistentToastProvider');
  }
  return context;
};

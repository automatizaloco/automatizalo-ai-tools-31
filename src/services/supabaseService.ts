
// Re-export services from their respective files
export * from './testimonialService';
export * from './contactService';

// Add utility functions for general Supabase operations
import { supabase, retryOperation, handleSupabaseError } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Check if Supabase connection is working
 */
export const checkSupabaseConnection = async (): Promise<boolean> => {
  try {
    console.log("Checking Supabase connection...");
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase connection check failed:", error);
      return false;
    }
    
    console.log("Supabase connection check successful");
    return true;
  } catch (error) {
    console.error("Error checking Supabase connection:", error);
    return false;
  }
};

/**
 * Setup offline caching for a table
 */
export const setupOfflineCache = <T>(
  tableName: string,
  fetchFunction: () => Promise<T[]>,
  cacheKey = tableName
): void => {
  // Initial fetch and cache
  fetchFunction()
    .then(data => {
      try {
        localStorage.setItem(`cached_${cacheKey}`, JSON.stringify(data));
        console.log(`Cached ${data.length} items from ${tableName}`);
      } catch (error) {
        console.error(`Error caching ${tableName}:`, error);
      }
    })
    .catch(error => {
      console.error(`Error fetching ${tableName} for cache:`, error);
    });
    
  // Set up event listeners for online/offline status
  window.addEventListener('online', async () => {
    console.log(`Network back online, refreshing ${tableName} data`);
    try {
      const data = await fetchFunction();
      try {
        localStorage.setItem(`cached_${cacheKey}`, JSON.stringify(data));
      } catch (storageError) {
        console.error(`Error updating cache for ${tableName}:`, storageError);
      }
    } catch (error) {
      console.error(`Error refreshing ${tableName} after coming online:`, error);
    }
  });
};

/**
 * Get cached data for a table
 */
export const getCachedData = <T>(cacheKey: string, defaultValue: T[] = []): T[] => {
  try {
    const cachedData = localStorage.getItem(`cached_${cacheKey}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error(`Error reading cached data for ${cacheKey}:`, error);
  }
  return defaultValue;
};

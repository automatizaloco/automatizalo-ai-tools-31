
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
        toast.success(`${tableName} data refreshed successfully`);
      } catch (storageError) {
        console.error(`Error updating cache for ${tableName}:`, storageError);
      }
    } catch (error) {
      console.error(`Error refreshing ${tableName} after coming online:`, error);
    }
  });
  
  // Also listen for our custom networkReconnected event
  window.addEventListener('networkReconnected', async () => {
    console.log(`Network reconnected event, refreshing ${tableName} data`);
    try {
      const data = await fetchFunction();
      try {
        localStorage.setItem(`cached_${cacheKey}`, JSON.stringify(data));
      } catch (storageError) {
        console.error(`Error updating cache for ${tableName}:`, storageError);
      }
    } catch (error) {
      console.error(`Error refreshing ${tableName} after reconnection event:`, error);
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

/**
 * Clear all cached data
 */
export const clearAllCaches = (): void => {
  const cacheKeys = Object.keys(localStorage).filter(key => key.startsWith('cached_'));
  cacheKeys.forEach(key => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error clearing cache for ${key}:`, error);
    }
  });
  console.log(`Cleared ${cacheKeys.length} cache entries`);
  toast.success("All cached data cleared");
};

/**
 * Attempt to sync all offline changes
 */
export const syncOfflineChanges = async (): Promise<boolean> => {
  // This is a placeholder for a more sophisticated offline sync mechanism
  // In a real app, you would implement a queue system for offline changes
  
  // Dispatch reconnection event to trigger refreshes
  window.dispatchEvent(new CustomEvent('networkReconnected'));
  
  return true;
};

/**
 * Check if the database schema has the necessary tables with improved error handling
 */
export const checkDatabaseSchema = async (): Promise<boolean> => {
  try {
    console.log("Checking database schema...");
    
    // Check for critical tables using the new secure get_table_count function
    const criticalTables = [
      'automations', 
      'client_automations', 
      'client_integration_settings',
      'users'
    ];
    
    let hasAllTables = true;
    
    for (const tableName of criticalTables) {
      try {
        const { data, error } = await supabase.rpc('get_table_count', { 
          table_name: tableName 
        });
        
        if (error) {
          console.error(`Error checking table ${tableName}:`, error);
          // If we can't check, assume it doesn't exist for safety
          hasAllTables = false;
          continue;
        }
        
        const count = Array.isArray(data) ? data[0]?.count : data?.count;
        const exists = count !== undefined && count >= 0;
        
        console.log(`Table ${tableName} exists: ${exists} (count: ${count})`);
        
        if (!exists) {
          hasAllTables = false;
        }
      } catch (tableError) {
        console.error(`Error checking table ${tableName}:`, tableError);
        hasAllTables = false;
      }
    }
    
    return hasAllTables;
  } catch (error) {
    console.error("Error checking database schema:", error);
    return false;
  }
};

/**
 * Safely execute admin-only operations with proper error handling
 */
export const executeAdminOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string = "admin operation"
): Promise<T | null> => {
  try {
    console.log(`Executing ${operationName}...`);
    const result = await operation();
    console.log(`${operationName} completed successfully`);
    return result;
  } catch (error: any) {
    console.error(`Error in ${operationName}:`, error);
    
    // Handle specific admin access errors
    if (error?.message?.includes('Access denied') || error?.message?.includes('Admin privileges required')) {
      toast.error("Admin access required", "This operation requires administrator privileges.");
      return null;
    }
    
    // Handle other errors with generic message
    toast.error(`${operationName} failed`, handleSupabaseError(error, `Failed to execute ${operationName}`));
    return null;
  }
};

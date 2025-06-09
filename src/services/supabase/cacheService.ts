
import { toast } from "sonner";

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

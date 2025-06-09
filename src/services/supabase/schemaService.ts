
import { supabase } from "@/integrations/supabase/client";

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
        
        // Fix: Handle the RPC response properly with type assertion
        const count = Array.isArray(data) ? (data[0] as any)?.count : (data as any)?.count;
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

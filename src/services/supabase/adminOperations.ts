
import { handleSupabaseError } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      toast.error("Admin access required", {
        description: "This operation requires administrator privileges."
      });
      return null;
    }
    
    // Handle other errors with generic message
    toast.error(`${operationName} failed`, {
      description: handleSupabaseError(error, `Failed to execute ${operationName}`)
    });
    return null;
  }
};

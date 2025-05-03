
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const updateDatabaseSchema = async () => {
  try {
    toast.info("Updating database schema...");
    
    const { data, error } = await supabase.functions.invoke('update-db-schema', {
      method: 'POST',
    });
    
    if (error) {
      console.error("Error updating database schema:", error);
      toast.error("Failed to update database schema");
      return false;
    }
    
    console.log("Database schema update result:", data);
    toast.success("Database schema updated successfully");
    return true;
  } catch (err) {
    console.error("Error calling update-db-schema function:", err);
    toast.error("Failed to update database schema");
    return false;
  }
};

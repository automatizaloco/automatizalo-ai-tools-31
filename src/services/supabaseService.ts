
// Re-export services from their respective files
export * from './testimonialService';
export * from './contactService';

// Re-export utility functions from modular services
export { checkSupabaseConnection, syncOfflineChanges } from './supabase/coreUtils';
export { setupOfflineCache, getCachedData, clearAllCaches } from './supabase/cacheService';
export { checkDatabaseSchema } from './supabase/schemaService';
export { executeAdminOperation } from './supabase/adminOperations';

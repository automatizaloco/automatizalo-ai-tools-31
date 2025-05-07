
-- Create a function to check if a table exists and return its row count
CREATE OR REPLACE FUNCTION public.get_table_count(table_name TEXT)
RETURNS TABLE (count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY EXECUTE format('SELECT COUNT(*) FROM public.%I', table_name);
EXCEPTION
  WHEN undefined_table THEN
    RETURN QUERY SELECT 0::BIGINT;
  WHEN others THEN
    RAISE LOG 'Error in get_table_count(%): %', table_name, SQLERRM;
    RETURN QUERY SELECT -1::BIGINT;
END;
$$;

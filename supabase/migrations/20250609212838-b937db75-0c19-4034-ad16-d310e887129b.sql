
-- Actualizar función exec_sql con search_path inmutable y mejor seguridad
CREATE OR REPLACE FUNCTION public.exec_sql(sql_query text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Solo permitir a administradores ejecutar esta función
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;
  
  EXECUTE sql_query;
END;
$function$;

-- Actualizar función is_admin con search_path inmutable
CREATE OR REPLACE FUNCTION public.is_admin(user_uid uuid)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_uid AND role = 'admin'
  );
END;
$function$;

-- Actualizar función is_admin_secure con search_path inmutable
CREATE OR REPLACE FUNCTION public.is_admin_secure()
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$function$;

-- Actualizar función get_users con search_path inmutable
CREATE OR REPLACE FUNCTION public.get_users()
 RETURNS TABLE(id uuid, email text, role text, created_at timestamp with time zone, updated_at timestamp with time zone)
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Solo permitir acceso a administradores
  IF NOT EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Access denied: Admin privileges required';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email,
    u.role,
    u.created_at,
    u.updated_at
  FROM 
    public.users u
  ORDER BY u.created_at DESC;
END;
$function$;

-- Actualizar función handle_new_user con search_path inmutable
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    CASE 
      WHEN NEW.email = 'contact@automatizalo.co' THEN 'admin'
      ELSE 'client'
    END
  ) ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
  WHEN OTHERS THEN
    RAISE LOG 'Error in handle_new_user: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Actualizar función handle_new_client con search_path inmutable
CREATE OR REPLACE FUNCTION public.handle_new_client()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.clients (id, company_name, contact_person)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'company_name', 'Unknown Company'),
    COALESCE(NEW.raw_user_meta_data->>'contact_person', NEW.email)
  );
  RETURN NEW;
END;
$function$;

-- Actualizar función update_updated_at_column con search_path inmutable
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

-- Actualizar función update_modified_column con search_path inmutable
CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$function$;

-- Actualizar función update_client_integration_settings_updated_at con search_path inmutable
CREATE OR REPLACE FUNCTION public.update_client_integration_settings_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path = public
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$;

-- Crear función para obtener el conteo de tablas de manera segura
CREATE OR REPLACE FUNCTION public.get_table_count(table_name TEXT)
RETURNS TABLE (count BIGINT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  RETURN QUERY EXECUTE format('SELECT COUNT(*) FROM public.%I', table_name);
EXCEPTION
  WHEN undefined_table THEN
    RETURN QUERY SELECT 0::BIGINT;
  WHEN others THEN
    RAISE LOG 'Error in get_table_count(%): %', table_name, SQLERRM;
    RETURN QUERY SELECT -1::BIGINT;
END;
$function$;

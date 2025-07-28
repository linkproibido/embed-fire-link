-- Fix security warnings: Restrict anonymous access and fix search paths

-- Fix search path for existing functions
ALTER FUNCTION public.has_active_subscription SET search_path = public;
ALTER FUNCTION public.is_admin SET search_path = public;
ALTER FUNCTION public.handle_new_user SET search_path = public;
ALTER FUNCTION public.update_updated_at_column SET search_path = public;
ALTER FUNCTION public.activate_subscription SET search_path = public;

-- Update categories policies to require authentication
DROP POLICY IF EXISTS "Authenticated users with active subscription can view categorie" ON public.categories;
CREATE POLICY "Authenticated users with active subscription can view categories" ON public.categories
FOR SELECT TO authenticated
USING ((is_active = true) AND has_active_subscription());

-- Update doramas policies to be more secure for management, but keep viewing public
DROP POLICY IF EXISTS "Anyone can view doramas" ON public.doramas;
CREATE POLICY "Anyone can view doramas" ON public.doramas
FOR SELECT USING (true);

-- Keep admin policies as they are since they already use is_admin() function

-- Update profiles policies to be more explicit
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can update their own profile" ON public.profiles
FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own profile" ON public.profiles
FOR SELECT TO authenticated
USING (auth.uid() = user_id);

-- Update subscriptions policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
FOR SELECT TO authenticated
USING (auth.uid() = user_id);
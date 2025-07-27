-- Corrigir políticas para permitir apenas usuários autenticados

-- Remover políticas antigas e criar novas mais restritivas para categories
DROP POLICY IF EXISTS "Active users can view active categories" ON public.categories;
DROP POLICY IF EXISTS "Admins can manage all categories" ON public.categories;

CREATE POLICY "Authenticated users with active subscription can view categories" 
ON public.categories 
FOR SELECT 
TO authenticated
USING (
  is_active = true AND 
  has_active_subscription()
);

CREATE POLICY "Admins can manage all categories" 
ON public.categories 
FOR ALL 
TO authenticated
USING (is_admin());

-- Corrigir políticas para subscriptions
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscriptions;
DROP POLICY IF EXISTS "Admins can manage all subscriptions" ON public.subscriptions;

CREATE POLICY "Users can view their own subscription" 
ON public.subscriptions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscription" 
ON public.subscriptions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all subscriptions" 
ON public.subscriptions 
FOR ALL 
TO authenticated
USING (is_admin());

-- Corrigir políticas para movies (existentes)
DROP POLICY IF EXISTS "Only admins can delete movies" ON public.movies;
DROP POLICY IF EXISTS "Only admins can insert movies" ON public.movies;
DROP POLICY IF EXISTS "Only admins can update movies" ON public.movies;
DROP POLICY IF EXISTS "Only admins can view movies" ON public.movies;

CREATE POLICY "Only admins can delete movies" 
ON public.movies 
FOR DELETE 
TO authenticated
USING (is_admin());

CREATE POLICY "Only admins can insert movies" 
ON public.movies 
FOR INSERT 
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Only admins can update movies" 
ON public.movies 
FOR UPDATE 
TO authenticated
USING (is_admin());

CREATE POLICY "Only admins can view movies" 
ON public.movies 
FOR SELECT 
TO authenticated
USING (is_admin());

-- Corrigir políticas para profiles
DROP POLICY IF EXISTS "Authenticated users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);
-- Update movies table structure for doramas
ALTER TABLE public.movies RENAME TO doramas;

-- Add tags column to doramas
ALTER TABLE public.doramas ADD COLUMN tags TEXT[];

-- Update categories table for dorama genres
DELETE FROM public.categories;
INSERT INTO public.categories (name, description, cover_image_url, content_link) VALUES
('Romance', 'Doramas românticos tocantes', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', '#'),
('Ação', 'Doramas de ação e suspense', 'https://images.unsplash.com/photo-1489599316335-b5e0d6395bd0?w=400&h=600&fit=crop', '#'),
('Comédia', 'Doramas divertidos e leves', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', '#'),
('Drama', 'Doramas dramáticos intensos', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop', '#'),
('Histórico', 'Doramas de época e históricos', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', '#');

-- Add payment approval system
ALTER TABLE public.subscriptions ADD COLUMN payment_proof_url TEXT;
ALTER TABLE public.subscriptions ADD COLUMN admin_notes TEXT;
ALTER TABLE public.subscriptions ALTER COLUMN status SET DEFAULT 'pending_approval';

-- Create function to activate subscription manually
CREATE OR REPLACE FUNCTION public.activate_subscription(subscription_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE public.subscriptions 
  SET 
    status = 'active',
    expires_at = now() + interval '30 days',
    updated_at = now()
  WHERE id = subscription_id AND status = 'pending_approval';
END;
$$;

-- Insert sample doramas
INSERT INTO public.doramas (title, description, poster_url, embed_url, tags) VALUES
('Crash Landing on You', 'Uma herdeira sul-coreana faz um pouso forçado na Coreia do Norte durante um voo de parapente e conhece um oficial do exército.', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop', 'https://www.youtube.com/embed/Gh6z6mNZC1s', ARRAY['Romance', 'Drama', 'Comédia']),
('Kingdom', 'Um príncipe herdeiro investiga uma misteriosa epidemia que se espalha pela Dinastia Joseon.', 'https://images.unsplash.com/photo-1489599316335-b5e0d6395bd0?w=400&h=600&fit=crop', 'https://www.youtube.com/embed/4l-yByZpaaM', ARRAY['Horror', 'Drama', 'Histórico']),
('Hotel del Luna', 'Um hotel que atende apenas fantasmas e sua misteriosa CEO que tem uma conexão com o mundo espiritual.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop', 'https://www.youtube.com/embed/TLbK5q_ALSY', ARRAY['Fantasia', 'Romance', 'Drama']),
('Reply 1988', 'A história nostálgica de cinco famílias que vivem no mesmo bairro em 1988.', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', 'https://www.youtube.com/embed/vM51ADnI6WQ', ARRAY['Drama', 'Comédia', 'Slice of Life']),
('Goblin', 'Um imortal procura por sua noiva para acabar com sua vida imortal enquanto vive com um Ceifador.', 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop', 'https://www.youtube.com/embed/8AcNEVUzV4o', ARRAY['Fantasia', 'Romance', 'Drama']);

-- Update RLS policies for doramas table
DROP POLICY IF EXISTS "Only admins can view movies" ON public.doramas;
DROP POLICY IF EXISTS "Only admins can insert movies" ON public.doramas;
DROP POLICY IF EXISTS "Only admins can update movies" ON public.doramas;
DROP POLICY IF EXISTS "Only admins can delete movies" ON public.doramas;

-- New policies for doramas (public can view, only admins can manage)
CREATE POLICY "Anyone can view doramas" ON public.doramas
FOR SELECT USING (true);

CREATE POLICY "Only admins can insert doramas" ON public.doramas
FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "Only admins can update doramas" ON public.doramas
FOR UPDATE USING (is_admin());

CREATE POLICY "Only admins can delete doramas" ON public.doramas
FOR DELETE USING (is_admin());
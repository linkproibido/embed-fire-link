import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Eye, LogOut, RefreshCw } from 'lucide-react';
import { User, Session } from '@supabase/supabase-js';

interface Movie {
  id: string;
  title: string;
  description: string | null;
  embed_url: string;
  poster_url: string;
  created_at: string;
  updated_at: string;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);

      if (!session?.user) {
        navigate('/admin/auth');
        return;
      }

      // Check if user is admin
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('user_id', session.user.id)
        .single();

      if (!profile?.is_admin) {
        toast({
          title: "Acesso negado",
          description: "Você não tem permissão de administrador.",
          variant: "destructive"
        });
        navigate('/admin/auth');
        return;
      }

      setIsAdmin(true);
      loadMovies();
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT') {
          navigate('/admin/auth');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  const loadMovies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('movies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading movies:', error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os filmes.",
          variant: "destructive"
        });
        return;
      }

      setMovies(data || []);
    } catch (error) {
      console.error('Error loading movies:', error);
      toast({
        title: "Erro",
        description: "Erro inesperado ao carregar os filmes.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  const generateViewLink = (movieId: string) => {
    const encodedId = btoa(movieId);
    return `https://linkproibido.com/v/${encodedId}`;
  };

  const handleViewMovie = (movieId: string) => {
    const encodedId = btoa(movieId);
    window.open(`/v/${encodedId}`, '_blank');
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Verificando permissões...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Logado como: {user?.email}
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadMovies} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
            <Button onClick={handleSignOut} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Links Criados</CardTitle>
            <CardDescription>
              Total de {movies.length} links de filmes criados
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Carregando filmes...</p>
              </div>
            ) : movies.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum filme encontrado.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Descrição</TableHead>
                      <TableHead>Link Gerado</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {movies.map((movie) => (
                      <TableRow key={movie.id}>
                        <TableCell className="font-medium">
                          {movie.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {movie.description || 'Sem descrição'}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {generateViewLink(movie.id)}
                            </code>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {formatDate(movie.created_at)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            onClick={() => handleViewMovie(movie.id)}
                            variant="outline"
                            size="sm"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Ver
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
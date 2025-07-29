import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { User, Search, Play, Heart, Star, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Dorama {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  tags: string[];
  created_at: string;
}

const DoramaHome = () => {
  const navigate = useNavigate();
  const [doramas, setDoramas] = useState<Dorama[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [user, setUser] = useState(null);

  const genres = ['Romance', 'Ação', 'Comédia', 'Drama', 'Histórico', 'Fantasia', 'Horror'];

  useEffect(() => {
    loadDoramas();
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const loadDoramas = async () => {
    try {
      const { data, error } = await supabase
        .from('doramas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoramas(data || []);
    } catch (error) {
      console.error('Error loading doramas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os doramas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredDoramas = doramas.filter(dorama => {
    const matchesSearch = dorama.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         dorama.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGenre = !selectedGenre || dorama.tags?.includes(selectedGenre);
    return matchesSearch && matchesGenre;
  });

  const handleDoramaClick = (dorama: Dorama) => {
    const encodedId = btoa(dorama.id);
    navigate(`/dorama/${encodedId}`);
  };

  const handleAuth = () => {
    navigate('/auth');
  };

  const handlePricing = () => {
    navigate('/plano');
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-heading font-bold text-foreground">
                  Shorts Dorama
                </h1>
                <p className="text-xs text-muted-foreground">Shop</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {user ? (
                <Button variant="outline" onClick={() => navigate('/dashboard')}>
                  <User className="w-4 h-4 mr-2" />
                  Minha Conta
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleAuth}>
                    Entrar
                  </Button>
                  <Button onClick={handlePricing} className="bg-gradient-primary">
                    Assinar R$ 20/mês
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-card border-b border-border/20">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Doramas & Filmes
            </span>
            <br />
            <span className="text-foreground">Asiáticos em HD</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Descubra os melhores doramas coreanos, chineses, japoneses e tailandeses. 
            Qualidade HD, sem anúncios, legendas em português.
          </p>

          {/* Search Bar */}
          <div className="max-w-md mx-auto relative mb-8">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Buscar doramas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-card border-border"
            />
          </div>

          {/* Genre Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedGenre === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedGenre(null)}
            >
              Todos
            </Button>
            {genres.map((genre) => (
              <Button
                key={genre}
                variant={selectedGenre === genre ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGenre(genre)}
              >
                {genre}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Doramas Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted rounded-lg aspect-[2/3] mb-3"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredDoramas.map((dorama) => (
              <Card
                key={dorama.id}
                className="group cursor-pointer hover:scale-105 transition-all duration-300 bg-card/60 backdrop-blur-sm border-border/50 hover:border-primary/50 hover:shadow-glow"
                onClick={() => handleDoramaClick(dorama)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={dorama.poster_url}
                      alt={dorama.title}
                      className="w-full aspect-[2/3] object-cover rounded-t-lg"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-lg flex items-center justify-center">
                      <div className="text-center">
                        <Play className="w-12 h-12 text-white mb-2 mx-auto" />
                        <p className="text-white text-sm font-medium">Assistir</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {dorama.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {dorama.description}
                    </p>
                    
                    {dorama.tags && dorama.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {dorama.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {dorama.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{dorama.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!loading && filteredDoramas.length === 0 && (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Nenhum dorama encontrado
            </h3>
            <p className="text-muted-foreground">
              Tente ajustar seus filtros ou busca
            </p>
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-card border-t border-border/20 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Pronto para maratonar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Acesse todos os doramas, sem anúncios, em qualidade HD. 
            Comece sua jornada pelos melhores conteúdos asiáticos hoje mesmo.
          </p>
          
          {!user && (
            <Button 
              onClick={handlePricing}
              size="lg"
              className="bg-gradient-primary text-lg px-8 py-6"
            >
              Assinar por R$ 20/mês
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="font-heading font-bold">Shorts Dorama Shop</span>
          </div>
          <p className="text-sm">
            © 2024 Shorts Dorama Shop. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default DoramaHome;
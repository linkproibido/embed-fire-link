import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Play, Calendar, Eye, Share2, Heart, AlertCircle, CreditCard } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Dorama {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  embed_url: string;
  tags: string[];
  created_at: string;
}

const DoramaView = () => {
  const { encodedId } = useParams();
  const navigate = useNavigate();
  const [dorama, setDorama] = useState<Dorama | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [user, setUser] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [views] = useState(Math.floor(Math.random() * 5000) + 100);

  useEffect(() => {
    if (!encodedId) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    try {
      const doramaId = atob(encodedId);
      fetchDorama(doramaId);
    } catch (error) {
      setNotFound(true);
      setLoading(false);
    }
  }, [encodedId]);

  const fetchDorama = async (doramaId: string) => {
    try {
      // Check user and subscription
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: subscription } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();
        
        setHasSubscription(!!subscription);
      }

      // Fetch dorama
      const { data, error } = await supabase
        .from('doramas')
        .select('*')
        .eq('id', doramaId)
        .single();

      if (error) {
        console.error('Error fetching dorama:', error);
        setNotFound(true);
        return;
      }

      if (!data) {
        setNotFound(true);
        return;
      }

      setDorama(data);
    } catch (err) {
      console.error('Unexpected error:', err);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share && dorama) {
      try {
        await navigator.share({
          title: dorama.title,
          text: `Confira este dorama: ${dorama.title}`,
          url: url,
        });
      } catch (err) {
        navigator.clipboard.writeText(url);
        toast({
          title: "Link copiado!",
          description: "Link do dorama copiado para a área de transferência",
        });
      }
    } else {
      navigator.clipboard.writeText(url);
      toast({
        title: "Link copiado!",
        description: "Link do dorama copiado para a área de transferência",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando dorama...</p>
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Dorama não encontrado</h1>
          <p className="text-muted-foreground mb-6">O dorama que você está procurando não existe ou foi removido.</p>
          <Button onClick={() => navigate('/')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Button>
        </div>
      </div>
    );
  }

  if (!dorama) return null;

  const canWatch = user && hasSubscription;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Poster */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-0">
                <img
                  src={dorama.poster_url}
                  alt={dorama.title}
                  className="w-full aspect-[2/3] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=600&fit=crop';
                  }}
                />
              </CardContent>
            </Card>

            {/* Stats */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  <span>{views.toLocaleString()} visualizações</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(dorama.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Info */}
            <div>
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                {dorama.title}
              </h1>
              
              {dorama.tags && dorama.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {dorama.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              <p className="text-muted-foreground leading-relaxed text-lg">
                {dorama.description}
              </p>
            </div>

            {/* Video Player or Access Message */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                {canWatch ? (
                  <div className="aspect-video">
                    <iframe
                      src={dorama.embed_url}
                      title={dorama.title}
                      className="w-full h-full rounded-lg"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-card rounded-lg flex items-center justify-center relative">
                    <div className="absolute inset-0 bg-black/60 rounded-lg"></div>
                    <div className="relative text-center space-y-4">
                      {user ? (
                        <>
                          <AlertCircle className="w-16 h-16 text-primary mx-auto" />
                          <h3 className="text-xl font-bold text-foreground">
                            Plano Necessário
                          </h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            Para assistir este dorama, você precisa de um plano ativo. 
                            Acesse todos os conteúdos por apenas R$ 20/mês.
                          </p>
                          <Button 
                            onClick={() => navigate('/plano')}
                            className="bg-gradient-primary"
                            size="lg"
                          >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Ativar Plano
                          </Button>
                        </>
                      ) : (
                        <>
                          <Play className="w-16 h-16 text-primary mx-auto" />
                          <h3 className="text-xl font-bold text-foreground">
                            Faça Login para Assistir
                          </h3>
                          <p className="text-muted-foreground max-w-md mx-auto">
                            Entre em sua conta para assistir este dorama. 
                            Não tem conta? Cadastre-se e ative seu plano.
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button 
                              variant="outline"
                              onClick={() => navigate('/auth')}
                            >
                              Fazer Login
                            </Button>
                            <Button 
                              onClick={() => navigate('/plano')}
                              className="bg-gradient-primary"
                            >
                              Assinar Plano
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Promotional Alert */}
            <Alert className="border-primary/50 bg-primary/5">
              <CreditCard className="h-4 w-4" />
              <AlertDescription>
                <strong>Oferta especial:</strong> Acesse todos os doramas por apenas R$ 20/mês. 
                Sem anúncios, qualidade HD e legendas em português.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoramaView;
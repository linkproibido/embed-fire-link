import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import Logo from '@/components/Logo';
import { ExternalLink, Lock, LogOut, Settings, Calendar } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  description: string;
  cover_image_url: string;
  content_link: string;
  is_active: boolean;
  created_at: string;
}

interface Subscription {
  id: string;
  status: string;
  expires_at: string | null;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkUserAndSubscription();
  }, [navigate]);

  const checkUserAndSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/auth');
        return;
      }

      setUser(user);

      // Check subscription status
      const { data: subscriptionData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (!subscriptionData) {
        navigate('/checkout');
        return;
      }

      setSubscription(subscriptionData);

      // Load categories
      const { data: categoriesData, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading categories:', error);
        toast({
          title: "Erro",
          description: "Erro ao carregar categorias.",
          variant: "destructive"
        });
      } else {
        setCategories(categoriesData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Erro",
        description: "Erro ao verificar dados do usuário.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const openCategory = (category: Category) => {
    setSelectedCategory(category);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando dashboard...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !subscription) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Olá, {user.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Subscription Info */}
        <Card className="mb-8 border-primary/20 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Sua Assinatura
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <p className="font-semibold text-primary">Plano Premium Ativo</p>
                <p className="text-sm text-muted-foreground">
                  {subscription.expires_at ? (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Expira em {formatDate(subscription.expires_at)}
                    </span>
                  ) : (
                    'Assinatura permanente'
                  )}
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">R$ 20/mês</p>
                <p className="text-sm text-muted-foreground">Renovação automática</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="mb-6">
          <h2 className="text-2xl font-heading font-bold mb-2">
            Categorias Disponíveis
          </h2>
          <p className="text-muted-foreground mb-6">
            Clique em uma categoria para acessar o conteúdo exclusivo
          </p>
        </div>

        {categories.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhuma categoria disponível</h3>
              <p className="text-muted-foreground">
                Aguarde! Novas categorias serão adicionadas em breve.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card 
                key={category.id}
                className="group cursor-pointer border-border/50 bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:scale-105"
                onClick={() => openCategory(category)}
              >
                <div className="aspect-video relative overflow-hidden rounded-t-lg">
                  <img
                    src={category.cover_image_url}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder.svg';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                <CardHeader>
                  <CardTitle className="line-clamp-1">{category.name}</CardTitle>
                  {category.description && (
                    <CardDescription className="line-clamp-2">
                      {category.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <Button className="w-full group-hover:bg-primary/90 transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Acessar Conteúdo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Category Dialog */}
      <Dialog open={!!selectedCategory} onOpenChange={() => setSelectedCategory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedCategory?.name}</DialogTitle>
            <DialogDescription>
              {selectedCategory?.description || 'Acesse o conteúdo exclusivo desta categoria'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCategory?.cover_image_url && (
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={selectedCategory.cover_image_url}
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
            )}
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => {
                  if (selectedCategory?.content_link) {
                    window.open(selectedCategory.content_link, '_blank');
                  }
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Link
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory(null)}
              >
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
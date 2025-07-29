import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Users, CheckCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  amount: number;
  created_at: string;
  profiles?: { email: string } | null;
}

const DoramaAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadPendingSubscriptions();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setUser(user);
  };

  const loadPendingSubscriptions = async () => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!inner(email)
        `)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubscriptions((data as any) || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase.rpc('activate_subscription', {
        subscription_id: subscriptionId
      });

      if (error) throw error;

      toast({
        title: "Assinatura aprovada!",
        description: "Plano ativado por 30 dias",
      });

      loadPendingSubscriptions();
    } catch (error) {
      console.error('Error approving subscription:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar assinatura",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-dark flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-heading font-bold">Painel Admin</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate('/admin/doramas')}>
                <Plus className="w-4 h-4 mr-2" />
                Gerenciar Doramas
              </Button>
              <Button variant="outline" onClick={() => navigate('/')}>
                Ver Site
              </Button>
              <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="bg-card/60 backdrop-blur-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              Assinaturas Pendentes ({subscriptions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                Nenhuma assinatura pendente
              </p>
            ) : (
              <div className="space-y-4">
                {subscriptions.map((sub) => (
                  <div key={sub.id} className="border border-border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{sub.profiles?.email}</p>
                        <p className="text-sm text-muted-foreground">
                          R$ {sub.amount} • {new Date(sub.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Button
                        onClick={() => approveSubscription(sub.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Aprovar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoramaAdmin;
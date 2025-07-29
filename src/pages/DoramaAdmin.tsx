import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, Users, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  user_id: string;
  status: string;
  amount: number;
  created_at: string;
  expires_at: string | null;
  updated_at: string;
  profiles?: { email: string } | null;
}

const DoramaAdmin = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [allSubscriptions, setAllSubscriptions] = useState<Subscription[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadSubscriptions();
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

  const loadSubscriptions = async () => {
    try {
      // Load pending subscriptions
      const { data: pendingData, error: pendingError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!inner(email)
        `)
        .eq('status', 'pending_approval')
        .order('created_at', { ascending: false });

      if (pendingError) throw pendingError;
      setSubscriptions((pendingData as any) || []);

      // Load all subscriptions
      const { data: allData, error: allError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          profiles!inner(email)
        `)
        .order('created_at', { ascending: false });

      if (allError) throw allError;
      setAllSubscriptions((allData as any) || []);
    } catch (error) {
      console.error('Error loading subscriptions:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar assinaturas",
        variant: "destructive",
      });
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

      loadSubscriptions();
    } catch (error) {
      console.error('Error approving subscription:', error);
      toast({
        title: "Erro",
        description: "Erro ao aprovar assinatura",
        variant: "destructive",
      });
    }
  };

  const rejectSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId);

      if (error) throw error;

      toast({
        title: "Assinatura rejeitada!",
        description: "A assinatura foi cancelada",
      });

      loadSubscriptions();
    } catch (error) {
      console.error('Error rejecting subscription:', error);
      toast({
        title: "Erro",
        description: "Erro ao rejeitar assinatura",
        variant: "destructive",
      });
    }
  };

  const reactivateSubscription = async (subscriptionId: string) => {
    try {
      const { error } = await supabase.rpc('activate_subscription', {
        subscription_id: subscriptionId
      });

      if (error) throw error;

      toast({
        title: "Assinatura reativada!",
        description: "Plano ativado por 30 dias",
      });

      loadSubscriptions();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      toast({
        title: "Erro",
        description: "Erro ao reativar assinatura",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Ativa</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pendente</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Expirada</Badge>;
      case 'cancelled':
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex gap-4">
            <Button
              variant={activeTab === 'pending' ? 'default' : 'outline'}
              onClick={() => setActiveTab('pending')}
            >
              Pendentes ({subscriptions.length})
            </Button>
            <Button
              variant={activeTab === 'all' ? 'default' : 'outline'}
              onClick={() => setActiveTab('all')}
            >
              Todas ({allSubscriptions.length})
            </Button>
          </div>

          {/* Pending Subscriptions */}
          {activeTab === 'pending' && (
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
                          <div className="space-y-1">
                            <p className="font-medium">{sub.profiles?.email}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>R$ {sub.amount}</span>
                              <span>•</span>
                              <span>{formatDate(sub.created_at)}</span>
                              <span>•</span>
                              {getStatusBadge(sub.status)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => approveSubscription(sub.id)}
                              className="bg-green-600 hover:bg-green-700"
                              size="sm"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Aprovar
                            </Button>
                            <Button
                              onClick={() => rejectSubscription(sub.id)}
                              variant="destructive"
                              size="sm"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Rejeitar
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* All Subscriptions */}
          {activeTab === 'all' && (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  Todas as Assinaturas ({allSubscriptions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {allSubscriptions.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma assinatura encontrada
                  </p>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {allSubscriptions.map((sub) => (
                      <div key={sub.id} className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="space-y-1">
                            <p className="font-medium">{sub.profiles?.email}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>R$ {sub.amount}</span>
                              <span>•</span>
                              <span>{formatDate(sub.created_at)}</span>
                              {sub.expires_at && (
                                <>
                                  <span>•</span>
                                  <span>Expira: {formatDate(sub.expires_at)}</span>
                                </>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {getStatusBadge(sub.status)}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {sub.status === 'pending_approval' && (
                              <>
                                <Button
                                  onClick={() => approveSubscription(sub.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                  size="sm"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Aprovar
                                </Button>
                                <Button
                                  onClick={() => rejectSubscription(sub.id)}
                                  variant="destructive"
                                  size="sm"
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Rejeitar
                                </Button>
                              </>
                            )}
                            {(sub.status === 'expired' || sub.status === 'cancelled') && (
                              <Button
                                onClick={() => reactivateSubscription(sub.id)}
                                variant="outline"
                                size="sm"
                              >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Reativar
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoramaAdmin;
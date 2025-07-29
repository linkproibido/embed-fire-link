import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, 
  Calendar, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  Star
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SubscriptionData {
  id: string;
  status: string;
  amount: number;
  created_at: string;
  expires_at: string | null;
  updated_at: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }
    setUser(user);
    await loadSubscription(user.id);
  };

  const loadSubscription = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error('Error loading subscription:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar dados da assinatura",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'active':
        return {
          label: 'Ativa',
          color: 'bg-green-100 text-green-800 border-green-200',
          icon: <CheckCircle className="w-4 h-4" />,
          description: 'Sua assinatura está ativa e funcionando'
        };
      case 'pending_approval':
        return {
          label: 'Aguardando Aprovação',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          icon: <Clock className="w-4 h-4" />,
          description: 'Pagamento registrado, aguardando confirmação do admin'
        };
      case 'expired':
        return {
          label: 'Expirada',
          color: 'bg-red-100 text-red-800 border-red-200',
          icon: <XCircle className="w-4 h-4" />,
          description: 'Sua assinatura expirou'
        };
      case 'cancelled':
        return {
          label: 'Cancelada',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <XCircle className="w-4 h-4" />,
          description: 'Assinatura foi cancelada'
        };
      default:
        return {
          label: 'Desconhecido',
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          icon: <AlertTriangle className="w-4 h-4" />,
          description: 'Status desconhecido'
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expiration = new Date(expiresAt);
    const diffTime = expiration.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar ao Site
              </Button>
              <h1 className="text-xl font-heading font-bold">Minha Conta</h1>
            </div>
            <Button variant="outline" onClick={() => supabase.auth.signOut()}>
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Welcome Section */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <User className="w-6 h-6 text-primary" />
                Bem-vindo, {user?.email}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Gerencie sua assinatura e acompanhe o status do seu plano premium.
              </p>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          {subscription ? (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                  Status da Assinatura
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getStatusInfo(subscription.status).icon}
                      <Badge className={getStatusInfo(subscription.status).color}>
                        {getStatusInfo(subscription.status).label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getStatusInfo(subscription.status).description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">R$ {subscription.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">Valor pago</p>
                  </div>
                </div>

                {subscription.status === 'active' && subscription.expires_at && (
                  <Alert className="border-green-200 bg-green-50">
                    <Calendar className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-1">
                        <p><strong>Plano expira em:</strong> {formatDate(subscription.expires_at)}</p>
                        <p className="text-sm">
                          {getDaysRemaining(subscription.expires_at) > 0 
                            ? `${getDaysRemaining(subscription.expires_at)} dias restantes`
                            : 'Plano expirado'
                          }
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {subscription.status === 'pending_approval' && (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p><strong>Aguardando aprovação</strong></p>
                        <p className="text-sm">
                          Pagamento registrado em: {formatDate(subscription.created_at)}
                        </p>
                        <p className="text-sm">
                          Seu plano será ativado em até 24 horas após a confirmação do pagamento.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                {(subscription.status === 'expired' || subscription.status === 'cancelled') && (
                  <Alert className="border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="space-y-2">
                        <p><strong>Assinatura {subscription.status === 'expired' ? 'expirada' : 'cancelada'}</strong></p>
                        {subscription.expires_at && (
                          <p className="text-sm">
                            Data de expiração: {formatDate(subscription.expires_at)}
                          </p>
                        )}
                        <p className="text-sm">
                          Renove sua assinatura para continuar acessando todo o conteúdo.
                        </p>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Data de Criação</p>
                    <p className="font-medium">{formatDate(subscription.created_at)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Última Atualização</p>
                    <p className="font-medium">{formatDate(subscription.updated_at)}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">ID da Assinatura</p>
                    <p className="font-medium text-xs">{subscription.id.substring(0, 8)}...</p>
                  </div>
                </div>

                {(subscription.status === 'expired' || subscription.status === 'cancelled' || !subscription) && (
                  <div className="pt-4">
                    <Button 
                      onClick={() => navigate('/plano')}
                      className="w-full bg-gradient-primary"
                      size="lg"
                    >
                      <Star className="w-5 h-5 mr-2" />
                      Renovar Assinatura
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  Nenhuma Assinatura Encontrada
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Você ainda não possui uma assinatura ativa. Assine nosso plano premium para ter acesso completo a todos os doramas.
                </p>
                <Button 
                  onClick={() => navigate('/plano')}
                  className="w-full bg-gradient-primary"
                  size="lg"
                >
                  <Star className="w-5 h-5 mr-2" />
                  Assinar Plano Premium
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Benefits Section */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Star className="w-6 h-6 text-primary" />
                Benefícios do Plano Premium
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Acesso completo a todos os doramas</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Qualidade HD sem anúncios</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Legendas em português</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Novos conteúdos toda semana</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
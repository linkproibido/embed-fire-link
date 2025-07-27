import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import Logo from '@/components/Logo';
import { CheckCircle, CreditCard, Shield } from 'lucide-react';

const Checkout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth?redirect=checkout');
        return;
      }
      setUser(user);
    };

    checkUser();
  }, [navigate]);

  const handlePayment = async () => {
    if (!user) return;

    setLoading(true);

    try {
      // Create subscription record in pending status
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          status: 'pending',
          amount: 20.00
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating subscription:', error);
        toast({
          title: "Erro",
          description: "Erro ao criar assinatura. Tente novamente.",
          variant: "destructive"
        });
        return;
      }

      // Here you would integrate with Mercado Pago
      // For now, we'll simulate a successful payment
      const paymentData = {
        subscription_id: subscription.id,
        user_email: user.email,
        amount: 20.00
      };

      // Simulate API call to Mercado Pago
      setTimeout(async () => {
        // Simulate successful payment and update subscription
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1);

        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            payment_id: 'MP_' + Date.now(), // Simulated payment ID
            expires_at: expiresAt.toISOString()
          })
          .eq('id', subscription.id);

        if (!updateError) {
          toast({
            title: "Pagamento aprovado!",
            description: "Sua assinatura foi ativada com sucesso.",
            variant: "default"
          });
          navigate('/dashboard');
        }
      }, 2000);

      toast({
        title: "Processando pagamento...",
        description: "Aguarde enquanto processamos seu pagamento.",
        variant: "default"
      });

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Erro no pagamento",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
          >
            Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">
            Finalizar Assinatura
          </h1>
          <p className="text-muted-foreground">
            Você está quase lá! Complete seu pagamento para ter acesso total.
          </p>
        </div>

        <div className="grid gap-6">
          {/* User Info */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Conta Confirmada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {user.email}
              </p>
            </CardContent>
          </Card>

          {/* Plan Details */}
          <Card className="border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Plano Premium</CardTitle>
              <CardDescription className="text-center">
                Acesso completo a todo conteúdo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-primary mb-2">
                  R$ 20<span className="text-lg text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cobrança mensal • Cancele quando quiser
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Acesso a todas as categorias</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Conteúdo exclusivo e premium</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Acesso imediato após pagamento</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  <span>Suporte prioritário</span>
                </div>
              </div>

              <Button 
                onClick={handlePayment}
                disabled={loading}
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processando...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    Pagar com Mercado Pago
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Pagamento 100% seguro</p>
                  <p>Seus dados são protegidos pelo Mercado Pago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
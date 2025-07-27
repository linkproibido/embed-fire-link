import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import Logo from '@/components/Logo';
import { CheckCircle, CreditCard, Shield } from 'lucide-react';

const Checkout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Verifica autenticação
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        navigate('/auth?redirect=checkout');
        return;
      }
      setUser(data.user);
    };

    checkUser();
  }, [navigate]);

  // Cria assinatura
  useEffect(() => {
    const createSubscription = async () => {
      if (!user || subscriptionId) return;

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          email: user.email,
          status: 'pending',
          amount: 20.0,
        })
        .select()
        .single();

      if (error) {
        toast({
          title: 'Erro',
          description: 'Não foi possível criar a assinatura.',
          variant: 'destructive',
        });
      } else if (data) {
        setSubscriptionId(data.id);
      }
    };

    createSubscription();
  }, [user, subscriptionId, toast]);

  // Carrega botão Yampi
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://api.yampi.io/v2/hype-sistemas/public/buy-button/AYCW65ZQEL/js';
    script.async = true;
    script.className = 'ymp-script';
    document.body.appendChild(script);

    return () => {
      document.querySelectorAll('.ymp-script').forEach(s => s.remove());
    };
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <Card className="w-full max-w-sm text-center">
          <CardContent className="p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Verificando autenticação...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/90 to-primary/5">
      {/* Header */}
      <header className="backdrop-blur bg-background/80 border-b border-border/30">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </header>

      {/* Conteúdo */}
      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <section className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-2">
            Finalizar Assinatura
          </h1>
          <p className="text-muted-foreground">
            Complete seu pagamento para liberar acesso completo.
          </p>
        </section>

        <div className="grid gap-6">
          {/* Confirmação do usuário */}
          <Card className="bg-card/80 backdrop-blur-md border-border/40 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <CheckCircle className="h-5 w-5 text-green-500" />
                Conta verificada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                <strong>Email:</strong> {user.email}
              </p>
            </CardContent>
          </Card>

          {/* Plano */}
          <Card className="bg-card/90 border-primary/30 shadow-lg backdrop-blur">
            <CardHeader>
              <CardTitle className="text-center text-xl">Plano Premium</CardTitle>
              <CardDescription className="text-center">
                Acesso ilimitado a todos os conteúdos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-black text-primary mb-1">
                  R$ 20<span className="text-lg text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cancele quando quiser, sem fidelidade
                </p>
              </div>

              <ul className="space-y-3 mb-6 text-sm text-left">
                {[
                  'Acesso a todas as categorias',
                  'Conteúdo exclusivo e premium',
                  'Acesso imediato após pagamento',
                  'Suporte prioritário',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Botão Yampi */}
              <div id="yampi-checkout-btn" className="w-full" />
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="bg-card/70 border-border/30 backdrop-blur">
            <CardContent className="p-4 flex items-center gap-3 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Pagamento 100% seguro</p>
                <p>Processado com tecnologia Yampi</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

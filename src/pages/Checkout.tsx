import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import Logo from '@/components/Logo';
import { CheckCircle, Shield } from 'lucide-react';

const Checkout = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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

  // Corrigido: carrega script da Yampi após DOM estar pronto
  useEffect(() => {
    const scriptId = 'yampi-checkout-script';
    const existingScript = document.getElementById(scriptId);

    const loadYampi = () => {
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://api.yampi.io/v2/hype-sistemas/public/buy-button/AYCW65ZQEL/js';
      script.async = true;

      script.onload = () => {
        console.log('Botão da Yampi carregado.');
      };

      document.getElementById('yampi-button-container')?.appendChild(script);
    };

    const timeout = setTimeout(() => {
      loadYampi();
    }, 300); // Aguarda DOM renderizar

    return () => clearTimeout(timeout);
  }, []);

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
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold mb-4">Finalizar Assinatura</h1>
          <p className="text-muted-foreground">Você está quase lá! Complete seu pagamento para ter acesso total.</p>
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

          {/* Plano Premium */}
          <Card className="border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center">Plano Premium</CardTitle>
              <CardDescription className="text-center">Acesso completo a todo conteúdo</CardDescription>
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

              {/* Aqui o botão da Yampi será injetado */}
              <div id="yampi-button-container" className="flex justify-center mt-6" />
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Shield className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Pagamento 100% seguro</p>
                  <p>Seus dados são protegidos pela Yampi</p>
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

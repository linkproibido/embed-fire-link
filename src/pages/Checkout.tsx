"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import Logo from "@/components/Logo";
import { CheckCircle, CreditCard, Shield } from "lucide-react";

const Checkout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  // Autenticação do usuário
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/auth?redirect=checkout");
        return;
      }
      setUser(data.user);
    };

    fetchUser();
  }, [router]);

  // Criação da assinatura no Supabase
  useEffect(() => {
    const createSubscription = async () => {
      if (!user || subscriptionId) return;

      const { data, error } = await supabase
        .from("subscriptions")
        .insert({
          user_id: user.id,
          email: user.email,
          status: "pending",
          amount: 20.0,
        })
        .select()
        .single();

      if (data) setSubscriptionId(data.id);

      if (error) {
        toast({
          title: "Erro",
          description: "Não foi possível criar a assinatura.",
          variant: "destructive",
        });
      }
    };

    createSubscription();
  }, [user, subscriptionId, toast]);

  // Carrega o botão da Yampi
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://api.yampi.io/v2/hype-sistemas/public/buy-button/AYCW65ZQEL/js";
    script.className = "ymp-script";
    script.async = true;
    document.getElementById("yampi-checkout-btn")?.appendChild(script);

    return () => {
      document.getElementById("yampi-checkout-btn")?.removeChild(script);
    };
  }, []);

  // Loader enquanto autentica
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
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
      <header className="border-b border-border/40 backdrop-blur-md bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <Button variant="ghost" onClick={() => router.push("/dashboard")}>
            Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Finalizar Assinatura</h1>
          <p className="text-muted-foreground">
            Complete seu pagamento e desbloqueie o conteúdo premium.
          </p>
        </div>

        <div className="grid gap-6">
          {/* Conta Confirmada */}
          <Card>
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

          {/* Plano */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle>Plano Premium</CardTitle>
              <CardDescription>Acesso completo por R$15/mês</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center text-4xl font-bold text-primary mb-4">
                R$ 20<span className="text-lg text-muted-foreground">/mês</span>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Acesso a todas as categorias
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Conteúdo atualizado constantemente
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-primary" />
                  Suporte prioritário
                </li>
              </ul>

              {/* Botão da Yampi */}
              <div id="yampi-checkout-btn" className="w-full" />
            </CardContent>
          </Card>

          {/* Segurança */}
          <Card>
            <CardContent className="flex items-center gap-3 p-4 text-sm text-muted-foreground">
              <Shield className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Pagamento 100% seguro</p>
                Seus dados são protegidos pela Yampi.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Checkout;

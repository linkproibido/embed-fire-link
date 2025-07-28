import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { 
  CreditCard, 
  Check, 
  Star, 
  Shield, 
  Zap, 
  Play, 
  ArrowLeft,
  Copy,
  ExternalLink,
  Clock,
  AlertCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const PlanoPagamento = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentSent, setPaymentSent] = useState(false);

  const pixKey = 'd3cbb30a-5a7f-46b8-b922-e44c8f9c4a25';
  const whatsappNumber = '5511937587626';
  const planPrice = 'R$ 20,00';

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth?redirect=plano');
      return;
    }
    setUser(user);
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(pixKey);
    toast({
      title: "Chave PIX copiada!",
      description: "A chave PIX foi copiada para a área de transferência",
    });
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(
      `Olá! Acabei de fazer o pagamento do plano mensal (R$ 20,00) via PIX para a chave: ${pixKey}. Meu email cadastrado é: ${user?.email}. Aguardo a ativação do meu plano. Obrigado!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  const handlePaymentConfirmation = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([
          {
            user_id: user.id,
            status: 'pending_approval',
            amount: 20.00,
            payment_id: `pix_${Date.now()}`,
          },
        ]);

      if (error) throw error;

      setPaymentSent(true);
      toast({
        title: "Pagamento registrado!",
        description: "Seu pagamento foi registrado. Aguarde a aprovação via WhatsApp.",
      });
    } catch (error) {
      console.error('Error registering payment:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar pagamento. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: <Play className="w-5 h-5" />, text: "Acesso completo a todos os doramas" },
    { icon: <Star className="w-5 h-5" />, text: "Qualidade HD sem anúncios" },
    { icon: <Shield className="w-5 h-5" />, text: "Legendas em português" },
    { icon: <Zap className="w-5 h-5" />, text: "Novos conteúdos toda semana" },
    { icon: <Clock className="w-5 h-5" />, text: "Acesso 24/7 em qualquer dispositivo" },
  ];

  if (paymentSent) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center p-4">
        <Card className="w-full max-w-lg bg-card/80 backdrop-blur-sm border-border/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-heading">Pagamento Registrado!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-muted-foreground">
              Seu pagamento foi registrado com sucesso. Agora envie o comprovante via WhatsApp para ativarmos seu plano.
            </p>

            <Alert className="border-primary/50 bg-primary/5">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Próximo passo:</strong> Envie o comprovante do PIX via WhatsApp para receber a aprovação em até 24 horas.
              </AlertDescription>
            </Alert>

            <div className="space-y-3">
              <Button 
                onClick={handleWhatsAppContact}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <ExternalLink className="w-5 h-5 mr-2" />
                Enviar Comprovante via WhatsApp
              </Button>

              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="w-full"
              >
                Voltar ao Início
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-heading font-black mb-4">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Plano Premium
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Acesse todos os doramas asiáticos em qualidade HD, sem anúncios, por apenas R$ 20/mês
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Plan Details */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Star className="w-8 h-8 text-primary" />
                  Plano Mensal Premium
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-black text-primary mb-2">
                    R$ 20<span className="text-xl text-muted-foreground">/mês</span>
                  </div>
                  <Badge variant="secondary" className="text-sm">
                    Sem fidelidade • Cancele quando quiser
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-foreground">O que está incluído:</h3>
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="text-primary">{benefit.icon}</div>
                        <span className="text-foreground">{benefit.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="border-primary/50 bg-primary/5">
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Garantia:</strong> Acesso imediato após aprovação do pagamento. 
                    Suporte via WhatsApp disponível 24/7.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <CreditCard className="w-8 h-8 text-primary" />
                  Pagamento via PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-muted/50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-foreground">Instruções de Pagamento:</h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">1</div>
                      <div>
                        <p className="font-medium">Copie a chave PIX</p>
                        <p className="text-sm text-muted-foreground">Use a chave abaixo para fazer o pagamento</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">2</div>
                      <div>
                        <p className="font-medium">Pague R$ 20,00 via PIX</p>
                        <p className="text-sm text-muted-foreground">No seu banco ou aplicativo de pagamento</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">3</div>
                      <div>
                        <p className="font-medium">Envie o comprovante</p>
                        <p className="text-sm text-muted-foreground">Via WhatsApp para aprovação rápida</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Chave PIX (Aleatória):
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-input p-3 rounded-lg font-mono text-sm border border-border">
                        {pixKey}
                      </div>
                      <Button onClick={handleCopyPix} variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Valor:
                    </label>
                    <div className="bg-input p-3 rounded-lg font-bold text-lg border border-border text-center">
                      {planPrice}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button 
                    onClick={handlePaymentConfirmation}
                    disabled={loading}
                    className="w-full bg-gradient-primary"
                    size="lg"
                  >
                    {loading ? (
                      "Registrando..."
                    ) : (
                      "Já fiz o pagamento"
                    )}
                  </Button>

                  <Button 
                    onClick={handleWhatsAppContact}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Contato WhatsApp: (11) 93758-7626
                  </Button>
                </div>

                <Alert>
                  <Clock className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    Após o pagamento, envie o comprovante via WhatsApp. 
                    Seu plano será ativado em até 24 horas úteis.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanoPagamento;
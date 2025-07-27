import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Logo from '@/components/Logo';
import { CheckCircle, Star, Shield, Zap } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const handleSubscribe = () => {
    navigate('/auth?redirect=checkout');
  };

  const features = [
    {
      icon: <CheckCircle className="h-6 w-6 text-primary" />,
      title: "Acesso Completo",
      description: "Conteúdo exclusivo e premium disponível 24/7"
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: "Qualidade Premium",
      description: "Materiais cuidadosamente selecionados e organizados"
    },
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Seguro e Confiável",
      description: "Plataforma segura com pagamento protegido"
    },
    {
      icon: <Zap className="h-6 w-6 text-primary" />,
      title: "Acesso Instantâneo",
      description: "Comece a usar imediatamente após o pagamento"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Logo size="md" />
          <div className="space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/auth')}
            >
              Entrar
            </Button>
            <Button 
              onClick={handleSubscribe}
              className="bg-primary hover:bg-primary/90"
            >
              Assinar Agora
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-heading font-black mb-6 leading-tight">
            <span className="text-primary drop-shadow-glow">Conteúdo Premium</span>
            <br />
            <span className="text-foreground">Exclusivo Para Você</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Acesse uma biblioteca exclusiva de conteúdos premium organizados por categorias. 
            Tudo que você precisa em um só lugar.
          </p>

          {/* Pricing Card */}
          <Card className="max-w-md mx-auto mb-12 border-primary/20 shadow-xl bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">Plano Premium</CardTitle>
              <CardDescription>Acesso completo a todo conteúdo</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <div className="text-4xl font-black text-primary mb-2">
                  R$ 20<span className="text-lg text-muted-foreground">/mês</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Cobrança mensal • Cancele quando quiser
                </p>
              </div>
              
              <Button 
                onClick={handleSubscribe}
                className="w-full py-6 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg"
                size="lg"
              >
                Assinar por R$ 20/mês
              </Button>
              
              <p className="text-xs text-muted-foreground mt-4">
                Pagamento seguro via Mercado Pago
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-heading font-bold text-center mb-12">
            Por que escolher nosso serviço?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/60 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 p-2 bg-primary/10 rounded-lg">
                      {feature.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 border-t border-border/40">
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-3xl font-heading font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já transformaram sua experiência com nosso conteúdo premium.
          </p>
          <Button 
            onClick={handleSubscribe}
            size="lg"
            className="py-6 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-xl"
          >
            Começar Agora - R$ 20/mês
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <Logo size="sm" className="mb-4" />
          <p className="text-sm">
            © 2024 Link Proibido. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
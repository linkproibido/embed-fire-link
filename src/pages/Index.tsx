import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Logo from "@/components/Logo";
import VideoFormProduction from "@/components/VideoFormProduction";
import { Video, Zap, Shield, Eye, Lock } from "lucide-react";
import { encodeVideoId } from "@/lib/videoUtils";

const Index = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const handleVideoCreated = (videoId: string) => {
    const encodedId = encodeVideoId(videoId);
    navigate(`/v/${encodedId}`);
  };

  const features = [
    {
      icon: <Lock className="w-8 h-8 text-primary" />,
      title: "Links Privados",
      description: "Seus vídeos ficam ocultos e acessíveis apenas via link direto"
    },
    {
      icon: <Shield className="w-8 h-8 text-primary" />,
      title: "Seguro & Codificado",
      description: "IDs codificados em base64 para máxima privacidade"
    },
    {
      icon: <Eye className="w-8 h-8 text-primary" />,
      title: "Sem Rastreamento",
      description: "Não aparece em buscadores nem listagens públicas"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-dark flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="text-center space-y-6">
            <Logo size="xl" className="mb-4" />
            <div className="max-w-3xl mx-auto space-y-4 px-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-heading font-bold text-foreground leading-tight">
                Compartilhamento Privado de Vídeos
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground">
                Crie links privados e seguros para seus vídeos. Sem listagens públicas, sem rastreamento. <br />
                <span className="text-primary font-medium">Apenas quem tem o link pode assistir.</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-10 sm:py-12 flex-1">
        <div className="max-w-7xl mx-auto">
          {/* Action Section */}
          {!showForm && (
            <div className="text-center mb-16">
              <Button
                onClick={() => setShowForm(true)}
                variant="hero"
                size="xl"
                className="text-lg sm:text-xl px-8 sm:px-12 py-5 sm:py-6 w-full sm:w-auto"
              >
                <Video className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                Criar Link Privado
                <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 ml-2" />
              </Button>

              <p className="text-sm text-muted-foreground mt-4">
                Gratuito • Sem cadastro • Links instantâneos
              </p>
            </div>
          )}

          {/* Video Form */}
          {showForm && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  ← Voltar
                </Button>
              </div>
              <VideoFormProduction onVideoCreated={handleVideoCreated} />
            </div>
          )}

          {/* Features Section */}
          {!showForm && (
            <div className="space-y-12">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground mb-3">
                  Por Que Usar o Link Proibido?
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground">
                  Máxima privacidade e controle sobre seus conteúdos
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
                {features.map((feature, index) => (
                  <Card
                    key={index}
                    className="bg-gradient-card border-border shadow-card hover:shadow-intense transition-all duration-300"
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="flex justify-center">{feature.icon}</div>
                      <h4 className="text-lg sm:text-xl font-heading font-bold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* How it Works */}
              <div className="bg-secondary/30 rounded-xl p-6 sm:p-8 border border-border">
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-6 text-center">
                  Como Funciona
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[1, 2, 3].map((step, idx) => {
                    const steps = [
                      {
                        title: "Cole o Embed",
                        desc: "Adicione o código embed do seu vídeo"
                      },
                      {
                        title: "Gere o Link",
                        desc: "Receba um link privado codificado"
                      },
                      {
                        title: "Compartilhe",
                        desc: "Envie apenas para quem deve ver"
                      }
                    ];

                    return (
                      <div key={idx} className="text-center space-y-2">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto font-bold text-primary-foreground">
                          {step}
                        </div>
                        <h4 className="font-semibold text-foreground">
                          {steps[idx].title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {steps[idx].desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-background/5 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-4">
            <Logo size="sm" />
            <p className="text-sm text-muted-foreground">
              © 2025 Link Proibido. Privacidade e segurança em primeiro lugar.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

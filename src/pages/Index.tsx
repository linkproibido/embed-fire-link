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
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-background/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center space-y-6">
            <Logo size="xl" className="mb-4" />
            <div className="max-w-3xl mx-auto space-y-4">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Compartilhamento Privado de Vídeos
              </h2>
              <p className="text-lg text-muted-foreground">
                Crie links privados e seguros para seus vídeos. Sem listagens públicas, sem rastreamento.
                <br />
                <span className="text-primary font-medium">Apenas quem tem o link pode assistir.</span>
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Action Section */}
          {!showForm && (
            <div className="text-center mb-16">
              <Button
                onClick={() => setShowForm(true)}
                variant="hero"
                size="xl"
                className="text-xl px-12 py-6"
              >
                <Video className="w-6 h-6" />
                Criar Link Privado
                <Zap className="w-5 h-5 text-yellow-400" />
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
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">
                  Por Que Usar o Link Proibido?
                </h3>
                <p className="text-muted-foreground">
                  Máxima privacidade e controle sobre seus conteúdos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="bg-gradient-card border-border shadow-card hover:shadow-intense transition-all duration-300">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className="flex justify-center">
                        {feature.icon}
                      </div>
                      <h4 className="text-xl font-heading font-bold text-foreground">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* How it Works */}
              <div className="bg-secondary/30 rounded-xl p-8 border border-border">
                <h3 className="text-xl font-heading font-bold text-foreground mb-6 text-center">
                  Como Funciona
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto font-bold text-primary-foreground">
                      1
                    </div>
                    <h4 className="font-semibold text-foreground">Cole o Embed</h4>
                    <p className="text-sm text-muted-foreground">
                      Adicione o código embed do seu vídeo
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto font-bold text-primary-foreground">
                      2
                    </div>
                    <h4 className="font-semibold text-foreground">Gere o Link</h4>
                    <p className="text-sm text-muted-foreground">
                      Receba um link privado codificado
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto font-bold text-primary-foreground">
                      3
                    </div>
                    <h4 className="font-semibold text-foreground">Compartilhe</h4>
                    <p className="text-sm text-muted-foreground">
                      Envie apenas para quem deve ver
                    </p>
                  </div>
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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import VideoForm from "@/components/VideoForm";
import VideoCard from "@/components/VideoCard";
import { Video, Play, Zap } from "lucide-react";

interface VideoData {
  id: string;
  title: string;
  poster_url: string;
  description?: string;
  created_at: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [videos, setVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const { data, error } = await supabase
        .from("movies")
        .select("id, title, poster_url, description, created_at")
        .order("created_at", { ascending: false })
        .limit(12);

      if (error) {
        throw error;
      }

      setVideos(data || []);
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      toast({
        title: "Erro ao carregar vídeos",
        description: "Tente recarregar a página",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVideoCreated = (videoId: string) => {
    fetchVideos();
    setShowForm(false);
    navigate(`/video/${videoId}`);
  };

  const handleViewVideo = (videoId: string) => {
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-background/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-4">
            <Logo size="xl" className="mb-4" />
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Plataforma moderna para compartilhamento de vídeos via embed com links únicos
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Action Section */}
          <div className="text-center mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {!showForm ? (
                <Button
                  onClick={() => setShowForm(true)}
                  variant="hero"
                  size="xl"
                  className="text-xl px-12 py-6"
                >
                  <Video className="w-6 h-6" />
                  Criar Novo Link
                  <Zap className="w-5 h-5 text-yellow-400" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  size="lg"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </div>

          {/* Video Form */}
          {showForm && (
            <div className="mb-12">
              <VideoForm onVideoCreated={handleVideoCreated} />
            </div>
          )}

          {/* Recent Videos Section */}
          {!showForm && (
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
                  Vídeos Recentes
                </h2>
                <p className="text-muted-foreground">
                  Explore os últimos vídeos compartilhados na plataforma
                </p>
              </div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Carregando vídeos...</p>
                </div>
              ) : videos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {videos.map((video) => (
                    <VideoCard
                      key={video.id}
                      id={video.id}
                      title={video.title}
                      posterUrl={video.poster_url}
                      description={video.description}
                      createdAt={video.created_at}
                      onView={handleViewVideo}
                    />
                  ))}
                </div>
              ) : (
                <Card className="bg-gradient-card border-border shadow-card">
                  <CardContent className="text-center py-12">
                    <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2">
                      Nenhum vídeo encontrado
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Seja o primeiro a criar um link de vídeo na plataforma!
                    </p>
                    <Button
                      onClick={() => setShowForm(true)}
                      variant="default"
                      size="lg"
                    >
                      <Play className="w-5 h-5" />
                      Criar Primeiro Vídeo
                    </Button>
                  </CardContent>
                </Card>
              )}
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
              © 2025 Link Proibido. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

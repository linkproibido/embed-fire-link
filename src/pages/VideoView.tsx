import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Calendar, ExternalLink, Share2 } from "lucide-react";
import Logo from "@/components/Logo";

interface Video {
  id: string;
  title: string;
  embed_url: string;
  poster_url: string;
  description?: string;
  created_at: string;
}

const VideoView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchVideo(id);
    }
  }, [id]);

  const fetchVideo = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", videoId)
        .single();

      if (error) {
        throw error;
      }

      setVideo(data);
    } catch (error) {
      console.error("Erro ao buscar vídeo:", error);
      toast({
        title: "Vídeo não encontrado",
        description: "O link solicitado não existe ou foi removido",
        variant: "destructive",
      });
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar link",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleShare = async () => {
    if (navigator.share && video) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description || `Assista: ${video.title}`,
          url: window.location.href,
        });
      } catch (error) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando vídeo...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-bold text-foreground">404</h1>
          <p className="text-muted-foreground">Vídeo não encontrado</p>
          <Button onClick={() => navigate("/")} variant="default">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Início
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="border-b border-border bg-background/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <Logo size="sm" />
          </div>
          
          <div className="flex items-center gap-3">
            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>
            
            <Button onClick={() => navigate("/")} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Voltar
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Video Title and Info */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-tight">
              {video.title}
            </h1>
            
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(video.created_at)}</span>
              </div>
              
              <Badge variant="secondary" className="font-mono">
                ID: {video.id.slice(0, 8)}...
              </Badge>
            </div>

            {video.description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {video.description}
              </p>
            )}
          </div>

          {/* Video Player */}
          <Card className="bg-gradient-card border-border shadow-card overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                {/* Background Image */}
                <div 
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
                  style={{ backgroundImage: `url(${video.poster_url})` }}
                />
                
                {/* Video Embed */}
                <div 
                  className="relative w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: video.embed_url }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button onClick={handleCopyLink} variant="default" size="lg">
              <Copy className="w-5 h-5" />
              Copiar Link
            </Button>
            
            <Button 
              onClick={() => window.open(video.poster_url, '_blank')} 
              variant="outline" 
              size="lg"
            >
              <ExternalLink className="w-5 h-5" />
              Ver Capa Original
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoView;
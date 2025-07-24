import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { decodeVideoId, isValidVideoId } from "@/lib/videoUtils";
import { ArrowLeft, Copy, Calendar, Share2, Eye } from "lucide-react";
import Logo from "@/components/Logo";

interface Video {
  id: string;
  title: string;
  embed_url: string;
  poster_url: string;
  description?: string;
  created_at: string;
}

const VideoViewProduction = () => {
  const { encodedId } = useParams<{ encodedId: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [views, setViews] = useState(0);

  useEffect(() => {
    if (encodedId) {
      const videoId = decodeVideoId(encodedId);
      if (videoId && isValidVideoId(videoId)) {
        fetchVideo(videoId);
      } else {
        setLoading(false);
        toast({
          title: "Link inválido",
          description: "O link fornecido não é válido ou está corrompido",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  }, [encodedId, navigate]);

  const fetchVideo = async (videoId: string) => {
    try {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .eq("id", videoId)
        .maybeSingle();

      if (error) throw error;

      if (!data) {
        toast({
          title: "Vídeo não encontrado",
          description: "O link solicitado não existe ou foi removido",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      setVideo(data);
      setViews(Math.floor(Math.random() * 1000) + 1);
    } catch (error) {
      console.error("Erro ao buscar vídeo:", error);
      toast({
        title: "Erro ao carregar vídeo",
        description: "Tente novamente em alguns instantes",
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
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Carregando vídeo privado...</p>
        </div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-heading font-bold text-foreground">🔒</h1>
          <h2 className="text-2xl font-heading font-bold text-foreground">Link Privado Não Encontrado</h2>
          <p className="text-muted-foreground">Este link não existe ou foi removido</p>
          <Button onClick={() => navigate("/")} variant="default">
            <ArrowLeft className="w-4 h-4" />
            Criar Novo Link
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-border bg-background/10 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div onClick={() => navigate("/")} className="cursor-pointer">
            <Logo size="sm" />
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {views} views
            </Badge>

            <Button onClick={handleShare} variant="outline" size="sm">
              <Share2 className="w-4 h-4" />
              Compartilhar
            </Button>

            <Button onClick={() => navigate("/")} variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Novo Link
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
              <span className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs font-mono">
                LINK PRIVADO
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-heading font-black text-foreground leading-tight">
              {video.title}
            </h1>

            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{formatDate(video.created_at)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-sm">{views} visualizações</span>
              </div>
            </div>

            {video.description && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {video.description}
              </p>
            )}
          </div>

          <Card className="bg-gradient-card border-border shadow-intense overflow-hidden">
            <CardContent className="p-0">
              <div className="relative w-full" style={{ aspectRatio: "16/9" }}>
                <div
                  className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${video.poster_url})` }}
                />
                <div className="absolute inset-0 bg-black/40" />

                <div
                  className="relative w-full h-full flex items-center justify-center"
                  dangerouslySetInnerHTML={{ __html: video.embed_url }}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button onClick={handleCopyLink} variant="default" size="lg">
              <Copy className="w-5 h-5" />
              Copiar Link Privado
            </Button>
          </div>

          <div className="mt-8 flex justify-center">
            <a href="https://vazadinhas.fun" target="_blank" rel="noopener noreferrer">
              <img
                src="/990740f02543377f01a6fcac1d1d6927.gif"
                alt="Acesse Vazadinhas.Fun"
                className="w-[300px] h-auto rounded-lg shadow-lg"
              />
            </a>
          </div>

          <div className="mt-12 p-6 bg-secondary/50 rounded-lg border border-border text-center">
            <h3 className="font-heading font-bold text-foreground mb-2">🔒 Link Privado</h3>
            <p className="text-sm text-muted-foreground">
              Este é um link privado. Somente quem possui este endereço pode acessar este conteúdo.
              <br />
              Não aparece em buscadores nem na página principal.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VideoViewProduction;

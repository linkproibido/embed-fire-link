import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, VideoIcon } from "lucide-react";

interface VideoFormProps {
  onVideoCreated: (videoId: string) => void;
}

const VideoForm = ({ onVideoCreated }: VideoFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    embedUrl: "",
    posterUrl: "",
    description: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.embedUrl || !formData.posterUrl) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha título, código embed e URL da capa",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("movies")
        .insert([
          {
            title: formData.title,
            embed_url: formData.embedUrl,
            poster_url: formData.posterUrl,
            description: formData.description || null,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Link criado com sucesso!",
        description: "Seu vídeo foi adicionado à plataforma",
      });

      setFormData({
        title: "",
        embedUrl: "",
        posterUrl: "",
        description: ""
      });

      onVideoCreated(data.id);
    } catch (error) {
      console.error("Erro ao criar vídeo:", error);
      toast({
        title: "Erro ao criar link",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-heading">
          <VideoIcon className="w-8 h-8 text-primary" />
          Criar Novo Link
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground font-medium">
              Título do Vídeo *
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Digite o título do vídeo"
              className="bg-input border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="embedUrl" className="text-foreground font-medium">
              Código Embed *
            </Label>
            <Textarea
              id="embedUrl"
              value={formData.embedUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, embedUrl: e.target.value }))}
              placeholder="Cole aqui o código embed do vídeo (iframe, script, etc.)"
              className="bg-input border-border focus:border-primary transition-colors min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="posterUrl" className="text-foreground font-medium">
              URL da Capa *
            </Label>
            <Input
              id="posterUrl"
              type="url"
              value={formData.posterUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, posterUrl: e.target.value }))}
              placeholder="https://exemplo.com/imagem.jpg"
              className="bg-input border-border focus:border-primary transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground font-medium">
              Descrição (Opcional)
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Adicione uma descrição para o vídeo"
              className="bg-input border-border focus:border-primary transition-colors"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            variant="hero"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Criando Link...
              </>
            ) : (
              "Gerar Link"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoForm;
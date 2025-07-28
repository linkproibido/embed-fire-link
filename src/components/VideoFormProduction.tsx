import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { generateShareableLink } from "@/lib/videoUtils";
import { Loader2, VideoIcon, ExternalLink, Copy, CheckCircle } from "lucide-react";

interface VideoFormProps {
  onVideoCreated?: (videoId: string) => void;
}

const VideoForm = ({ onVideoCreated }: VideoFormProps) => {
  const [loading, setLoading] = useState(false);
  const [createdLink, setCreatedLink] = useState<string | null>(null);
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
      // Primeiro, autentica como usuário anônimo
      const { data: authData, error: authError } = await supabase.auth.signInAnonymously();
      
      if (authError) {
        console.error("Erro de autenticação:", authError);
      }

      const { data, error } = await supabase
        .from("doramas")
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

      const shareableLink = generateShareableLink(data.id);
      setCreatedLink(shareableLink);

      toast({
        title: "Link criado com sucesso!",
        description: "Seu link privado foi gerado",
      });

      setFormData({
        title: "",
        embedUrl: "",
        posterUrl: "",
        description: ""
      });

      onVideoCreated?.(data.id);
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

  const handleCopyLink = async () => {
    if (!createdLink) return;
    
    try {
      await navigator.clipboard.writeText(createdLink);
      toast({
        title: "Link copiado!",
        description: "O link foi copiado para a área de transferência",
      });
    } catch (error) {
      toast({
        title: "Erro ao copiar",
        description: "Tente novamente",
        variant: "destructive",
      });
    }
  };

  const handleNewVideo = () => {
    setCreatedLink(null);
  };

  // Se um link foi criado, mostra a tela de sucesso
  if (createdLink) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border shadow-card">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl font-heading">
            <CheckCircle className="w-8 h-8 text-success" />
            Link Criado!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Seu link privado foi gerado com sucesso. Compartilhe apenas com quem você desejar.
            </p>
            
            <div className="p-4 bg-secondary rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">Link Privado:</p>
              <div className="flex items-center gap-2">
                <Input
                  value={createdLink}
                  readOnly
                  className="font-mono text-sm bg-input"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="sm"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => window.open(createdLink, '_blank')}
              variant="default"
              size="lg"
              className="flex-1"
            >
              <ExternalLink className="w-5 h-5" />
              Visualizar Vídeo
            </Button>
            
            <Button
              onClick={handleNewVideo}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Criar Novo Link
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formulário de criação
  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-card border-border shadow-card">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl font-heading">
          <VideoIcon className="w-8 h-8 text-primary" />
          Criar Link Privado
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-2">
          Crie um link privado para compartilhar seu vídeo com segurança
        </p>
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
              "Gerar Link Privado"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VideoForm;
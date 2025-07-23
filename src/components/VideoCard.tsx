import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Calendar, Copy, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface VideoCardProps {
  id: string;
  title: string;
  posterUrl: string;
  description?: string;
  createdAt: string;
  onView: (id: string) => void;
}

const VideoCard = ({ id, title, posterUrl, description, createdAt, onView }: VideoCardProps) => {
  const videoUrl = `${window.location.origin}/video/${id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Card className="bg-gradient-card border-border shadow-card hover:shadow-intense transition-all duration-300 group overflow-hidden">
      <div className="relative">
        <img
          src={posterUrl}
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='central' text-anchor='middle' fill='%23ff0000' font-size='20'%3EImagem não encontrada%3C/text%3E%3C/svg%3E";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-2">
          <h3 className="font-heading font-bold text-lg text-foreground line-clamp-2">
            {title}
          </h3>
          
          {description && (
            <p className="text-muted-foreground text-sm line-clamp-2">
              {description}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => onView(id)}
            variant="default"
            size="sm"
            className="flex-1"
          >
            <Eye className="w-4 h-4" />
            Visualizar
          </Button>
          
          <Button
            onClick={handleCopyLink}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Copy className="w-4 h-4" />
            Copiar Link
          </Button>
        </div>

        <div className="pt-2 border-t border-border">
          <Badge variant="secondary" className="text-xs font-mono">
            ID: {id.slice(0, 8)}...
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoCard;
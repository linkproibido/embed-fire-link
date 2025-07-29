import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Edit, Trash2, ArrowLeft, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Dorama {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  embed_url: string;
  tags: string[];
  created_at: string;
}

const DoramaManagement = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [doramas, setDoramas] = useState<Dorama[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingDorama, setEditingDorama] = useState<Dorama | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    embed_url: '',
    tags: ''
  });

  useEffect(() => {
    checkAuth();
    loadDoramas();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/auth');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('user_id', user.id)
      .single();

    if (!profile?.is_admin) {
      toast({
        title: "Acesso negado",
        description: "Você não tem permissão para acessar esta área",
        variant: "destructive",
      });
      navigate('/');
      return;
    }

    setUser(user);
  };

  const loadDoramas = async () => {
    try {
      const { data, error } = await supabase
        .from('doramas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDoramas(data || []);
    } catch (error) {
      console.error('Error loading doramas:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar doramas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const tagsArray = formData.tags
        ? formData.tags.split(',').map(tag => tag.trim())
        : [];

      const doramaData = {
        title: formData.title,
        description: formData.description,
        poster_url: formData.poster_url,
        embed_url: formData.embed_url,
        tags: tagsArray
      };

      if (editingDorama) {
        const { error } = await supabase
          .from('doramas')
          .update(doramaData)
          .eq('id', editingDorama.id);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Dorama atualizado com sucesso",
        });
      } else {
        const { error } = await supabase
          .from('doramas')
          .insert(doramaData);

        if (error) throw error;
        toast({
          title: "Sucesso",
          description: "Dorama criado com sucesso",
        });
      }

      setEditingDorama(null);
      setIsCreating(false);
      setFormData({ title: '', description: '', poster_url: '', embed_url: '', tags: '' });
      loadDoramas();
    } catch (error) {
      console.error('Error saving dorama:', error);
      toast({
        title: "Erro",
        description: "Erro ao salvar dorama",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (dorama: Dorama) => {
    setEditingDorama(dorama);
    setFormData({
      title: dorama.title,
      description: dorama.description || '',
      poster_url: dorama.poster_url,
      embed_url: dorama.embed_url,
      tags: dorama.tags?.join(', ') || ''
    });
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este dorama?')) return;

    try {
      const { error } = await supabase
        .from('doramas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Sucesso",
        description: "Dorama excluído com sucesso",
      });
      loadDoramas();
    } catch (error) {
      console.error('Error deleting dorama:', error);
      toast({
        title: "Erro",
        description: "Erro ao excluir dorama",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    setEditingDorama(null);
    setIsCreating(false);
    setFormData({ title: '', description: '', poster_url: '', embed_url: '', tags: '' });
  };

  const startCreating = () => {
    setIsCreating(true);
    setEditingDorama(null);
    setFormData({ title: '', description: '', poster_url: '', embed_url: '', tags: '' });
  };

  if (loading) {
    return <div className="min-h-screen bg-gradient-dark flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      <header className="border-b border-border/40 backdrop-blur-sm bg-card/80">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <h1 className="text-xl font-heading font-bold">Gerenciar Doramas</h1>
            </div>
            <div className="flex gap-2">
              <Button onClick={startCreating} disabled={isCreating || !!editingDorama}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Dorama
              </Button>
              <Button variant="outline" onClick={() => supabase.auth.signOut()}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          {(isCreating || editingDorama) && (
            <Card className="bg-card/60 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle>
                  {editingDorama ? 'Editar Dorama' : 'Criar Novo Dorama'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Título</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Título do dorama"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Descrição</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descrição do dorama"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">URL do Poster</label>
                  <Input
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    placeholder="https://exemplo.com/poster.jpg"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">URL do Vídeo (Embed)</label>
                  <Input
                    value={formData.embed_url}
                    onChange={(e) => setFormData({ ...formData, embed_url: e.target.value })}
                    placeholder="https://exemplo.com/embed/video"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Tags (separadas por vírgula)</label>
                  <Input
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="romance, comédia, drama"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleSave} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* List Section */}
          <Card className="bg-card/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>Doramas Cadastrados ({doramas.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {doramas.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  Nenhum dorama cadastrado
                </p>
              ) : (
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {doramas.map((dorama) => (
                    <div key={dorama.id} className="border border-border rounded-lg p-4">
                      <div className="flex gap-4">
                        <img
                          src={dorama.poster_url}
                          alt={dorama.title}
                          className="w-16 h-20 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{dorama.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {dorama.description}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {dorama.tags?.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(dorama)}
                            disabled={isCreating || !!editingDorama}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(dorama.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DoramaManagement;
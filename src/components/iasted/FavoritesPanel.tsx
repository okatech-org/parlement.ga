import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star, Trash2, Copy, Search, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface FavoriteResponse {
  id: string;
  message_id: string;
  content: string;
  title: string | null;
  category: string | null;
  created_at: string;
}

interface FavoritesPanelProps {
  userId: string;
  onInsertFavorite?: (content: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const FavoritesPanel: React.FC<FavoritesPanelProps> = ({
  userId,
  onInsertFavorite,
  isOpen,
  onClose,
}) => {
  const [favorites, setFavorites] = useState<FavoriteResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && userId) {
      fetchFavorites();
    }
  }, [isOpen, userId]);

  const fetchFavorites = async () => {
    try {
      const { data, error } = await supabase
        .from('favorite_responses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      toast.error('Erreur lors du chargement des favoris');
    } finally {
      setLoading(false);
    }
  };

  const deleteFavorite = async (id: string) => {
    try {
      const { error } = await supabase
        .from('favorite_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFavorites(prev => prev.filter(f => f.id !== id));
      toast.success('Favori supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success('Copié dans le presse-papier');
    } catch (error) {
      toast.error('Erreur lors de la copie');
    }
  };

  const filteredFavorites = favorites.filter(f =>
    f.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = [...new Set(favorites.filter(f => f.category).map(f => f.category))];

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className="fixed right-0 top-0 h-full w-80 bg-background border-l border-border shadow-xl z-50"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning fill-warning" />
              <h2 className="font-semibold">Réponses favorites</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-muted transition-colors"
            >
              ✕
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 text-sm"
            />
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="px-4 py-2 flex gap-2 flex-wrap border-b border-border">
            {categories.map(cat => (
              <Badge
                key={cat}
                variant="outline"
                className="cursor-pointer hover:bg-primary/10"
                onClick={() => setSearchQuery(cat || '')}
              >
                {cat}
              </Badge>
            ))}
          </div>
        )}

        {/* Favorites List */}
        <ScrollArea className="flex-1 p-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : filteredFavorites.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="w-12 h-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">
                {searchQuery ? 'Aucun résultat' : 'Aucun favori sauvegardé'}
              </p>
              <p className="text-xs mt-1">
                Cliquez sur ⭐ sur une réponse pour la sauvegarder
              </p>
            </div>
          ) : (
            <AnimatePresence>
              <div className="space-y-3">
                {filteredFavorites.map((fav) => (
                  <motion.div
                    key={fav.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg border bg-muted/30 hover:bg-muted/50 transition-colors group"
                  >
                    {fav.title && (
                      <div className="font-medium text-sm mb-1">{fav.title}</div>
                    )}
                    {fav.category && (
                      <Badge variant="secondary" className="text-[10px] mb-2">
                        {fav.category}
                      </Badge>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {fav.content}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                      <span className="text-[10px] text-muted-foreground">
                        {new Date(fav.created_at).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => copyToClipboard(fav.content)}
                          className="p-1.5 rounded hover:bg-background transition-colors"
                          title="Copier"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        {onInsertFavorite && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              onInsertFavorite(fav.content);
                              onClose();
                            }}
                            className="h-7 text-xs"
                          >
                            Utiliser
                          </Button>
                        )}
                        <button
                          onClick={() => deleteFavorite(fav.id)}
                          className="p-1.5 rounded hover:bg-destructive/10 text-destructive transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </ScrollArea>

        {/* Stats */}
        <div className="p-3 border-t border-border text-center text-xs text-muted-foreground">
          {favorites.length} favori{favorites.length !== 1 ? 's' : ''} sauvegardé{favorites.length !== 1 ? 's' : ''}
        </div>
      </div>
    </motion.div>
  );
};

export default FavoritesPanel;

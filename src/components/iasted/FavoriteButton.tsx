import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FavoriteButtonProps {
  messageId: string;
  content: string;
  sessionId?: string;
  userId?: string;
  isFavorited?: boolean;
  onFavoriteChange?: (isFavorited: boolean) => void;
}

const CATEGORIES = [
  'Législation',
  'Démarches administratives',
  'Informations générales',
  'Assistance technique',
  'Documents officiels',
  'Autre',
];

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  messageId,
  content,
  sessionId,
  userId,
  isFavorited: initialFavorited = false,
  onFavoriteChange,
}) => {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!userId) {
      toast.error('Vous devez être connecté pour sauvegarder des favoris');
      return;
    }

    if (isFavorited) {
      // Remove from favorites
      try {
        const { error } = await supabase
          .from('favorite_responses')
          .delete()
          .eq('message_id', messageId)
          .eq('user_id', userId);

        if (error) throw error;

        setIsFavorited(false);
        onFavoriteChange?.(false);
        toast.success('Retiré des favoris');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    } else {
      // Open dialog to add to favorites
      setIsDialogOpen(true);
    }
  };

  const handleSave = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('favorite_responses').insert({
        user_id: userId,
        message_id: messageId,
        session_id: sessionId || null,
        content,
        title: title.trim() || null,
        category: category || null,
      });

      if (error) throw error;

      setIsFavorited(true);
      onFavoriteChange?.(true);
      setIsDialogOpen(false);
      setTitle('');
      setCategory('');
      toast.success('Ajouté aux favoris');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout aux favoris');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        className={`p-1.5 rounded-md transition-colors ${
          isFavorited
            ? 'text-warning hover:text-warning/80'
            : 'text-muted-foreground hover:text-warning'
        }`}
        title={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        <Star
          className={`w-4 h-4 ${isFavorited ? 'fill-warning' : ''}`}
        />
      </motion.button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Star className="w-5 h-5 text-warning" />
              Sauvegarder dans les favoris
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre (optionnel)</Label>
              <Input
                id="title"
                placeholder="Donnez un titre à ce favori..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Catégorie (optionnel)</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une catégorie..." />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground max-h-[100px] overflow-y-auto">
              {content.slice(0, 200)}{content.length > 200 ? '...' : ''}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? 'Enregistrement...' : 'Sauvegarder'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FavoriteButton;

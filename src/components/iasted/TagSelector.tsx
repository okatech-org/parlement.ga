import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tag, Plus, X, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface ConversationTag {
  id: string;
  name: string;
  color: string;
}

interface TagSelectorProps {
  sessionId: string;
  userId: string;
  onTagsChange?: (tags: ConversationTag[]) => void;
}

const TAG_COLORS = [
  { name: 'primary', class: 'bg-primary text-primary-foreground' },
  { name: 'success', class: 'bg-success text-success-foreground' },
  { name: 'warning', class: 'bg-warning text-warning-foreground' },
  { name: 'info', class: 'bg-info text-info-foreground' },
  { name: 'destructive', class: 'bg-destructive text-destructive-foreground' },
];

export const TagSelector: React.FC<TagSelectorProps> = ({
  sessionId,
  userId,
  onTagsChange,
}) => {
  const [allTags, setAllTags] = useState<ConversationTag[]>([]);
  const [sessionTags, setSessionTags] = useState<ConversationTag[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState('primary');
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchTags();
    }
  }, [userId, sessionId]);

  const fetchTags = async () => {
    try {
      // Fetch all user tags
      const { data: tags, error: tagsError } = await supabase
        .from('conversation_tags')
        .select('*')
        .eq('user_id', userId);

      if (tagsError) throw tagsError;
      setAllTags(tags || []);

      // Fetch session tags
      const { data: sessionTagLinks, error: linkError } = await supabase
        .from('conversation_session_tags')
        .select('tag_id')
        .eq('session_id', sessionId);

      if (linkError) throw linkError;

      if (sessionTagLinks && tags) {
        const linkedTagIds = sessionTagLinks.map(l => l.tag_id);
        const linkedTags = tags.filter(t => linkedTagIds.includes(t.id));
        setSessionTags(linkedTags);
        onTagsChange?.(linkedTags);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const createTag = async () => {
    if (!newTagName.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('conversation_tags')
        .insert({
          name: newTagName.trim(),
          color: selectedColor,
          user_id: userId,
        })
        .select()
        .single();

      if (error) throw error;

      setAllTags(prev => [...prev, data]);
      setNewTagName('');
      toast.success(`Tag "${data.name}" créé`);
    } catch (error: any) {
      if (error.code === '23505') {
        toast.error('Ce tag existe déjà');
      } else {
        toast.error('Erreur lors de la création du tag');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = async (tag: ConversationTag) => {
    const isSelected = sessionTags.some(t => t.id === tag.id);

    try {
      if (isSelected) {
        // Remove tag
        const { error } = await supabase
          .from('conversation_session_tags')
          .delete()
          .eq('session_id', sessionId)
          .eq('tag_id', tag.id);

        if (error) throw error;

        const newTags = sessionTags.filter(t => t.id !== tag.id);
        setSessionTags(newTags);
        onTagsChange?.(newTags);
      } else {
        // Add tag
        const { error } = await supabase
          .from('conversation_session_tags')
          .insert({
            session_id: sessionId,
            tag_id: tag.id,
          });

        if (error) throw error;

        const newTags = [...sessionTags, tag];
        setSessionTags(newTags);
        onTagsChange?.(newTags);
      }
    } catch (error) {
      console.error('Error toggling tag:', error);
      toast.error('Erreur lors de la modification');
    }
  };

  const deleteTag = async (tag: ConversationTag, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('conversation_tags')
        .delete()
        .eq('id', tag.id);

      if (error) throw error;

      setAllTags(prev => prev.filter(t => t.id !== tag.id));
      setSessionTags(prev => prev.filter(t => t.id !== tag.id));
      toast.success('Tag supprimé');
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const getColorClass = (color: string) => {
    return TAG_COLORS.find(c => c.name === color)?.class || TAG_COLORS[0].class;
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Display current session tags */}
      <AnimatePresence>
        {sessionTags.map(tag => (
          <motion.div
            key={tag.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Badge className={`${getColorClass(tag.color)} text-xs`}>
              {tag.name}
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Tag selector popover */}
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <Tag className="w-4 h-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-3">
            <div className="text-sm font-medium">Gérer les tags</div>
            
            {/* Existing tags */}
            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {allTags.length === 0 ? (
                <p className="text-xs text-muted-foreground py-2">Aucun tag créé</p>
              ) : (
                allTags.map(tag => {
                  const isSelected = sessionTags.some(t => t.id === tag.id);
                  return (
                    <div
                      key={tag.id}
                      onClick={() => toggleTag(tag)}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        isSelected ? 'bg-primary/10' : 'hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${getColorClass(tag.color)}`} />
                        <span className="text-sm">{tag.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {isSelected && <Check className="w-4 h-4 text-primary" />}
                        <button
                          onClick={(e) => deleteTag(tag, e)}
                          className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Create new tag */}
            <div className="border-t pt-3 space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Nouveau tag..."
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  className="text-sm h-8"
                  onKeyDown={(e) => e.key === 'Enter' && createTag()}
                />
                <Button
                  size="sm"
                  onClick={createTag}
                  disabled={!newTagName.trim() || loading}
                  className="h-8 px-2"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Color selector */}
              <div className="flex gap-1">
                {TAG_COLORS.map(color => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={`w-6 h-6 rounded-full ${color.class} ${
                      selectedColor === color.name ? 'ring-2 ring-offset-2 ring-primary' : ''
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagSelector;

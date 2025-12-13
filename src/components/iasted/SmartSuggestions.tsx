import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, HelpCircle, Building, Users, Sparkles, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Suggestion {
  text: string;
  category: 'legislation' | 'demarches' | 'informations' | 'assistance';
  icon: 'FileText' | 'HelpCircle' | 'Building' | 'Users';
}

interface SmartSuggestionsProps {
  onSuggestionClick: (text: string) => void;
  userId?: string;
}

const iconMap = {
  FileText,
  HelpCircle,
  Building,
  Users,
};

const categoryColors = {
  legislation: 'bg-info/10 text-info border-info/20',
  demarches: 'bg-success/10 text-success border-success/20',
  informations: 'bg-warning/10 text-warning border-warning/20',
  assistance: 'bg-primary/10 text-primary border-primary/20',
};

export const SmartSuggestions: React.FC<SmartSuggestionsProps> = ({
  onSuggestionClick,
  userId,
}) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSuggestions();
  }, [userId]);

  const fetchSuggestions = async () => {
    if (!userId) {
      // Default suggestions for non-authenticated users
      setSuggestions([
        { text: 'Comment fonctionne l\'Assemblée Nationale ?', category: 'informations', icon: 'Building' },
        { text: 'Quels sont les projets de loi en cours ?', category: 'legislation', icon: 'FileText' },
        { text: 'Comment contacter mon député ?', category: 'demarches', icon: 'Users' },
        { text: 'Besoin d\'aide pour une démarche', category: 'assistance', icon: 'HelpCircle' },
      ]);
      setLoading(false);
      return;
    }

    try {
      const { data, error: fnError } = await supabase.functions.invoke('iasted-suggestions', {
        body: { userId },
      });

      if (fnError) {
        console.error('Suggestions error:', fnError);
        setError('Impossible de charger les suggestions');
        return;
      }

      if (data?.suggestions) {
        setSuggestions(data.suggestions);
      }
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="w-5 h-5 animate-spin text-primary" />
        <span className="ml-2 text-sm text-muted-foreground">Chargement des suggestions...</span>
      </div>
    );
  }

  if (error) {
    return null; // Silent fail for suggestions
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Sparkles className="w-3 h-3 text-primary" />
        <span>Suggestions personnalisées</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <AnimatePresence>
          {suggestions.map((suggestion, index) => {
            const IconComponent = iconMap[suggestion.icon] || HelpCircle;
            
            return (
              <motion.button
                key={suggestion.text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => onSuggestionClick(suggestion.text)}
                className={`p-3 rounded-lg border text-left transition-all hover:scale-[1.02] hover:shadow-sm ${categoryColors[suggestion.category]}`}
              >
                <div className="flex items-start gap-2">
                  <IconComponent className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="text-xs leading-tight">{suggestion.text}</span>
                </div>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SmartSuggestions;

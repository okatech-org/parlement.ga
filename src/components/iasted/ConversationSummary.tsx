import React, { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FileText, Loader2, ChevronDown, ChevronUp, CheckCircle, AlertCircle, Target, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ConversationSummaryProps {
  messages: Message[];
  minMessagesForSummary?: number;
}

interface SummaryData {
  summary: string;
  keyPoints: string[];
  topics: string[];
  actionItems: string[];
  sentiment: string;
}

export const ConversationSummary: React.FC<ConversationSummaryProps> = ({
  messages,
  minMessagesForSummary = 6
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const { toast } = useToast();

  const canSummarize = messages.length >= minMessagesForSummary;

  const generateSummary = async () => {
    if (!canSummarize) {
      toast({
        title: "Conversation trop courte",
        description: `Au moins ${minMessagesForSummary} messages sont nécessaires pour générer un résumé.`,
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('conversation-summary', {
        body: { messages }
      });

      if (error) throw error;

      setSummary(data);
      toast({
        title: "Résumé généré",
        description: "La synthèse de votre conversation est prête."
      });
    } catch (error) {
      console.error('Error generating summary:', error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le résumé.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positif':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'négatif':
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <MessageSquare className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positif':
        return 'Positif';
      case 'négatif':
        return 'Négatif';
      default:
        return 'Neutre';
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={generateSummary}
        disabled={isLoading || !canSummarize}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl transition-all ${
          canSummarize
            ? 'neu-raised hover:scale-[1.02] text-foreground'
            : 'opacity-50 cursor-not-allowed bg-muted text-muted-foreground'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <FileText className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isLoading ? 'Génération en cours...' : 'Générer un résumé'}
        </span>
      </button>

      {!canSummarize && (
        <p className="text-xs text-muted-foreground text-center">
          {minMessagesForSummary - messages.length} message(s) supplémentaire(s) requis
        </p>
      )}

      <AnimatePresence>
        {summary && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="neu-inset rounded-xl overflow-hidden"
          >
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-medium">Synthèse de la conversation</span>
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 pt-0 space-y-4"
                >
                  {/* Résumé principal */}
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                    <p className="text-sm leading-relaxed">{summary.summary}</p>
                  </div>

                  {/* Sentiment et sujets */}
                  <div className="flex flex-wrap gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted text-xs">
                      {getSentimentIcon(summary.sentiment)}
                      <span>{getSentimentLabel(summary.sentiment)}</span>
                    </div>
                    {summary.topics?.map((topic, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Points clés */}
                  {summary.keyPoints?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <Target className="w-3 h-3" />
                        Points clés
                      </h4>
                      <ul className="space-y-1.5">
                        {summary.keyPoints.map((point, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Actions */}
                  {summary.actionItems?.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle className="w-3 h-3" />
                        Actions identifiées
                      </h4>
                      <ul className="space-y-1.5">
                        {summary.actionItems.map((action, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 text-sm p-2 rounded-lg bg-success/5 border border-success/10"
                          >
                            <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Star, MessageSquare, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface MessageFeedbackProps {
  messageId: string;
  sessionId?: string;
  onFeedbackSubmitted?: () => void;
}

export const MessageFeedback: React.FC<MessageFeedbackProps> = ({
  messageId,
  sessionId,
  onFeedbackSubmitted,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackType, setFeedbackType] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleQuickFeedback = async (type: 'helpful' | 'not_helpful') => {
    setFeedbackType(type);
    setIsExpanded(true);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Veuillez donner une note');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Vous devez être connecté pour donner un feedback');
        return;
      }

      const { error } = await supabase.from('message_feedback').insert({
        message_id: messageId,
        session_id: sessionId || null,
        user_id: user.id,
        rating,
        feedback_type: feedbackType,
        comment: comment.trim() || null,
      });

      if (error) throw error;

      setSubmitted(true);
      toast.success('Merci pour votre feedback !');
      onFeedbackSubmitted?.();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Erreur lors de l\'envoi du feedback');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-2 text-xs text-success"
      >
        <Check className="w-3 h-3" />
        <span>Feedback enregistré</span>
      </motion.div>
    );
  }

  return (
    <div className="mt-2">
      {!isExpanded ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-1"
        >
          <span className="text-[10px] text-muted-foreground mr-1">Cette réponse était-elle utile ?</span>
          <button
            onClick={() => handleQuickFeedback('helpful')}
            className="p-1 rounded hover:bg-success/10 text-muted-foreground hover:text-success transition-colors"
            title="Utile"
          >
            <ThumbsUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleQuickFeedback('not_helpful')}
            className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Pas utile"
          >
            <ThumbsDown className="w-3 h-3" />
          </button>
        </motion.div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-muted/50 rounded-lg p-3 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Évaluez cette réponse</span>
              <button
                onClick={() => setIsExpanded(false)}
                className="p-1 rounded hover:bg-muted text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </button>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-5 h-5 transition-colors ${
                      star <= (hoverRating || rating)
                        ? 'fill-warning text-warning'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
              <span className="text-xs text-muted-foreground ml-2">
                {rating > 0 && ['', 'Mauvais', 'Passable', 'Correct', 'Bien', 'Excellent'][rating]}
              </span>
            </div>

            {/* Feedback Type */}
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'accurate', label: 'Précise' },
                { value: 'helpful', label: 'Utile' },
                { value: 'inaccurate', label: 'Imprécise' },
                { value: 'not_helpful', label: 'Inutile' },
              ].map((type) => (
                <button
                  key={type.value}
                  onClick={() => setFeedbackType(type.value)}
                  className={`px-2 py-1 rounded-full text-xs transition-colors ${
                    feedbackType === type.value
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border hover:border-primary'
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* Comment */}
            <Textarea
              placeholder="Commentaire optionnel..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="text-xs min-h-[60px] resize-none"
            />

            {/* Submit */}
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-xs h-7"
              >
                Annuler
              </Button>
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={isSubmitting || rating === 0}
                className="text-xs h-7"
              >
                {isSubmitting ? 'Envoi...' : 'Envoyer'}
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default MessageFeedback;

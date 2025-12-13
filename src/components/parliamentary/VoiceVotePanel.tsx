import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mic, MicOff, ThumbsUp, ThumbsDown, Minus, Volume2 } from 'lucide-react';
import { useSpeechTranscription } from '@/hooks/useSpeechTranscription';
import { matchLocalCommand } from '@/utils/local-command-router';
import { toast } from 'sonner';

interface VoiceVotePanelProps {
  amendmentId?: string;
  amendmentTitle?: string;
  onVote?: (vote: 'pour' | 'contre' | 'abstention') => void;
  currentVote?: 'pour' | 'contre' | 'abstention' | null;
}

export const VoiceVotePanel = ({
  amendmentId,
  amendmentTitle,
  onVote,
  currentVote
}: VoiceVotePanelProps) => {
  const [lastRecognized, setLastRecognized] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTranscript = (result: { text: string; isFinal: boolean }) => {
    if (!result.isFinal) return;
    
    setLastRecognized(result.text);
    setIsProcessing(true);

    const command = matchLocalCommand(result.text);
    
    if (command.matched && command.toolName === 'cast_vote') {
      const vote = command.toolArgs?.vote as 'pour' | 'contre' | 'abstention';
      if (vote && onVote) {
        onVote(vote);
        toast.success(command.response || `Vote ${vote} enregistré`);
      }
    } else if (command.matched && command.toolName === 'cancel_vote') {
      toast.info('Annulation du vote demandée');
    }
    
    setIsProcessing(false);
  };

  const {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    toggleListening,
  } = useSpeechTranscription('fr-FR', handleTranscript);

  const getVoteColor = (vote: 'pour' | 'contre' | 'abstention') => {
    switch (vote) {
      case 'pour': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'contre': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'abstention': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    }
  };

  const handleManualVote = (vote: 'pour' | 'contre' | 'abstention') => {
    onVote?.(vote);
    toast.success(`Vote ${vote.toUpperCase()} enregistré`);
  };

  if (!isSupported) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            La reconnaissance vocale n'est pas supportée par ce navigateur.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Volume2 className="h-5 w-5 text-primary" />
          Vote Vocal
        </CardTitle>
        {amendmentTitle && (
          <p className="text-sm text-muted-foreground">{amendmentTitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current vote status */}
        {currentVote && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Vote actuel:</span>
            <Badge className={getVoteColor(currentVote)}>
              {currentVote.toUpperCase()}
            </Badge>
          </div>
        )}

        {/* Voice activation button */}
        <Button
          onClick={toggleListening}
          variant={isListening ? "destructive" : "default"}
          className="w-full gap-2"
          disabled={isProcessing}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              Arrêter l'écoute
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Activer le vote vocal
            </>
          )}
        </Button>

        {/* Voice status */}
        {isListening && (
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-muted-foreground">
              Dites "Pour", "Contre" ou "Abstention"
            </span>
          </div>
        )}

        {/* Last recognized text */}
        {lastRecognized && (
          <div className="text-sm bg-muted/50 p-2 rounded">
            <span className="text-muted-foreground">Reconnu: </span>
            <span className="font-medium">"{lastRecognized}"</span>
          </div>
        )}

        {/* Error display */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        {/* Manual vote buttons */}
        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground mb-3">Ou votez manuellement:</p>
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 ${currentVote === 'pour' ? 'bg-green-500/20 border-green-500' : ''}`}
              onClick={() => handleManualVote('pour')}
            >
              <ThumbsUp className="h-3 w-3" />
              Pour
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 ${currentVote === 'contre' ? 'bg-red-500/20 border-red-500' : ''}`}
              onClick={() => handleManualVote('contre')}
            >
              <ThumbsDown className="h-3 w-3" />
              Contre
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={`gap-1 ${currentVote === 'abstention' ? 'bg-yellow-500/20 border-yellow-500' : ''}`}
              onClick={() => handleManualVote('abstention')}
            >
              <Minus className="h-3 w-3" />
              Abstention
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

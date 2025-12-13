import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Mic, 
  MicOff, 
  FileText, 
  MessageCircleQuestion,
  Save,
  X,
  RotateCcw,
  Volume2,
  Trash2
} from 'lucide-react';
import { useParliamentaryDictation, DictationType } from '@/hooks/useParliamentaryDictation';
import { toast } from 'sonner';

interface DictationPanelProps {
  onSave?: (type: DictationType, content: string) => void;
  defaultType?: DictationType;
}

export const DictationPanel = ({ onSave, defaultType }: DictationPanelProps) => {
  const [selectedType, setSelectedType] = useState<DictationType>(defaultType || null);

  const {
    dictation,
    isListening,
    isSupported,
    error,
    startDictation,
    stopDictation,
    saveDictation,
    cancelDictation,
    addNewLine,
    addPunctuation,
    deleteLastWord,
    readBack,
  } = useParliamentaryDictation();

  const handleStartDictation = (type: DictationType) => {
    setSelectedType(type);
    startDictation(type);
    toast.info(
      type === 'amendment' 
        ? 'Mode dictée d\'amendement activé' 
        : 'Mode dictée de question activé'
    );
  };

  const handleSave = () => {
    const result = saveDictation();
    if (result && result.content) {
      onSave?.(result.type, result.content);
      toast.success('Texte enregistré avec succès');
    } else {
      toast.error('Aucun contenu à enregistrer');
    }
  };

  const handleCancel = () => {
    cancelDictation();
    setSelectedType(null);
    toast.info('Dictée annulée');
  };

  const handleReadBack = () => {
    const text = readBack();
    if (text) {
      // Use Web Speech API for reading back
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      speechSynthesis.speak(utterance);
    }
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
          <Mic className="h-5 w-5 text-primary" />
          Dictée Parlementaire
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Type selection when not active */}
        {!dictation.isActive && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => handleStartDictation('amendment')}
            >
              <FileText className="h-6 w-6 text-primary" />
              <span>Dicter un amendement</span>
            </Button>
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col gap-2"
              onClick={() => handleStartDictation('question')}
            >
              <MessageCircleQuestion className="h-6 w-6 text-primary" />
              <span>Dicter une question</span>
            </Button>
          </div>
        )}

        {/* Active dictation view */}
        {dictation.isActive && (
          <>
            {/* Status bar */}
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="gap-1">
                {dictation.type === 'amendment' ? (
                  <>
                    <FileText className="h-3 w-3" />
                    Amendement
                  </>
                ) : (
                  <>
                    <MessageCircleQuestion className="h-3 w-3" />
                    Question
                  </>
                )}
              </Badge>
              {isListening && (
                <div className="flex items-center gap-2 text-sm text-red-500">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                  </span>
                  Écoute en cours...
                </div>
              )}
            </div>

            {/* Content area */}
            <Textarea
              value={dictation.content}
              readOnly
              className="min-h-[200px] resize-none bg-muted/30"
              placeholder={
                dictation.type === 'amendment'
                  ? "Commencez à dicter votre amendement..."
                  : "Commencez à dicter votre question au gouvernement..."
              }
            />

            {/* Quick punctuation buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addPunctuation('.')}
              >
                Point
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addPunctuation(',')}
              >
                Virgule
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => addPunctuation('?')}
              >
                ?
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={addNewLine}
              >
                ↵ Nouvelle ligne
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={deleteLastWord}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Dernier mot
              </Button>
            </div>

            {/* Control buttons */}
            <div className="flex gap-2">
              <Button
                onClick={isListening ? stopDictation : () => startDictation(dictation.type)}
                variant={isListening ? "destructive" : "secondary"}
                className="flex-1"
              >
                {isListening ? (
                  <>
                    <MicOff className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Mic className="h-4 w-4 mr-2" />
                    Reprendre
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleReadBack}
                title="Relire le texte"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Help text */}
            <p className="text-xs text-muted-foreground">
              💡 Commandes vocales: "Point", "Virgule", "À la ligne", "Nouveau paragraphe"
            </p>
          </>
        )}

        {/* Error display */}
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}
      </CardContent>

      {/* Footer with save/cancel */}
      {dictation.isActive && (
        <CardFooter className="gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleCancel}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            className="flex-1"
            onClick={handleSave}
            disabled={!dictation.content.trim()}
          >
            <Save className="h-4 w-4 mr-2" />
            Enregistrer
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

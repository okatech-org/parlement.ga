import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpeechTranscription } from '@/hooks/useSpeechTranscription';
import { cn } from '@/lib/utils';

interface LiveTranscriptionProps {
  onTranscriptComplete?: (text: string) => void;
  compact?: boolean;
  autoSend?: boolean;
  className?: string;
}

export const LiveTranscription: React.FC<LiveTranscriptionProps> = ({
  onTranscriptComplete,
  compact = false,
  autoSend = false,
  className,
}) => {
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = React.useRef<AudioContext | null>(null);
  const analyserRef = React.useRef<AnalyserNode | null>(null);
  const animationFrameRef = React.useRef<number | null>(null);

  const handleTranscript = (result: { text: string; isFinal: boolean }) => {
    if (result.isFinal && autoSend && result.text.trim()) {
      onTranscriptComplete?.(result.text.trim());
    }
  };

  const {
    isListening,
    transcript,
    interimTranscript,
    toggleListening,
    resetTranscript,
    isSupported,
    error,
  } = useSpeechTranscription('fr-FR', handleTranscript);

  // Audio level visualization
  useEffect(() => {
    if (!isListening) {
      setAudioLevel(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return;
    }

    const startAudioVisualization = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;

        const updateLevel = () => {
          if (!analyserRef.current) return;
          
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          setAudioLevel(average / 255);
          
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        };
        
        updateLevel();
      } catch (err) {
        console.error('Failed to get audio stream:', err);
      }
    };

    startAudioVisualization();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isListening]);

  const handleSend = () => {
    const fullText = (transcript + interimTranscript).trim();
    if (fullText) {
      onTranscriptComplete?.(fullText);
      resetTranscript();
    }
  };

  if (!isSupported) {
    return (
      <div className={cn('text-xs text-muted-foreground', className)}>
        Transcription vocale non supportée
      </div>
    );
  }

  if (compact) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <button
          onClick={toggleListening}
          className={cn(
            'relative p-2 rounded-full transition-all',
            isListening
              ? 'bg-destructive/10 text-destructive'
              : 'bg-primary/10 text-primary hover:bg-primary/20'
          )}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4" />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-destructive"
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </>
          ) : (
            <Mic className="w-4 h-4" />
          )}
        </button>

        <AnimatePresence mode="wait">
          {isListening && (interimTranscript || transcript) && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 min-w-0 overflow-hidden"
            >
              <p className="text-xs truncate">
                <span className="text-foreground">{transcript}</span>
                <span className="text-muted-foreground italic">{interimTranscript}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className={cn('neu-raised rounded-lg p-4 space-y-3', className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Transcription en direct</span>
        </div>

        <button
          onClick={toggleListening}
          className={cn(
            'relative p-2.5 rounded-full transition-all',
            isListening
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          )}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          
          {isListening && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-destructive"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </button>
      </div>

      {/* Audio Level Indicator */}
      {isListening && (
        <div className="flex items-center gap-1 h-6">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-full bg-primary"
              initial={{ height: 4 }}
              animate={{
                height: Math.max(4, audioLevel * 24 * Math.random()),
              }}
              transition={{ duration: 0.1 }}
            />
          ))}
        </div>
      )}

      {/* Transcript Display */}
      <div className="min-h-[60px] p-3 rounded-md bg-muted/50">
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : isListening && !transcript && !interimTranscript ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span className="text-xs">En attente de parole...</span>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">
            <span className="text-foreground">{transcript}</span>
            <span className="text-muted-foreground italic">{interimTranscript}</span>
            {!transcript && !interimTranscript && (
              <span className="text-muted-foreground text-xs">
                Cliquez sur le micro pour commencer
              </span>
            )}
          </p>
        )}
      </div>

      {/* Actions */}
      {(transcript || interimTranscript) && (
        <div className="flex gap-2">
          <button
            onClick={resetTranscript}
            className="flex-1 px-3 py-1.5 rounded-md text-xs bg-muted hover:bg-muted/80 transition-colors"
          >
            Effacer
          </button>
          <button
            onClick={handleSend}
            className="flex-1 px-3 py-1.5 rounded-md text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Envoyer
          </button>
        </div>
      )}
    </div>
  );
};

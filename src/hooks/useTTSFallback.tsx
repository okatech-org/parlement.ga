import { useState, useCallback, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TTSFallbackState {
  isProcessing: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  error: string | null;
}

export interface UseTTSFallback {
  state: TTSFallbackState;
  sendMessage: (text: string) => Promise<void>;
  startListening: () => void;
  stopListening: () => void;
  stopSpeaking: () => void;
  clearMessages: () => void;
  setSystemPrompt: (prompt: string) => void;
}

export const useTTSFallback = (initialSystemPrompt?: string): UseTTSFallback => {
  const { toast } = useToast();
  const [state, setState] = useState<TTSFallbackState>({
    isProcessing: false,
    isSpeaking: false,
    isListening: false,
    messages: [],
    error: null,
  });

  const systemPromptRef = useRef(initialSystemPrompt || '');
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognitionAPI) {
      recognitionRef.current = new SpeechRecognitionAPI();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'fr-FR';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        console.log('🎤 Recognized:', transcript);
        sendMessage(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setState(prev => ({ ...prev, isListening: false, error: event.error }));
      };

      recognitionRef.current.onend = () => {
        setState(prev => ({ ...prev, isListening: false }));
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    // Try to find a French voice
    const voices = window.speechSynthesis.getVoices();
    const frenchVoice = voices.find(v => v.lang.startsWith('fr')) || voices[0];
    if (frenchVoice) {
      utterance.voice = frenchVoice;
    }

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;

    setState(prev => ({
      ...prev,
      isProcessing: true,
      error: null,
      messages: [...prev.messages, { role: 'user', content: text }]
    }));

    try {
      const { data, error } = await supabase.functions.invoke('iasted-tts-fallback', {
        body: {
          message: text,
          systemPrompt: systemPromptRef.current,
          conversationHistory: state.messages.slice(-10) // Keep last 10 messages for context
        }
      });

      if (error) throw error;

      const aiResponse = data?.text || 'Désolé, je n\'ai pas compris.';

      setState(prev => ({
        ...prev,
        isProcessing: false,
        messages: [...prev.messages, { role: 'assistant', content: aiResponse }]
      }));

      // Speak the response
      speak(aiResponse);

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      console.error('TTS Fallback error:', errorMessage);
      
      setState(prev => ({
        ...prev,
        isProcessing: false,
        error: errorMessage
      }));

      toast({
        title: 'Erreur',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [state.messages, speak, toast]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !state.isListening) {
      try {
        recognitionRef.current.start();
        setState(prev => ({ ...prev, isListening: true, error: null }));
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, [state.isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis.cancel();
    setState(prev => ({ ...prev, isSpeaking: false }));
  }, []);

  const clearMessages = useCallback(() => {
    setState(prev => ({ ...prev, messages: [] }));
  }, []);

  const setSystemPrompt = useCallback((prompt: string) => {
    systemPromptRef.current = prompt;
  }, []);

  return {
    state,
    sendMessage,
    startListening,
    stopListening,
    stopSpeaking,
    clearMessages,
    setSystemPrompt
  };
};

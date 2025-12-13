import { useState, useCallback, useRef } from 'react';
import { useSpeechTranscription, TranscriptionResult } from './useSpeechTranscription';

export type DictationType = 'amendment' | 'question' | null;

export interface DictationState {
  isActive: boolean;
  type: DictationType;
  content: string;
  paragraphs: string[];
  lastUpdate: Date | null;
}

export interface UseParliamentaryDictationReturn {
  dictation: DictationState;
  isListening: boolean;
  isSupported: boolean;
  error: string | null;
  startDictation: (type: DictationType) => void;
  stopDictation: () => void;
  saveDictation: () => { type: DictationType; content: string } | null;
  cancelDictation: () => void;
  addNewLine: () => void;
  addPunctuation: (punctuation: string) => void;
  deleteLastWord: () => void;
  deleteLastSentence: () => void;
  readBack: () => string;
  resetDictation: () => void;
}

export const useParliamentaryDictation = (): UseParliamentaryDictationReturn => {
  const [dictation, setDictation] = useState<DictationState>({
    isActive: false,
    type: null,
    content: '',
    paragraphs: [],
    lastUpdate: null,
  });

  const contentRef = useRef<string>('');

  const handleTranscript = useCallback((result: TranscriptionResult) => {
    if (!dictation.isActive) return;

    if (result.isFinal) {
      // Process voice commands within dictation
      const text = result.text.toLowerCase().trim();
      
      // Check for inline commands
      if (text === 'à la ligne' || text === 'nouveau paragraphe') {
        setDictation(prev => ({
          ...prev,
          content: prev.content + '\n\n',
          paragraphs: [...prev.paragraphs, prev.content.split('\n\n').pop() || ''],
          lastUpdate: new Date(),
        }));
        return;
      }
      
      if (text === 'point' || text === 'point final') {
        setDictation(prev => ({
          ...prev,
          content: prev.content.trimEnd() + '. ',
          lastUpdate: new Date(),
        }));
        return;
      }
      
      if (text === 'virgule') {
        setDictation(prev => ({
          ...prev,
          content: prev.content.trimEnd() + ', ',
          lastUpdate: new Date(),
        }));
        return;
      }

      if (text === 'point d\'interrogation' || text === 'point interrogation') {
        setDictation(prev => ({
          ...prev,
          content: prev.content.trimEnd() + '? ',
          lastUpdate: new Date(),
        }));
        return;
      }

      if (text === 'deux points') {
        setDictation(prev => ({
          ...prev,
          content: prev.content.trimEnd() + ' : ',
          lastUpdate: new Date(),
        }));
        return;
      }

      if (text === 'point virgule') {
        setDictation(prev => ({
          ...prev,
          content: prev.content.trimEnd() + ' ; ',
          lastUpdate: new Date(),
        }));
        return;
      }

      if (text === 'ouvrir les guillemets' || text === 'guillemet ouvrant') {
        setDictation(prev => ({
          ...prev,
          content: prev.content + '« ',
          lastUpdate: new Date(),
        }));
        return;
      }

      if (text === 'fermer les guillemets' || text === 'guillemet fermant') {
        setDictation(prev => ({
          ...prev,
          content: prev.content.trimEnd() + ' » ',
          lastUpdate: new Date(),
        }));
        return;
      }

      // Regular text - capitalize first letter after period or at start
      let processedText = result.text;
      const currentContent = contentRef.current;
      
      if (currentContent.length === 0 || /[.!?]\s*$/.test(currentContent)) {
        processedText = processedText.charAt(0).toUpperCase() + processedText.slice(1);
      }

      setDictation(prev => {
        const newContent = prev.content + processedText + ' ';
        contentRef.current = newContent;
        return {
          ...prev,
          content: newContent,
          lastUpdate: new Date(),
        };
      });
    }
  }, [dictation.isActive]);

  const {
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechTranscription('fr-FR', handleTranscript);

  const startDictation = useCallback((type: DictationType) => {
    if (!type) return;
    
    setDictation({
      isActive: true,
      type,
      content: '',
      paragraphs: [],
      lastUpdate: new Date(),
    });
    contentRef.current = '';
    resetTranscript();
    startListening();
  }, [startListening, resetTranscript]);

  const stopDictation = useCallback(() => {
    stopListening();
  }, [stopListening]);

  const saveDictation = useCallback(() => {
    if (!dictation.isActive || !dictation.type) return null;
    
    const result = {
      type: dictation.type,
      content: dictation.content.trim(),
    };
    
    stopListening();
    setDictation({
      isActive: false,
      type: null,
      content: '',
      paragraphs: [],
      lastUpdate: null,
    });
    contentRef.current = '';
    
    return result;
  }, [dictation, stopListening]);

  const cancelDictation = useCallback(() => {
    stopListening();
    setDictation({
      isActive: false,
      type: null,
      content: '',
      paragraphs: [],
      lastUpdate: null,
    });
    contentRef.current = '';
  }, [stopListening]);

  const addNewLine = useCallback(() => {
    setDictation(prev => ({
      ...prev,
      content: prev.content + '\n\n',
      lastUpdate: new Date(),
    }));
  }, []);

  const addPunctuation = useCallback((punctuation: string) => {
    setDictation(prev => ({
      ...prev,
      content: prev.content.trimEnd() + punctuation + ' ',
      lastUpdate: new Date(),
    }));
  }, []);

  const deleteLastWord = useCallback(() => {
    setDictation(prev => {
      const words = prev.content.trim().split(/\s+/);
      words.pop();
      const newContent = words.join(' ') + (words.length > 0 ? ' ' : '');
      contentRef.current = newContent;
      return {
        ...prev,
        content: newContent,
        lastUpdate: new Date(),
      };
    });
  }, []);

  const deleteLastSentence = useCallback(() => {
    setDictation(prev => {
      const content = prev.content.trim();
      const lastPeriodIndex = Math.max(
        content.lastIndexOf('.'),
        content.lastIndexOf('?'),
        content.lastIndexOf('!')
      );
      
      if (lastPeriodIndex === -1) {
        contentRef.current = '';
        return { ...prev, content: '', lastUpdate: new Date() };
      }
      
      const secondLastIndex = Math.max(
        content.lastIndexOf('.', lastPeriodIndex - 1),
        content.lastIndexOf('?', lastPeriodIndex - 1),
        content.lastIndexOf('!', lastPeriodIndex - 1)
      );
      
      const newContent = secondLastIndex === -1 
        ? '' 
        : content.substring(0, secondLastIndex + 1) + ' ';
      
      contentRef.current = newContent;
      return { ...prev, content: newContent, lastUpdate: new Date() };
    });
  }, []);

  const readBack = useCallback(() => {
    return dictation.content.trim();
  }, [dictation.content]);

  const resetDictation = useCallback(() => {
    stopListening();
    resetTranscript();
    setDictation({
      isActive: false,
      type: null,
      content: '',
      paragraphs: [],
      lastUpdate: null,
    });
    contentRef.current = '';
  }, [stopListening, resetTranscript]);

  return {
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
    deleteLastSentence,
    readBack,
    resetDictation,
  };
};

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, X, Pause, Play, RotateCcw, Copy, Check, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContinuousDictationProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete?: (text: string) => void;
}

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
    resultIndex: number;
    results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
    length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
    isFinal: boolean;
    length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
    transcript: string;
    confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
    error: string;
}

interface ISpeechRecognition extends EventTarget {
    continuous: boolean;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    onstart: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onend: ((this: ISpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: ISpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onresult: ((this: ISpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

export const ContinuousDictation: React.FC<ContinuousDictationProps> = ({
    isOpen,
    onClose,
    onComplete
}) => {
    const [isListening, setIsListening] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [interimTranscript, setInterimTranscript] = useState('');
    const [duration, setDuration] = useState(0);
    const [wordCount, setWordCount] = useState(0);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const recognitionRef = useRef<ISpeechRecognition | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Initialize speech recognition
    useEffect(() => {
        const SpeechRecognitionClass = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

        if (!SpeechRecognitionClass) {
            toast({
                title: "Non supporté",
                description: "La reconnaissance vocale n'est pas supportée par ce navigateur",
                variant: "destructive"
            });
            return;
        }

        const recognition = new SpeechRecognitionClass() as ISpeechRecognition;
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'fr-FR';
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onend = () => {
            setIsListening(false);
            // Auto-restart if not paused
            if (!isPaused && isOpen) {
                try {
                    recognition.start();
                } catch (e) {
                    console.error('Failed to restart recognition:', e);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            if (event.error === 'not-allowed') {
                toast({
                    title: "Accès refusé",
                    description: "Veuillez autoriser l'accès au microphone",
                    variant: "destructive"
                });
            }
        };

        recognition.onresult = (event) => {
            let finalText = '';
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; i++) {
                const result = event.results[i];
                const text = result[0].transcript;

                if (result.isFinal) {
                    finalText += text + ' ';
                } else {
                    interimText += text;
                }
            }

            if (finalText) {
                setTranscript(prev => prev + finalText);
            }
            setInterimTranscript(interimText);
        };

        recognitionRef.current = recognition;

        return () => {
            recognition.stop();
        };
    }, [isOpen, isPaused]);

    // Update word count
    useEffect(() => {
        const words = transcript.trim().split(/\s+/).filter(w => w.length > 0);
        setWordCount(words.length);
    }, [transcript]);

    // Timer for duration
    useEffect(() => {
        if (isListening && !isPaused) {
            timerRef.current = setInterval(() => {
                setDuration(prev => prev + 1);
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isListening, isPaused]);

    const startListening = useCallback(() => {
        if (!recognitionRef.current) return;
        try {
            recognitionRef.current.start();
            setIsPaused(false);
        } catch (e) {
            console.error('Failed to start recognition:', e);
        }
    }, []);

    const pauseListening = useCallback(() => {
        if (!recognitionRef.current) return;
        recognitionRef.current.stop();
        setIsPaused(true);
    }, []);

    const resumeListening = useCallback(() => {
        startListening();
    }, [startListening]);

    const stopAndComplete = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
        if (transcript.trim()) {
            onComplete?.(transcript.trim());
            toast({
                title: "Dictée terminée",
                description: `${wordCount} mots transcrits`
            });
        }
        onClose();
    }, [transcript, wordCount, onComplete, onClose]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
        setInterimTranscript('');
        setDuration(0);
        setWordCount(0);
    }, []);

    const copyToClipboard = useCallback(() => {
        navigator.clipboard.writeText(transcript);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast({
            title: "Copié",
            description: "Le texte a été copié dans le presse-papiers"
        });
    }, [transcript]);

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Auto-start when opening
    useEffect(() => {
        if (isOpen && !isListening && !isPaused) {
            const timer = setTimeout(() => {
                startListening();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                    <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-full ${isListening ? 'bg-destructive/20 animate-pulse' : 'bg-muted'}`}>
                            {isListening ? (
                                <Mic className="w-6 h-6 text-destructive" />
                            ) : (
                                <MicOff className="w-6 h-6 text-muted-foreground" />
                            )}
                        </div>
                        <div>
                            <h2 className="font-semibold text-lg">Mode dictée continue</h2>
                            <p className="text-sm text-muted-foreground">
                                {isListening ? (isPaused ? 'En pause' : 'Écoute en cours...') : 'Prêt à démarrer'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Stats */}
                        <div className="flex items-center gap-4 px-4 py-2 rounded-lg bg-muted/50">
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">Durée</p>
                                <p className="font-mono font-medium">{formatDuration(duration)}</p>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="text-center">
                                <p className="text-xs text-muted-foreground">Mots</p>
                                <p className="font-mono font-medium">{wordCount}</p>
                            </div>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Transcript area */}
                <div className="flex-1 p-6 overflow-hidden">
                    <div className="h-full max-w-4xl mx-auto">
                        <textarea
                            ref={textareaRef}
                            value={transcript + interimTranscript}
                            onChange={(e) => setTranscript(e.target.value)}
                            placeholder="Commencez à parler... Le texte apparaîtra ici en temps réel."
                            className="w-full h-full p-6 rounded-2xl border border-border bg-muted/30 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                        />

                        {/* Interim indicator */}
                        {interimTranscript && (
                            <div className="mt-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm inline-flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                Transcription en cours...
                            </div>
                        )}
                    </div>
                </div>

                {/* Controls */}
                <div className="p-6 border-t border-border bg-background/50">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        {/* Left actions */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={resetTranscript}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                                title="Réinitialiser"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Effacer
                            </button>
                            <button
                                onClick={copyToClipboard}
                                disabled={!transcript}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted hover:bg-muted/80 text-sm disabled:opacity-50 transition-colors"
                                title="Copier"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-success" />
                                ) : (
                                    <Copy className="w-4 h-4" />
                                )}
                                Copier
                            </button>
                        </div>

                        {/* Center - Main control */}
                        <div className="flex items-center gap-4">
                            {isListening ? (
                                <button
                                    onClick={isPaused ? resumeListening : pauseListening}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all ${
                                        isPaused
                                            ? 'bg-success text-success-foreground hover:bg-success/90'
                                            : 'bg-warning text-warning-foreground hover:bg-warning/90'
                                    }`}
                                >
                                    {isPaused ? (
                                        <>
                                            <Play className="w-5 h-5" />
                                            Reprendre
                                        </>
                                    ) : (
                                        <>
                                            <Pause className="w-5 h-5" />
                                            Pause
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={startListening}
                                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-medium transition-all"
                                >
                                    <Mic className="w-5 h-5" />
                                    Démarrer
                                </button>
                            )}
                        </div>

                        {/* Right - Complete button */}
                        <button
                            onClick={stopAndComplete}
                            disabled={!transcript.trim()}
                            className="flex items-center gap-2 px-6 py-3 rounded-full bg-success text-success-foreground hover:bg-success/90 text-sm font-medium disabled:opacity-50 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            Utiliser le texte
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

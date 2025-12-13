import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X, Edit, Save, RotateCcw, Command, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface Shortcut {
    id: string;
    name: string;
    description: string;
    keys: string[];
    action: string;
    enabled: boolean;
}

const DEFAULT_SHORTCUTS: Shortcut[] = [
    {
        id: 'send-message',
        name: 'Envoyer message',
        description: 'Envoyer le message actuel',
        keys: ['Enter'],
        action: 'send',
        enabled: true
    },
    {
        id: 'new-line',
        name: 'Nouvelle ligne',
        description: 'Ajouter une nouvelle ligne',
        keys: ['Shift', 'Enter'],
        action: 'newline',
        enabled: true
    },
    {
        id: 'toggle-voice',
        name: 'Mode vocal',
        description: 'Activer/désactiver le mode vocal',
        keys: ['Ctrl', 'M'],
        action: 'toggle-voice',
        enabled: true
    },
    {
        id: 'open-history',
        name: 'Historique',
        description: 'Ouvrir l\'historique des conversations',
        keys: ['Ctrl', 'H'],
        action: 'open-history',
        enabled: true
    },
    {
        id: 'open-search',
        name: 'Recherche sémantique',
        description: 'Ouvrir la recherche dans l\'historique',
        keys: ['Ctrl', 'K'],
        action: 'open-search',
        enabled: true
    },
    {
        id: 'open-templates',
        name: 'Templates',
        description: 'Ouvrir les templates de réponses',
        keys: ['Ctrl', 'T'],
        action: 'open-templates',
        enabled: true
    },
    {
        id: 'open-favorites',
        name: 'Favoris',
        description: 'Ouvrir le panneau des favoris',
        keys: ['Ctrl', 'F'],
        action: 'open-favorites',
        enabled: true
    },
    {
        id: 'new-conversation',
        name: 'Nouvelle conversation',
        description: 'Démarrer une nouvelle conversation',
        keys: ['Ctrl', 'N'],
        action: 'new-conversation',
        enabled: true
    },
    {
        id: 'export-pdf',
        name: 'Exporter PDF',
        description: 'Exporter la conversation en PDF',
        keys: ['Ctrl', 'P'],
        action: 'export-pdf',
        enabled: true
    },
    {
        id: 'dictation-mode',
        name: 'Mode dictée',
        description: 'Ouvrir le mode dictée continue',
        keys: ['Ctrl', 'D'],
        action: 'dictation-mode',
        enabled: true
    },
    {
        id: 'close-modal',
        name: 'Fermer',
        description: 'Fermer la fenêtre iAsted',
        keys: ['Escape'],
        action: 'close',
        enabled: true
    }
];

const STORAGE_KEY = 'iasted-keyboard-shortcuts';

interface KeyboardShortcutsProps {
    isOpen: boolean;
    onClose: () => void;
}

interface KeyboardShortcutsManagerProps {
    onAction: (action: string) => void;
    children: React.ReactNode;
    enabled?: boolean;
}

// Hook to get shortcuts
export const useKeyboardShortcuts = () => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setShortcuts(JSON.parse(saved));
            } catch (e) {
                setShortcuts(DEFAULT_SHORTCUTS);
            }
        } else {
            setShortcuts(DEFAULT_SHORTCUTS);
        }
    }, []);

    return shortcuts;
};

// Manager component that listens for shortcuts
export const KeyboardShortcutsManager: React.FC<KeyboardShortcutsManagerProps> = ({
    onAction,
    children,
    enabled = true
}) => {
    const shortcuts = useKeyboardShortcuts();

    useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            // Don't trigger if typing in an input (except for special shortcuts)
            const target = e.target as HTMLElement;
            const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;

            for (const shortcut of shortcuts) {
                if (!shortcut.enabled) continue;

                const keys = shortcut.keys.map(k => k.toLowerCase());
                const pressedKeys: string[] = [];

                if (e.ctrlKey || e.metaKey) pressedKeys.push('ctrl');
                if (e.shiftKey) pressedKeys.push('shift');
                if (e.altKey) pressedKeys.push('alt');
                pressedKeys.push(e.key.toLowerCase());

                // Check if all required keys are pressed
                const allKeysMatch = keys.every(k => {
                    if (k === 'ctrl') return e.ctrlKey || e.metaKey;
                    if (k === 'shift') return e.shiftKey;
                    if (k === 'alt') return e.altKey;
                    return e.key.toLowerCase() === k.toLowerCase();
                });

                // For shortcuts with modifiers, allow even in inputs
                const hasModifier = keys.includes('ctrl') || keys.includes('alt');
                
                if (allKeysMatch && (hasModifier || !isInput || shortcut.action === 'close')) {
                    e.preventDefault();
                    onAction(shortcut.action);
                    return;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, onAction, enabled]);

    return <>{children}</>;
};

// Settings panel
export const KeyboardShortcuts: React.FC<KeyboardShortcutsProps> = ({
    isOpen,
    onClose
}) => {
    const [shortcuts, setShortcuts] = useState<Shortcut[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [recordingKeys, setRecordingKeys] = useState<string[]>([]);
    const { toast } = useToast();

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                setShortcuts(JSON.parse(saved));
            } catch (e) {
                setShortcuts(DEFAULT_SHORTCUTS);
            }
        } else {
            setShortcuts(DEFAULT_SHORTCUTS);
        }
    }, []);

    const saveShortcuts = (newShortcuts: Shortcut[]) => {
        setShortcuts(newShortcuts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newShortcuts));
    };

    const handleStartEditing = (id: string) => {
        setEditingId(id);
        setRecordingKeys([]);
    };

    const handleKeyRecord = useCallback((e: KeyboardEvent) => {
        if (!editingId) return;

        e.preventDefault();
        e.stopPropagation();

        const keys: string[] = [];
        if (e.ctrlKey || e.metaKey) keys.push('Ctrl');
        if (e.shiftKey) keys.push('Shift');
        if (e.altKey) keys.push('Alt');

        if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
            keys.push(e.key.length === 1 ? e.key.toUpperCase() : e.key);
        }

        if (keys.length > 0) {
            setRecordingKeys(keys);
        }
    }, [editingId]);

    useEffect(() => {
        if (editingId) {
            window.addEventListener('keydown', handleKeyRecord);
            return () => window.removeEventListener('keydown', handleKeyRecord);
        }
    }, [editingId, handleKeyRecord]);

    const handleSaveShortcut = (id: string) => {
        if (recordingKeys.length === 0) {
            setEditingId(null);
            return;
        }

        const newShortcuts = shortcuts.map(s =>
            s.id === id ? { ...s, keys: recordingKeys } : s
        );
        saveShortcuts(newShortcuts);
        setEditingId(null);
        setRecordingKeys([]);
        toast({
            title: "Raccourci modifié",
            description: "Le nouveau raccourci a été enregistré"
        });
    };

    const handleToggleShortcut = (id: string) => {
        const newShortcuts = shortcuts.map(s =>
            s.id === id ? { ...s, enabled: !s.enabled } : s
        );
        saveShortcuts(newShortcuts);
    };

    const handleResetDefaults = () => {
        saveShortcuts(DEFAULT_SHORTCUTS);
        toast({
            title: "Raccourcis réinitialisés",
            description: "Les raccourcis par défaut ont été restaurés"
        });
    };

    const formatKeys = (keys: string[]) => {
        return keys.map(k => {
            if (k === 'Ctrl') return '⌘/Ctrl';
            if (k === 'Shift') return '⇧';
            if (k === 'Alt') return '⌥';
            if (k === 'Enter') return '↵';
            if (k === 'Escape') return 'Esc';
            return k;
        }).join(' + ');
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    className="bg-background border border-border rounded-2xl shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Keyboard className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Raccourcis clavier</h2>
                                <p className="text-xs text-muted-foreground">Personnalisez vos raccourcis iAsted</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleResetDefaults}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm transition-colors"
                            >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Réinitialiser
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Shortcuts list */}
                    <div className="p-4 overflow-y-auto max-h-[60vh]">
                        <div className="space-y-2">
                            {shortcuts.map(shortcut => (
                                <div
                                    key={shortcut.id}
                                    className={`p-3 rounded-xl border transition-colors ${
                                        shortcut.enabled 
                                            ? 'border-border bg-muted/30' 
                                            : 'border-border/50 bg-muted/10 opacity-60'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm">{shortcut.name}</span>
                                                <button
                                                    onClick={() => handleToggleShortcut(shortcut.id)}
                                                    className={`px-1.5 py-0.5 rounded text-[10px] transition-colors ${
                                                        shortcut.enabled
                                                            ? 'bg-success/20 text-success'
                                                            : 'bg-muted text-muted-foreground'
                                                    }`}
                                                >
                                                    {shortcut.enabled ? 'Actif' : 'Inactif'}
                                                </button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {shortcut.description}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {editingId === shortcut.id ? (
                                                <>
                                                    <div className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 min-w-[120px] text-center">
                                                        <span className="font-mono text-sm text-primary">
                                                            {recordingKeys.length > 0
                                                                ? formatKeys(recordingKeys)
                                                                : 'Appuyez...'}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleSaveShortcut(shortcut.id)}
                                                        className="p-1.5 rounded-lg bg-success/10 text-success hover:bg-success/20 transition-colors"
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setRecordingKeys([]);
                                                        }}
                                                        className="p-1.5 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="px-3 py-1.5 rounded-lg bg-muted min-w-[120px] text-center">
                                                        <span className="font-mono text-sm">
                                                            {formatKeys(shortcut.keys)}
                                                        </span>
                                                    </div>
                                                    <button
                                                        onClick={() => handleStartEditing(shortcut.id)}
                                                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                                                        title="Modifier"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer tip */}
                    <div className="p-4 border-t border-border bg-muted/30">
                        <p className="text-xs text-muted-foreground text-center">
                            💡 Cliquez sur le bouton modifier puis appuyez sur la combinaison de touches souhaitée
                        </p>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

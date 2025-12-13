import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, X, Brain, MessageSquare, User, Bot, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface Message {
    id: string;
    content: string;
    role: 'user' | 'assistant';
    created_at: string;
    session_id: string;
}

interface SearchResult {
    index: number;
    message: Message;
    score: number;
}

interface SemanticSearchProps {
    userId: string;
    isOpen: boolean;
    onClose: () => void;
    onSelectMessage?: (message: Message, sessionId: string) => void;
}

export const SemanticSearch: React.FC<SemanticSearchProps> = ({
    userId,
    isOpen,
    onClose,
    onSelectMessage
}) => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [allMessages, setAllMessages] = useState<Message[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const { toast } = useToast();

    // Load all user messages when component opens
    useEffect(() => {
        if (!isOpen || !userId) return;

        const loadMessages = async () => {
            setLoadingMessages(true);
            try {
                // Get all sessions for user
                const { data: sessions } = await supabase
                    .from('conversation_sessions')
                    .select('id')
                    .eq('user_id', userId);

                if (!sessions || sessions.length === 0) {
                    setAllMessages([]);
                    return;
                }

                // Get all messages from these sessions
                const sessionIds = sessions.map(s => s.id);
                const { data: messages, error } = await supabase
                    .from('conversation_messages')
                    .select('*')
                    .in('session_id', sessionIds)
                    .order('created_at', { ascending: false })
                    .limit(500);

                if (error) throw error;
                setAllMessages((messages || []).map(m => ({
                    ...m,
                    role: m.role as 'user' | 'assistant'
                })));
            } catch (error) {
                console.error('Failed to load messages:', error);
                toast({
                    title: "Erreur",
                    description: "Impossible de charger les messages",
                    variant: "destructive"
                });
            } finally {
                setLoadingMessages(false);
            }
        };

        loadMessages();
    }, [isOpen, userId]);

    const handleSearch = async () => {
        if (!query.trim() || allMessages.length === 0) return;

        setIsSearching(true);
        setResults([]);

        try {
            const { data, error } = await supabase.functions.invoke('semantic-search', {
                body: {
                    query: query.trim(),
                    messages: allMessages.slice(0, 100).map(m => ({
                        id: m.id,
                        content: m.content,
                        role: m.role,
                        session_id: m.session_id,
                        created_at: m.created_at
                    }))
                }
            });

            if (error) throw error;

            if (data.results) {
                setResults(data.results);
            } else if (data.error) {
                throw new Error(data.error);
            }
        } catch (error: any) {
            console.error('Search error:', error);
            toast({
                title: "Erreur de recherche",
                description: error.message || "La recherche a échoué",
                variant: "destructive"
            });
        } finally {
            setIsSearching(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSearch();
        }
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
                                <Brain className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Recherche sémantique</h2>
                                <p className="text-xs text-muted-foreground">
                                    {allMessages.length} messages indexés
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-muted rounded-lg transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search input */}
                    <div className="p-4 border-b border-border">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                value={query}
                                onChange={e => setQuery(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Rechercher par sens, concept ou idée..."
                                className="w-full pl-10 pr-20 py-3 rounded-xl border border-border bg-muted/50 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                autoFocus
                            />
                            <button
                                onClick={handleSearch}
                                disabled={isSearching || !query.trim() || loadingMessages}
                                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                            >
                                {isSearching ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    'Rechercher'
                                )}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                            💡 Recherchez par concept : "budget municipal", "réunion du conseil", "projet infrastructure"
                        </p>
                    </div>

                    {/* Results */}
                    <div className="p-4 overflow-y-auto max-h-[50vh]">
                        {loadingMessages ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                <span className="ml-2 text-sm text-muted-foreground">Chargement des messages...</span>
                            </div>
                        ) : results.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                {query.trim() && !isSearching ? (
                                    <>
                                        <Search className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Aucun résultat pour "{query}"</p>
                                        <p className="text-xs mt-1">Essayez d'autres termes ou concepts</p>
                                    </>
                                ) : (
                                    <>
                                        <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>Entrez une recherche</p>
                                        <p className="text-xs mt-1">La recherche sémantique comprend le sens de votre requête</p>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <p className="text-xs text-muted-foreground mb-3">
                                    {results.length} résultat(s) trouvé(s)
                                </p>
                                {results.map((result, idx) => (
                                    <motion.div
                                        key={result.message.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="p-3 rounded-xl border border-border hover:border-primary/30 bg-muted/30 cursor-pointer transition-colors group"
                                        onClick={() => onSelectMessage?.(result.message, result.message.session_id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`p-1.5 rounded-lg ${result.message.role === 'user' ? 'bg-primary/10' : 'bg-success/10'}`}>
                                                {result.message.role === 'user' ? (
                                                    <User className="w-3.5 h-3.5 text-primary" />
                                                ) : (
                                                    <Bot className="w-3.5 h-3.5 text-success" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xs font-medium">
                                                        {result.message.role === 'user' ? 'Vous' : 'iAsted'}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {formatDistanceToNow(new Date(result.message.created_at), {
                                                            addSuffix: true,
                                                            locale: fr
                                                        })}
                                                    </span>
                                                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                                                        {Math.round(result.score * 100)}% pertinent
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground line-clamp-3">
                                                    {result.message.content}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

/**
 * Page iBoîte - Messagerie Interne Complète
 * 
 * Liste des conversations, interface de chat et composition de nouveaux messages.
 * Inclut les dossiers: Boîte de réception, Envoyés, Brouillons, Officiels, Archives
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { iBoiteService } from '@/services/iboite-service';
import { IBoiteRecipientSearch, Recipient } from '@/components/iboite/IBoiteRecipientSearch';
import { IBoiteComposeMessage } from '@/components/iboite/IBoiteComposeMessage';
import { useNerve } from '@/hooks/useNerve'; // Neocortex Hook
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { format, formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
    Plus,
    Search,
    Mail,
    Send,
    Archive,
    Star,
    Trash2,
    MoreVertical,
    Paperclip,
    ChevronLeft,
    Clock,
    CheckCheck,
    Loader2,
    Inbox,
    FolderOpen,
    MessageSquare,
    Edit3,
    SendHorizonal,
    Stamp
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { IBoiteConversation, IBoiteMessage, IBoiteExternalCorrespondence } from '@/types/environments';

// Types de dossiers
type FolderType = 'inbox' | 'sent' | 'drafts' | 'official' | 'archive';

// ============================================================
// COMPOSANTS INTERNES
// ============================================================

interface ConversationItemProps {
    conversation: IBoiteConversation;
    isSelected: boolean;
    onClick: () => void;
}

function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
    const participant = conversation.participants?.[0];
    const displayName = participant?.name || 'Inconnu';
    const initials = displayName
        .split(' ')
        .map(n => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full p-3 flex gap-3 text-left transition-all hover:bg-accent/50 rounded-lg",
                isSelected && "bg-accent"
            )}
        >
            <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={participant?.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                    {initials}
                </AvatarFallback>
            </Avatar>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                    <span className={cn(
                        "font-medium truncate text-sm",
                        conversation.unread_count > 0 && "font-semibold"
                    )}>
                        {displayName}
                    </span>
                    <span className="text-[10px] text-muted-foreground shrink-0">
                        {conversation.updated_at
                            ? formatDistanceToNow(new Date(conversation.updated_at), { addSuffix: true, locale: fr })
                            : ''
                        }
                    </span>
                </div>

                {conversation.subject && (
                    <p className="text-xs text-muted-foreground truncate">
                        {conversation.subject}
                    </p>
                )}

                <p className={cn(
                    "text-xs truncate mt-0.5",
                    conversation.unread_count > 0 ? "text-foreground" : "text-muted-foreground"
                )}>
                    {conversation.last_message?.content || 'Nouvelle conversation'}
                </p>
            </div>

            {conversation.unread_count > 0 && (
                <Badge variant="default" className="h-5 min-w-5 rounded-full text-[10px] shrink-0">
                    {conversation.unread_count}
                </Badge>
            )}
        </button>
    );
}

interface MessageBubbleProps {
    message: IBoiteMessage;
    isOwnMessage: boolean;
}

function MessageBubble({ message, isOwnMessage }: MessageBubbleProps) {
    return (
        <div className={cn(
            "flex gap-2 max-w-[80%]",
            isOwnMessage ? "ml-auto flex-row-reverse" : ""
        )}>
            {!isOwnMessage && (
                <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-muted text-xs">
                        {message.sender_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || '?'}
                    </AvatarFallback>
                </Avatar>
            )}

            <div className={cn(
                "rounded-2xl px-4 py-2",
                isOwnMessage
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted rounded-bl-sm"
            )}>
                {!isOwnMessage && (
                    <p className="text-xs font-medium mb-1 opacity-70">
                        {message.sender_name}
                    </p>
                )}

                <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                <div className={cn(
                    "flex items-center gap-1 mt-1 text-[10px]",
                    isOwnMessage ? "text-primary-foreground/70 justify-end" : "text-muted-foreground"
                )}>
                    <span>{format(new Date(message.created_at), 'HH:mm', { locale: fr })}</span>
                    {isOwnMessage && <CheckCheck className="h-3 w-3" />}
                </div>
            </div>
        </div>
    );
}

// ============================================================
// PAGE PRINCIPALE
// ============================================================

export type IBoiteContext = 'default' | 'congress' | 'cmp' | 'bureau' | 'an' | 'senat';

interface IBoitePageProps {
    context?: IBoiteContext;
    contextLabel?: string;
}

export default function IBoitePage({ context = 'default', contextLabel }: IBoitePageProps) {
    const navigate = useNavigate();

    // États
    const [conversations, setConversations] = useState<IBoiteConversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<IBoiteMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMessages, setIsLoadingMessages] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isComposeOpen, setIsComposeOpen] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [activeFolder, setActiveFolder] = useState<FolderType>('inbox');

    // Charger les données selon le dossier actif
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            setSelectedConversationId(null);

            try {
                const { supabase } = await import('@/integrations/supabase/client');
                const { data: session } = await supabase.auth.getSession();
                if (session?.session?.user?.id) {
                    setCurrentUserId(session.session.user.id);
                }

                // Charger selon le dossier
                switch (activeFolder) {
                    case 'inbox':
                    case 'archive':
                        const convs = await iBoiteService.getConversations({
                            archived: activeFolder === 'archive'
                        });
                        setConversations(convs);
                        break;
                    default:
                        // Pour les autres dossiers, on affiche les conversations pour l'instant
                        const defaultConvs = await iBoiteService.getConversations({ archived: false });
                        setConversations(defaultConvs);
                }
            } catch (error) {
                console.error('[IBoitePage] Error loading data:', error);
                toast.error('Erreur lors du chargement');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [activeFolder]);

    // Charger les messages de la conversation sélectionnée
    useEffect(() => {
        if (!selectedConversationId) {
            setMessages([]);
            return;
        }

        const loadMessages = async () => {
            setIsLoadingMessages(true);
            try {
                const msgs = await iBoiteService.getMessages(selectedConversationId);
                setMessages(msgs.reverse()); // Ordre chronologique

                // Marquer comme lu
                await iBoiteService.markConversationAsRead(selectedConversationId);
            } catch (error) {
                console.error('[IBoitePage] Error loading messages:', error);
                toast.error('Erreur lors du chargement des messages');
            } finally {
                setIsLoadingMessages(false);
            }
        };

        loadMessages();
    }, [selectedConversationId]);

    // Conversation sélectionnée
    const selectedConversation = useMemo(() => {
        return conversations.find(c => c.id === selectedConversationId) || null;
    }, [conversations, selectedConversationId]);

    // Filtrer les conversations
    const filteredConversations = useMemo(() => {
        if (!searchQuery.trim()) return conversations;
        const query = searchQuery.toLowerCase();
        return conversations.filter(c =>
            c.participants?.some(p => p.name?.toLowerCase().includes(query)) ||
            c.subject?.toLowerCase().includes(query) ||
            c.last_message?.content?.toLowerCase().includes(query)
        );
    }, [conversations, searchQuery]);

    // Compteur non lus
    const unreadCount = useMemo(() => {
        return conversations.reduce((acc, c) => acc + (c.unread_count || 0), 0);
    }, [conversations]);

    // Envoyer un message
    // Neocortex Connection
    const { stimulate } = useNerve(
        'COMMUNICATION:MESSAGE_SENT', // Listen for success
        (payload: any, signal) => {
            console.log('✅ [IBoitePage] Message sent confirmed via Cortex', payload);

            // Only update if it pertains to the current conversation
            // In a real scenario we'd check correlationId or payload.message.conversation_id

            const sent = payload.message;
            if (sent) {
                // Add message to local list if not already there (Optimistic UI handled check)
                setMessages(prev => {
                    if (prev.find(m => m.id === sent.id)) return prev;
                    return [...prev, sent];
                });

                // Update conversation view
                setConversations(prev => prev.map(c =>
                    c.id === sent.conversation_id // Assuming payload has conversation_id
                        ? {
                            ...c,
                            last_message: sent,
                            updated_at: sent.created_at
                        }
                        : c
                ));
            }

            setIsSending(false);
            setNewMessage('');
        }
    );

    // Also listen for errors
    useNerve('COMMUNICATION:ERROR', (payload) => {
        console.error('❌ [IBoitePage] Cortex Error:', payload);
        toast.error(`Erreur d'envoi: ${payload.error}`);
        setIsSending(false);
    });

    const handleSendMessage = useCallback(() => {
        if (!newMessage.trim() || !selectedConversationId || isSending) return;

        setIsSending(true);

        // STIMULATION du Cortex Communication au lieu de l'appel Service direct
        stimulate('COMMUNICATION:SEND_MESSAGE', {
            conversationId: selectedConversationId,
            content: newMessage,
            attachments: [] // Attachments support to be added
        });

        // Optimistic UI update could be done here, but let's wait for the actor loop for now to prove it works
        // or just clear the input? No, wait for confirmation to clear input to avoid data loss on error.

    }, [newMessage, selectedConversationId, isSending, stimulate]);

    // Callback après envoi depuis le composer
    const handleMessageSent = useCallback((conversationId: string) => {
        toast.success('Message envoyé');
        setIsComposeOpen(false);

        // Recharger les conversations
        iBoiteService.getConversations({
            archived: activeFolder === 'archive'
        }).then(convs => {
            setConversations(convs);
            if (conversationId !== 'external') {
                setSelectedConversationId(conversationId);
            }
        });
    }, [activeFolder]);

    // Navigation retour (mobile)
    const handleBack = useCallback(() => {
        setSelectedConversationId(null);
    }, []);

    return (
        <div className="h-[calc(100vh-8rem)] flex rounded-2xl overflow-hidden border bg-background/50 backdrop-blur-sm p-6">
            <div className="flex-1 flex rounded-2xl overflow-hidden border">
                {/* Sidebar - Liste des conversations */}
                <div className={cn(
                    "w-full md:w-80 lg:w-96 flex flex-col border-r bg-background/30",
                    selectedConversationId && "hidden md:flex"
                )}>
                    {/* Header */}
                    <div className="p-4 border-b space-y-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Mail className="h-5 w-5 text-primary" />
                                <h1 className="font-bold text-lg">iBoîte</h1>
                                {context !== 'default' && (
                                    <Badge variant="outline" className="text-[10px] bg-primary/5 text-primary border-primary/20">
                                        {contextLabel || context.toUpperCase()}
                                    </Badge>
                                )}
                                {unreadCount > 0 && (
                                    <Badge variant="default" className="h-5 text-xs">
                                        {unreadCount}
                                    </Badge>
                                )}
                            </div>
                            <Button size="sm" onClick={() => setIsComposeOpen(true)}>
                                <Plus className="h-4 w-4 mr-1" />
                                Nouveau
                            </Button>
                        </div>

                        {/* Recherche */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Rechercher..."
                                className="pl-9 bg-muted/50"
                            />
                        </div>

                        {/* Onglets */}
                        <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                            <Button
                                variant={activeFolder === 'inbox' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => setActiveFolder('inbox')}
                            >
                                <Inbox className="h-4 w-4 mr-1" />
                                Boîte
                            </Button>
                            <Button
                                variant={activeFolder === 'sent' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => setActiveFolder('sent')}
                            >
                                <SendHorizonal className="h-4 w-4 mr-1" />
                                Envoyés
                            </Button>
                            <Button
                                variant={activeFolder === 'archive' ? 'secondary' : 'ghost'}
                                size="sm"
                                className="flex-1 h-8"
                                onClick={() => setActiveFolder('archive')}
                            >
                                <Archive className="h-4 w-4 mr-1" />
                                Archives
                            </Button>
                        </div>
                    </div>

                    {/* Liste des conversations */}
                    <ScrollArea className="flex-1">
                        <div className="p-2 space-y-1">
                            {isLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                </div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                                    <MessageSquare className="h-12 w-12 opacity-20 mb-3" />
                                    <p className="text-sm">Aucune conversation</p>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        onClick={() => setIsComposeOpen(true)}
                                    >
                                        Démarrer une conversation
                                    </Button>
                                </div>
                            ) : (
                                filteredConversations.map(conv => (
                                    <ConversationItem
                                        key={conv.id}
                                        conversation={conv}
                                        isSelected={conv.id === selectedConversationId}
                                        onClick={() => setSelectedConversationId(conv.id)}
                                    />
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </div>

                {/* Zone de chat */}
                <div className={cn(
                    "flex-1 flex flex-col",
                    !selectedConversationId && "hidden md:flex"
                )}>
                    {selectedConversation ? (
                        <>
                            {/* Header conversation */}
                            <div className="p-4 border-b flex items-center gap-3">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                    onClick={handleBack}
                                >
                                    <ChevronLeft className="h-5 w-5" />
                                </Button>

                                <Avatar className="h-10 w-10">
                                    <AvatarImage src={selectedConversation.participants?.[0]?.avatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {selectedConversation.participants?.[0]?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold truncate">
                                        {selectedConversation.participants?.[0]?.name || 'Conversation'}
                                    </h2>
                                    {selectedConversation.subject && (
                                        <p className="text-xs text-muted-foreground truncate">
                                            {selectedConversation.subject}
                                        </p>
                                    )}
                                </div>

                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon">
                                            <MoreVertical className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Star className="h-4 w-4 mr-2" />
                                            Marquer comme favori
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Archive className="h-4 w-4 mr-2" />
                                            Archiver
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-destructive">
                                            <Trash2 className="h-4 w-4 mr-2" />
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                {isLoadingMessages ? (
                                    <div className="flex items-center justify-center h-full">
                                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                    </div>
                                ) : messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                        <MessageSquare className="h-12 w-12 opacity-20 mb-3" />
                                        <p className="text-sm">Aucun message</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {messages.map(msg => (
                                            <MessageBubble
                                                key={msg.id}
                                                message={msg}
                                                isOwnMessage={msg.sender_id === currentUserId}
                                            />
                                        ))}
                                    </div>
                                )}
                            </ScrollArea>

                            {/* Zone de saisie */}
                            <div className="p-4 border-t bg-background/50">
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <Paperclip className="h-5 w-5" />
                                    </Button>
                                    <Textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Écrire un message..."
                                        className="resize-none min-h-[44px] max-h-32"
                                        rows={1}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <Button
                                        size="icon"
                                        className="shrink-0"
                                        disabled={!newMessage.trim() || isSending}
                                        onClick={handleSendMessage}
                                    >
                                        {isSending ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            <Send className="h-5 w-5" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                            <Mail className="h-16 w-16 opacity-20 mb-4" />
                            <h2 className="text-xl font-semibold mb-2">iBoîte</h2>
                            <p className="text-sm mb-4">Sélectionnez une conversation ou créez-en une nouvelle</p>
                            <Button onClick={() => setIsComposeOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Nouveau message
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de composition */}
            <IBoiteComposeMessage
                open={isComposeOpen}
                onOpenChange={setIsComposeOpen}
                onSent={handleMessageSent}
                onError={(err) => toast.error(err)}
            />
        </div>
    );
}

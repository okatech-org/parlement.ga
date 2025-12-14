import { supabase } from "@/integrations/supabase/client";

// Types pour les conversations iAsted
export interface IAstedConversation {
    id: string;
    user_id: string;
    title: string | null;
    tags: string[];
    category: string | null;
    is_favorite: boolean;
    is_archived: boolean;
    summary: string | null;
    key_points: any;
    message_count: number;
    last_message_at: string | null;
    is_shared: boolean;
    created_at: string;
    updated_at: string;
}

export interface IAstedMessage {
    id: string;
    conversation_id: string;
    role: "user" | "assistant" | "system";
    content: string;
    content_type: "text" | "audio" | "file";
    attachments: { url: string; name: string; type: string; size: number }[];
    rating: number | null;
    feedback: string | null;
    is_favorite: boolean;
    metadata: any;
    created_at: string;
}

export interface CreateConversationInput {
    title?: string;
    tags?: string[];
    category?: string;
}

export interface CreateMessageInput {
    conversation_id: string;
    role: "user" | "assistant" | "system";
    content: string;
    content_type?: "text" | "audio" | "file";
    attachments?: { url: string; name: string; type: string; size: number }[];
}

// Mode Mock pour développement (si tables pas encore créées)
const USE_MOCK = true; // Passer à false une fois les tables créées

// Storage local pour le mode mock
const STORAGE_KEY = "iasted_conversations";
const MESSAGES_KEY = "iasted_messages";

const getMockConversations = (): IAstedConversation[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveMockConversations = (conversations: IAstedConversation[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
};

const getMockMessages = (): IAstedMessage[] => {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? JSON.parse(stored) : [];
};

const saveMockMessages = (messages: IAstedMessage[]) => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
};

export const iastedService = {
    /**
     * Récupère toutes les conversations de l'utilisateur
     */
    async getConversations(filters?: {
        archived?: boolean;
        favorite?: boolean;
        category?: string;
        search?: string;
    }): Promise<IAstedConversation[]> {
        if (USE_MOCK) {
            let conversations = getMockConversations();

            if (filters?.archived !== undefined) {
                conversations = conversations.filter(c => c.is_archived === filters.archived);
            }
            if (filters?.favorite) {
                conversations = conversations.filter(c => c.is_favorite);
            }
            if (filters?.category) {
                conversations = conversations.filter(c => c.category === filters.category);
            }
            if (filters?.search) {
                const searchLower = filters.search.toLowerCase();
                conversations = conversations.filter(c =>
                    c.title?.toLowerCase().includes(searchLower) ||
                    c.tags.some(t => t.toLowerCase().includes(searchLower))
                );
            }

            return conversations.sort((a, b) =>
                new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
        }

        let query = supabase
            .from('iasted_conversations')
            .select('*')
            .order('updated_at', { ascending: false });

        if (filters?.archived !== undefined) {
            query = query.eq('is_archived', filters.archived);
        }
        if (filters?.favorite) {
            query = query.eq('is_favorite', true);
        }
        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as IAstedConversation[];
    },

    /**
     * Crée une nouvelle conversation
     */
    async createConversation(input: CreateConversationInput): Promise<IAstedConversation> {
        if (USE_MOCK) {
            const newConversation: IAstedConversation = {
                id: crypto.randomUUID(),
                user_id: "mock-user",
                title: input.title || `Conversation du ${new Date().toLocaleDateString('fr-FR')}`,
                tags: input.tags || [],
                category: input.category || null,
                is_favorite: false,
                is_archived: false,
                summary: null,
                key_points: null,
                message_count: 0,
                last_message_at: null,
                is_shared: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            };

            const conversations = getMockConversations();
            conversations.unshift(newConversation);
            saveMockConversations(conversations);

            return newConversation;
        }

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Non authentifié");

        const { data, error } = await supabase
            .from('iasted_conversations')
            .insert({
                user_id: user.id,
                ...input,
            })
            .select()
            .single();

        if (error) throw error;
        return data as IAstedConversation;
    },

    /**
     * Récupère les messages d'une conversation
     */
    async getMessages(conversationId: string): Promise<IAstedMessage[]> {
        if (USE_MOCK) {
            return getMockMessages()
                .filter(m => m.conversation_id === conversationId)
                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        }

        const { data, error } = await supabase
            .from('iasted_messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        return data as IAstedMessage[];
    },

    /**
     * Ajoute un message à une conversation
     */
    async addMessage(input: CreateMessageInput): Promise<IAstedMessage> {
        if (USE_MOCK) {
            const newMessage: IAstedMessage = {
                id: crypto.randomUUID(),
                conversation_id: input.conversation_id,
                role: input.role,
                content: input.content,
                content_type: input.content_type || "text",
                attachments: input.attachments || [],
                rating: null,
                feedback: null,
                is_favorite: false,
                metadata: {},
                created_at: new Date().toISOString(),
            };

            const messages = getMockMessages();
            messages.push(newMessage);
            saveMockMessages(messages);

            // Mettre à jour la conversation
            const conversations = getMockConversations();
            const convIndex = conversations.findIndex(c => c.id === input.conversation_id);
            if (convIndex !== -1) {
                conversations[convIndex].message_count++;
                conversations[convIndex].last_message_at = newMessage.created_at;
                conversations[convIndex].updated_at = newMessage.created_at;

                // Auto-titre si premier message utilisateur
                if (!conversations[convIndex].title && input.role === "user") {
                    conversations[convIndex].title = input.content.slice(0, 50) + (input.content.length > 50 ? "..." : "");
                }

                saveMockConversations(conversations);
            }

            return newMessage;
        }

        const { data, error } = await supabase
            .from('iasted_messages')
            .insert(input)
            .select()
            .single();

        if (error) throw error;
        return data as IAstedMessage;
    },

    /**
     * Met à jour une conversation (titre, tags, favori, etc.)
     */
    async updateConversation(
        id: string,
        updates: Partial<Pick<IAstedConversation, 'title' | 'tags' | 'category' | 'is_favorite' | 'is_archived'>>
    ): Promise<void> {
        if (USE_MOCK) {
            const conversations = getMockConversations();
            const index = conversations.findIndex(c => c.id === id);
            if (index !== -1) {
                conversations[index] = { ...conversations[index], ...updates, updated_at: new Date().toISOString() };
                saveMockConversations(conversations);
            }
            return;
        }

        const { error } = await supabase
            .from('iasted_conversations')
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Supprime une conversation
     */
    async deleteConversation(id: string): Promise<void> {
        if (USE_MOCK) {
            const conversations = getMockConversations().filter(c => c.id !== id);
            saveMockConversations(conversations);

            const messages = getMockMessages().filter(m => m.conversation_id !== id);
            saveMockMessages(messages);
            return;
        }

        const { error } = await supabase
            .from('iasted_conversations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Note un message (feedback)
     */
    async rateMessage(messageId: string, rating: number, feedback?: string): Promise<void> {
        if (USE_MOCK) {
            const messages = getMockMessages();
            const index = messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                messages[index].rating = rating;
                messages[index].feedback = feedback || null;
                saveMockMessages(messages);
            }
            return;
        }

        const { error } = await supabase
            .from('iasted_messages')
            .update({ rating, feedback })
            .eq('id', messageId);

        if (error) throw error;
    },

    /**
     * Marque un message comme favori
     */
    async toggleMessageFavorite(messageId: string): Promise<void> {
        if (USE_MOCK) {
            const messages = getMockMessages();
            const index = messages.findIndex(m => m.id === messageId);
            if (index !== -1) {
                messages[index].is_favorite = !messages[index].is_favorite;
                saveMockMessages(messages);
            }
            return;
        }

        // Pour Supabase, il faudrait d'abord récupérer l'état actuel
        // Simplifié ici
    },

    /**
     * Recherche dans l'historique (texte simple)
     */
    async searchHistory(query: string): Promise<{
        conversations: IAstedConversation[];
        messages: IAstedMessage[];
    }> {
        const queryLower = query.toLowerCase();

        if (USE_MOCK) {
            const conversations = getMockConversations().filter(c =>
                c.title?.toLowerCase().includes(queryLower) ||
                c.tags.some(t => t.toLowerCase().includes(queryLower))
            );

            const messages = getMockMessages().filter(m =>
                m.content.toLowerCase().includes(queryLower)
            );

            return { conversations, messages };
        }

        // Pour Supabase, utiliser la recherche full-text
        const { data: convData } = await supabase
            .from('iasted_conversations')
            .select('*')
            .or(`title.ilike.%${query}%`);

        const { data: msgData } = await supabase
            .from('iasted_messages')
            .select('*')
            .ilike('content', `%${query}%`);

        return {
            conversations: (convData || []) as IAstedConversation[],
            messages: (msgData || []) as IAstedMessage[],
        };
    },

    /**
     * Génère un résumé automatique d'une conversation (placeholder)
     */
    async generateSummary(conversationId: string): Promise<string> {
        const messages = await this.getMessages(conversationId);

        if (messages.length < 5) {
            return "Conversation trop courte pour un résumé.";
        }

        // Placeholder - Dans une vraie implémentation, appeler l'API d'IA
        const userMessages = messages.filter(m => m.role === "user");
        const topics = userMessages.slice(0, 3).map(m => m.content.slice(0, 50));

        return `Cette conversation couvre ${messages.length} échanges. Sujets abordés : ${topics.join("; ")}...`;
    },
};

export default iastedService;

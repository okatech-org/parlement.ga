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

// Storage local pour le mode mock (tables iasted pas encore créées)
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
     * Utilise localStorage car les tables iasted ne sont pas encore créées
     */
    async getConversations(filters?: {
        archived?: boolean;
        favorite?: boolean;
        category?: string;
        search?: string;
    }): Promise<IAstedConversation[]> {
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
    },

    /**
     * Crée une nouvelle conversation
     */
    async createConversation(input: CreateConversationInput): Promise<IAstedConversation> {
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
    },

    /**
     * Récupère les messages d'une conversation
     */
    async getMessages(conversationId: string): Promise<IAstedMessage[]> {
        return getMockMessages()
            .filter(m => m.conversation_id === conversationId)
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    },

    /**
     * Ajoute un message à une conversation
     */
    async addMessage(input: CreateMessageInput): Promise<IAstedMessage> {
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
    },

    /**
     * Met à jour une conversation (titre, tags, favori, etc.)
     */
    async updateConversation(
        id: string,
        updates: Partial<Pick<IAstedConversation, 'title' | 'tags' | 'category' | 'is_favorite' | 'is_archived'>>
    ): Promise<void> {
        const conversations = getMockConversations();
        const index = conversations.findIndex(c => c.id === id);
        if (index !== -1) {
            conversations[index] = { ...conversations[index], ...updates, updated_at: new Date().toISOString() };
            saveMockConversations(conversations);
        }
    },

    /**
     * Supprime une conversation
     */
    async deleteConversation(id: string): Promise<void> {
        const conversations = getMockConversations().filter(c => c.id !== id);
        saveMockConversations(conversations);

        const messages = getMockMessages().filter(m => m.conversation_id !== id);
        saveMockMessages(messages);
    },

    /**
     * Note un message (feedback)
     */
    async rateMessage(messageId: string, rating: number, feedback?: string): Promise<void> {
        const messages = getMockMessages();
        const index = messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            messages[index].rating = rating;
            messages[index].feedback = feedback || null;
            saveMockMessages(messages);
        }
    },

    /**
     * Marque un message comme favori
     */
    async toggleMessageFavorite(messageId: string): Promise<void> {
        const messages = getMockMessages();
        const index = messages.findIndex(m => m.id === messageId);
        if (index !== -1) {
            messages[index].is_favorite = !messages[index].is_favorite;
            saveMockMessages(messages);
        }
    },

    /**
     * Recherche dans l'historique (texte simple)
     */
    async searchHistory(query: string): Promise<{
        conversations: IAstedConversation[];
        messages: IAstedMessage[];
    }> {
        const queryLower = query.toLowerCase();

        const conversations = getMockConversations().filter(c =>
            c.title?.toLowerCase().includes(queryLower) ||
            c.tags.some(t => t.toLowerCase().includes(queryLower))
        );

        const messages = getMockMessages().filter(m =>
            m.content.toLowerCase().includes(queryLower)
        );

        return { conversations, messages };
    },

    /**
     * Génère un résumé automatique d'une conversation (placeholder)
     */
    async generateSummary(conversationId: string): Promise<string> {
        const messages = await this.getMessages(conversationId);

        if (messages.length < 5) {
            return "Conversation trop courte pour un résumé.";
        }

        const userMessages = messages.filter(m => m.role === "user");
        const topics = userMessages.slice(0, 3).map(m => m.content.slice(0, 50));

        return `Cette conversation couvre ${messages.length} échanges. Sujets abordés : ${topics.join("; ")}...`;
    },
};

export default iastedService;

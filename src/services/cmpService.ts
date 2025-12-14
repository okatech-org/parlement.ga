/**
 * Service pour la gestion des CMP (Commissions Mixtes Paritaires)
 * Note: Les tables cmp_sessions, cmp_messages sont créées mais pas encore dans les types générés
 */

import { supabase } from '@/integrations/supabase/client';
import { InstitutionType } from './legislativeService';

export interface CMPMember {
    id: string;
    name: string;
    role?: string;
    institution?: InstitutionType;
}

export interface CMPSession {
    id: string;
    reference: string;
    legislative_text_id: string;
    legislative_text?: {
        id: string;
        reference: string;
        title: string;
        current_location: string;
    };
    assembly_members: CMPMember[];
    senate_members: CMPMember[];
    president_id?: string;
    president_name?: string;
    rapporteur_an_id?: string;
    rapporteur_an_name?: string;
    rapporteur_sn_id?: string;
    rapporteur_sn_name?: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'AGREEMENT' | 'FAILURE';
    agreed_text?: string;
    failure_reason?: string;
    conclusion_vote_for?: number;
    conclusion_vote_against?: number;
    conclusion_vote_abstain?: number;
    convened_at: string;
    started_at?: string;
    concluded_at?: string;
    deadline?: string;
    documents?: any[];
    created_at: string;
    updated_at: string;
}

export interface CMPMessage {
    id: string;
    cmp_session_id: string;
    author_id?: string;
    author_name: string;
    author_institution: InstitutionType;
    author_role?: string;
    content: string;
    message_type: string;
    reply_to_id?: string;
    created_at: string;
}

export interface ConveneCMPInput {
    textId: string;
    assemblyMembers: CMPMember[];
    senateMembers: CMPMember[];
    deadline?: string;
}

export interface ConcludeCMPInput {
    cmpId: string;
    result: 'AGREEMENT' | 'FAILURE';
    agreedText?: string;
    failureReason?: string;
    votes?: {
        for: number;
        against: number;
        abstain: number;
    };
}

// Labels pour les statuts CMP
export const cmpStatusLabels: Record<string, string> = {
    PENDING: 'En attente',
    IN_PROGRESS: 'En cours',
    AGREEMENT: 'Accord trouvé',
    FAILURE: 'Échec',
};

// Client typé pour les tables non générées
const cmpSessionsTable = () => supabase.from('cmp_sessions' as any);
const cmpMessagesTable = () => supabase.from('cmp_messages' as any);
const legislativeTextsTable = () => supabase.from('legislative_texts' as any);

class CMPService {
    /**
     * Récupérer toutes les CMP
     */
    async getCMPs(status?: string): Promise<CMPSession[]> {
        let query = cmpSessionsTable()
            .select(`*, legislative_texts (id, reference, title, current_location)`)
            .order('convened_at', { ascending: false });

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching CMPs:', error);
            throw error;
        }

        return (data?.map((item: any) => ({
            ...item,
            legislative_text: item.legislative_texts
        })) as CMPSession[]) || [];
    }

    /**
     * Récupérer les CMP actives
     */
    async getActiveCMPs(): Promise<CMPSession[]> {
        return this.getCMPs('IN_PROGRESS');
    }

    /**
     * Récupérer une CMP par ID
     */
    async getCMPById(id: string): Promise<CMPSession | null> {
        const { data, error } = await cmpSessionsTable()
            .select(`*, legislative_texts (id, reference, title, current_location, content)`)
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching CMP:', error);
            return null;
        }

        return {
            ...(data as any),
            legislative_text: (data as any).legislative_texts
        } as CMPSession;
    }

    /**
     * Convoquer une nouvelle CMP
     */
    async conveneCMP(input: ConveneCMPInput): Promise<{ success: boolean; cmp_id?: string; reference?: string; error?: string }> {
        // Vérifier la composition
        if (input.assemblyMembers.length !== 7 || input.senateMembers.length !== 7) {
            return { success: false, error: 'La CMP doit compter exactement 7 membres de chaque chambre' };
        }

        const { data, error } = await supabase.functions.invoke('cmp-management?action=convene', {
            body: input,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return data;
    }

    /**
     * Démarrer une CMP
     */
    async startCMP(cmpId: string): Promise<boolean> {
        const { error } = await cmpSessionsTable()
            .update({
                status: 'IN_PROGRESS',
                started_at: new Date().toISOString()
            })
            .eq('id', cmpId);

        if (error) {
            console.error('Error starting CMP:', error);
            return false;
        }

        // Mettre à jour le texte législatif
        const cmp = await this.getCMPById(cmpId);
        if (cmp) {
            await legislativeTextsTable()
                .update({ current_location: 'CMP_IN_PROGRESS' })
                .eq('id', cmp.legislative_text_id);
        }

        return true;
    }

    /**
     * Conclure une CMP
     */
    async concludeCMP(input: ConcludeCMPInput): Promise<{ success: boolean; error?: string }> {
        const { data, error } = await supabase.functions.invoke('cmp-management?action=conclude', {
            body: input,
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return data;
    }

    /**
     * Envoyer un message dans une CMP
     */
    async sendMessage(cmpId: string, content: string, messageType: string = 'MESSAGE', replyToId?: string): Promise<CMPMessage | null> {
        const { data, error } = await supabase.functions.invoke('cmp-management?action=message', {
            body: {
                cmpId,
                content,
                messageType,
                replyToId
            },
        });

        if (error) {
            console.error('Error sending message:', error);
            return null;
        }

        return data?.message;
    }

    /**
     * Récupérer les messages d'une CMP
     */
    async getMessages(cmpId: string, limit: number = 100): Promise<CMPMessage[]> {
        const { data, error } = await cmpMessagesTable()
            .select('*')
            .eq('cmp_session_id', cmpId)
            .order('created_at', { ascending: true })
            .limit(limit);

        if (error) {
            console.error('Error fetching messages:', error);
            throw error;
        }

        return (data as unknown as CMPMessage[]) || [];
    }

    /**
     * S'abonner aux nouveaux messages en temps réel
     */
    subscribeToMessages(cmpId: string, callback: (message: CMPMessage) => void) {
        return supabase
            .channel(`cmp_messages:${cmpId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'cmp_messages',
                    filter: `cmp_session_id=eq.${cmpId}`,
                },
                (payload) => {
                    callback(payload.new as CMPMessage);
                }
            )
            .subscribe();
    }

    /**
     * Vérifier si l'utilisateur est membre d'une CMP
     */
    async isMember(cmpId: string, userId: string): Promise<boolean> {
        const cmp = await this.getCMPById(cmpId);
        if (!cmp) return false;

        const allMembers = [...cmp.assembly_members, ...cmp.senate_members];
        return allMembers.some(m => m.id === userId);
    }

    /**
     * Obtenir les jours restants avant l'échéance
     */
    getDaysRemaining(cmp: CMPSession): number | null {
        if (!cmp.deadline) return null;

        const deadline = new Date(cmp.deadline);
        const now = new Date();
        const diff = deadline.getTime() - now.getTime();

        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    }

    /**
     * Vérifier si une CMP est en retard
     */
    isOverdue(cmp: CMPSession): boolean {
        const remaining = this.getDaysRemaining(cmp);
        return remaining !== null && remaining < 0;
    }
}

export const cmpService = new CMPService();
export default cmpService;
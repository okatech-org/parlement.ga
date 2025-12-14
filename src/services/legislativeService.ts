/**
 * Service pour la gestion des textes législatifs et de la navette parlementaire
 * Note: Les tables legislative_texts, etc. sont créées mais pas encore dans les types générés
 */

import { supabase } from '@/integrations/supabase/client';

// Types
export type InstitutionType = 'ASSEMBLY' | 'SENATE' | 'PARLIAMENT' | 'JOINT';

export type LegislativeLocation =
    | 'AN_DEPOT' | 'AN_BUREAU' | 'AN_COMMISSION' | 'AN_PLENIERE' | 'AN_VOTE' | 'AN_ADOPTED' | 'AN_REJECTED'
    | 'SN_DEPOT' | 'SN_BUREAU' | 'SN_COMMISSION' | 'SN_PLENIERE' | 'SN_VOTE' | 'SN_ADOPTED' | 'SN_REJECTED'
    | 'NAVETTE_AN_TO_SN' | 'NAVETTE_SN_TO_AN'
    | 'CMP_CONVENED' | 'CMP_IN_PROGRESS' | 'CMP_AGREEMENT' | 'CMP_FAILURE'
    | 'FINAL_AN' | 'FINAL_SN' | 'ADOPTED' | 'PROMULGATED' | 'ARCHIVED';

export type TextType =
    | 'PROJET_LOI' | 'PROPOSITION_LOI' | 'PROJET_LOI_FINANCES'
    | 'PROJET_LOI_CONST' | 'RESOLUTION' | 'MOTION' | 'QUESTION_ORALE' | 'QUESTION_ECRITE';

export interface LegislativeText {
    id: string;
    reference: string;
    title: string;
    short_title?: string;
    text_type: TextType;
    origin_institution: InstitutionType;
    current_location: LegislativeLocation;
    content?: string;
    expose_motifs?: string;
    summary?: string;
    author_id?: string;
    author_name?: string;
    co_authors?: any[];
    commission_name?: string;
    rapporteur_name?: string;
    deposited_at: string;
    transmitted_at?: string;
    adopted_at?: string;
    promulgated_at?: string;
    reading_number: number;
    shuttle_count: number;
    version: number;
    urgency: boolean;
    priority_level: number;
    tags?: string[];
    view_count: number;
    comment_count: number;
    created_at: string;
    updated_at: string;
}

export interface ShuttleHistoryEntry {
    id: string;
    legislative_text_id: string;
    from_location: LegislativeLocation;
    to_location: LegislativeLocation;
    transmitted_by?: string;
    transmitted_by_name?: string;
    transmission_note?: string;
    transmitted_at: string;
}

export interface CreateTextInput {
    title: string;
    short_title?: string;
    text_type: TextType;
    origin_institution: InstitutionType;
    content?: string;
    expose_motifs?: string;
    summary?: string;
    commission_name?: string;
    urgency?: boolean;
    tags?: string[];
}

// Labels lisibles pour les localisations
export const locationLabels: Record<LegislativeLocation, string> = {
    AN_DEPOT: 'Dépôt à l\'Assemblée',
    AN_BUREAU: 'Bureau de l\'Assemblée',
    AN_COMMISSION: 'Commission AN',
    AN_PLENIERE: 'Séance plénière AN',
    AN_VOTE: 'Vote en cours AN',
    AN_ADOPTED: 'Adopté par l\'AN',
    AN_REJECTED: 'Rejeté par l\'AN',
    SN_DEPOT: 'Dépôt au Sénat',
    SN_BUREAU: 'Bureau du Sénat',
    SN_COMMISSION: 'Commission Sénat',
    SN_PLENIERE: 'Séance plénière Sénat',
    SN_VOTE: 'Vote en cours Sénat',
    SN_ADOPTED: 'Adopté par le Sénat',
    SN_REJECTED: 'Rejeté par le Sénat',
    NAVETTE_AN_TO_SN: 'En transit vers le Sénat',
    NAVETTE_SN_TO_AN: 'En transit vers l\'AN',
    CMP_CONVENED: 'CMP convoquée',
    CMP_IN_PROGRESS: 'CMP en cours',
    CMP_AGREEMENT: 'Accord CMP',
    CMP_FAILURE: 'Échec CMP',
    FINAL_AN: 'Lecture définitive AN',
    FINAL_SN: 'Lecture définitive Sénat',
    ADOPTED: 'Texte adopté',
    PROMULGATED: 'Loi promulguée',
    ARCHIVED: 'Archivé',
};

// Labels pour les types de texte
export const textTypeLabels: Record<TextType, string> = {
    PROJET_LOI: 'Projet de loi',
    PROPOSITION_LOI: 'Proposition de loi',
    PROJET_LOI_FINANCES: 'Loi de finances',
    PROJET_LOI_CONST: 'Révision constitutionnelle',
    RESOLUTION: 'Résolution',
    MOTION: 'Motion',
    QUESTION_ORALE: 'Question orale',
    QUESTION_ECRITE: 'Question écrite',
};

// Client typé pour les tables non générées
const legislativeTextsTable = () => supabase.from('legislative_texts' as any);
const shuttleHistoryTable = () => supabase.from('legislative_shuttle_history' as any);

class LegislativeService {
    /**
     * Récupérer tous les textes législatifs
     */
    async getTexts(options?: {
        institution?: InstitutionType;
        location?: LegislativeLocation;
        textType?: TextType;
        limit?: number;
        offset?: number;
    }): Promise<LegislativeText[]> {
        let query = legislativeTextsTable()
            .select('*')
            .order('created_at', { ascending: false });

        if (options?.institution) {
            query = query.eq('origin_institution', options.institution);
        }
        if (options?.location) {
            query = query.eq('current_location', options.location);
        }
        if (options?.textType) {
            query = query.eq('text_type', options.textType);
        }
        if (options?.limit) {
            query = query.limit(options.limit);
        }
        if (options?.offset) {
            query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching legislative texts:', error);
            throw error;
        }

        return (data as unknown as LegislativeText[]) || [];
    }

    /**
     * Récupérer les textes en cours (non finalisés)
     */
    async getActiveTexts(institution?: InstitutionType): Promise<LegislativeText[]> {
        const finalLocations: LegislativeLocation[] = ['ADOPTED', 'PROMULGATED', 'ARCHIVED', 'AN_REJECTED', 'SN_REJECTED'];

        let query = legislativeTextsTable()
            .select('*')
            .not('current_location', 'in', `(${finalLocations.join(',')})`)
            .order('updated_at', { ascending: false });

        if (institution) {
            query = query.eq('origin_institution', institution);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching active texts:', error);
            throw error;
        }

        return (data as unknown as LegislativeText[]) || [];
    }

    /**
     * Récupérer les textes en navette
     */
    async getTextsInShuttle(): Promise<LegislativeText[]> {
        const shuttleLocations: LegislativeLocation[] = ['NAVETTE_AN_TO_SN', 'NAVETTE_SN_TO_AN'];

        const { data, error } = await legislativeTextsTable()
            .select('*')
            .in('current_location', shuttleLocations)
            .order('transmitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching shuttle texts:', error);
            throw error;
        }

        return (data as unknown as LegislativeText[]) || [];
    }

    /**
     * Récupérer un texte par ID
     */
    async getTextById(id: string): Promise<LegislativeText | null> {
        const { data, error } = await legislativeTextsTable()
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching text:', error);
            return null;
        }

        // Incrémenter le compteur de vues
        await legislativeTextsTable()
            .update({ view_count: ((data as any)?.view_count || 0) + 1 })
            .eq('id', id);

        return data as unknown as LegislativeText;
    }

    /**
     * Créer un nouveau texte législatif
     */
    async createText(input: CreateTextInput): Promise<LegislativeText> {
        // Générer la référence
        const year = new Date().getFullYear();
        const prefix = input.text_type === 'PROJET_LOI' ? 'PL' :
            input.text_type === 'PROPOSITION_LOI' ? 'PPL' :
                input.text_type === 'PROJET_LOI_FINANCES' ? 'PLF' : 'TXT';

        const { count } = await legislativeTextsTable()
            .select('*', { count: 'exact', head: true })
            .like('reference', `${prefix}-${year}-%`);

        const reference = `${prefix}-${year}-${String((count || 0) + 1).padStart(3, '0')}`;

        const { data, error } = await legislativeTextsTable()
            .insert({
                ...input,
                reference,
                current_location: input.origin_institution === 'ASSEMBLY' ? 'AN_DEPOT' : 'SN_DEPOT',
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating text:', error);
            throw error;
        }

        return data as unknown as LegislativeText;
    }

    /**
     * Mettre à jour un texte
     */
    async updateText(id: string, updates: Partial<LegislativeText>): Promise<LegislativeText> {
        const { data, error } = await legislativeTextsTable()
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating text:', error);
            throw error;
        }

        return data as unknown as LegislativeText;
    }

    /**
     * Transmettre un texte à l'autre chambre
     */
    async transmitText(textId: string, note?: string): Promise<{ success: boolean; error?: string }> {
        const { data, error } = await supabase.functions.invoke('legislative-shuttle', {
            body: { textId, note },
        });

        if (error) {
            return { success: false, error: error.message };
        }

        return data;
    }

    /**
     * Obtenir l'historique de la navette pour un texte
     */
    async getShuttleHistory(textId: string): Promise<ShuttleHistoryEntry[]> {
        const { data, error } = await shuttleHistoryTable()
            .select('*')
            .eq('legislative_text_id', textId)
            .order('transmitted_at', { ascending: false });

        if (error) {
            console.error('Error fetching shuttle history:', error);
            throw error;
        }

        return (data as unknown as ShuttleHistoryEntry[]) || [];
    }

    /**
     * Obtenir les statistiques globales
     */
    async getStats(institution?: InstitutionType): Promise<any> {
        const url = institution
            ? `parliamentary-stats?institution=${institution}`
            : 'parliamentary-stats';

        const { data, error } = await supabase.functions.invoke(url);

        if (error) {
            console.error('Error fetching stats:', error);
            throw error;
        }

        return data?.stats;
    }

    /**
     * Calculer la progression d'un texte
     */
    getTextProgress(text: LegislativeText): number {
        const progressMap: Partial<Record<LegislativeLocation, number>> = {
            AN_DEPOT: 5,
            AN_BUREAU: 10,
            AN_COMMISSION: 20,
            AN_PLENIERE: 30,
            AN_VOTE: 35,
            AN_ADOPTED: 40,
            AN_REJECTED: 100,
            NAVETTE_AN_TO_SN: 45,
            SN_DEPOT: 48,
            SN_BUREAU: 50,
            SN_COMMISSION: 55,
            SN_PLENIERE: 65,
            SN_VOTE: 70,
            SN_ADOPTED: 75,
            SN_REJECTED: 100,
            NAVETTE_SN_TO_AN: 78,
            CMP_CONVENED: 80,
            CMP_IN_PROGRESS: 85,
            CMP_AGREEMENT: 90,
            CMP_FAILURE: 100,
            FINAL_AN: 92,
            FINAL_SN: 95,
            ADOPTED: 98,
            PROMULGATED: 100,
            ARCHIVED: 100,
        };

        return progressMap[text.current_location] || 0;
    }

    /**
     * Vérifier si un texte peut être transmis
     */
    canTransmit(text: LegislativeText): boolean {
        return ['AN_ADOPTED', 'SN_ADOPTED'].includes(text.current_location);
    }

    /**
     * Vérifier si un texte est dans une chambre spécifique
     */
    isAtInstitution(text: LegislativeText, institution: InstitutionType): boolean {
        if (institution === 'ASSEMBLY') {
            return text.current_location.startsWith('AN_') || text.current_location === 'NAVETTE_SN_TO_AN';
        }
        if (institution === 'SENATE') {
            return text.current_location.startsWith('SN_') || text.current_location === 'NAVETTE_AN_TO_SN';
        }
        if (institution === 'PARLIAMENT') {
            return text.current_location.startsWith('CMP_') ||
                ['FINAL_AN', 'FINAL_SN', 'ADOPTED', 'PROMULGATED'].includes(text.current_location);
        }
        return false;
    }
}

export const legislativeService = new LegislativeService();
export default legislativeService;
import { supabase } from "@/integrations/supabase/client";

export type ProvinceCode = 'EST' | 'HOG' | 'MOG' | 'NGO' | 'NYA' | 'OGI' | 'OGL' | 'OGM' | 'WNT';

export interface LocalGrievance {
    id: string;
    source_type: "MAYOR" | "COUNCIL_PRESIDENT" | "CITIZEN" | "PREFECT";
    source_name: string;
    province: string;
    department?: string;
    commune?: string;
    title: string;
    description: string;
    category: "INFRASTRUCTURE" | "EDUCATION" | "HEALTH" | "SECURITY" | "OTHER";
    priority: number;
    status: "PENDING" | "IN_REVIEW" | "ADDRESSED" | "CLOSED";
    created_at: string;
    attachments?: string[];
}

export interface FieldVisit {
    id: string;
    province: string;
    visit_date: string;
    purpose: string;
    observations: string;
    recommendations: string;
    follow_up_required: boolean;
    participants: string[];
}

export interface SenateStats {
    grievancesCount: number;
    pendingGrievances: number;
    fieldVisitsCount: number;
    primaryProvince: string;
}

export const senateService = {
    /**
     * Récupère le profil sénateur de l'utilisateur connecté
     */
    async getSenatorProfile() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('senator_profiles')
            .select('*')
            .eq('profile_id', user.id)
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Récupère les doléances locales, avec filtre optionnel par province
     */
    async getLocalGrievances(province?: string) {
        let query = supabase
            .from('local_grievances')
            .select('*')
            .order('created_at', { ascending: false });

        if (province) {
            query = query.eq('province', province);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as LocalGrievance[];
    },

    /**
     * Crée une nouvelle doléance (simulé pour la démo si pas d'accès écriture public)
     */
    async createGrievance(grievance: Omit<LocalGrievance, 'id' | 'created_at' | 'status'>) {
        const { data, error } = await supabase
            .from('local_grievances')
            .insert({
                ...grievance,
                status: 'PENDING'
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Met à jour le statut d'une doléance
     */
    async updateGrievanceStatus(id: string, status: LocalGrievance['status']) {
        const { error } = await supabase
            .from('local_grievances')
            .update({ status })
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Enregistre un rapport de visite terrain
     */
    async createFieldVisit(visit: Omit<FieldVisit, 'id'>) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        const { data, error } = await supabase
            .from('field_visits')
            .insert({
                ...visit,
                senator_id: user.id
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * Récupère les statistiques globales pour le dashboard sénateur
     */
    async getDashboardStats(): Promise<SenateStats> {
        // Dans une vraie implémentation, on ferait des count() optimisés via RPC
        // Ici on simule avec des requêtes simples
        const { count: grievancesCount } = await supabase
            .from('local_grievances')
            .select('*', { count: 'exact', head: true });

        const { count: pendingGrievances } = await supabase
            .from('local_grievances')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'PENDING');

        const { count: fieldVisitsCount } = await supabase
            .from('field_visits')
            .select('*', { count: 'exact', head: true });

        return {
            grievancesCount: grievancesCount || 0,
            pendingGrievances: pendingGrievances || 0,
            fieldVisitsCount: fieldVisitsCount || 0,
            primaryProvince: "Woleu-Ntem" // À récupérer du profil
        };
    }
};

import { supabase } from "@/integrations/supabase/client";

export type ProvinceCode = 'EST' | 'HOG' | 'MOG' | 'NGO' | 'NYA' | 'OGI' | 'OGL' | 'OGM' | 'WNT';

export interface Province {
    id: number;
    code: string;
    name: string;
    capital: string | null;
    population: number | null;
    surface_area: number | null;
}

export interface LocalGrievance {
    id: string;
    source_type: "MAYOR" | "COUNCIL_PRESIDENT" | "CITIZEN" | "PREFECT";
    source_name: string | null;
    source_contact?: string | null;
    province: string;
    department?: string | null;
    commune?: string | null;
    title: string;
    description: string;
    category: "INFRASTRUCTURE" | "EDUCATION" | "HEALTH" | "SECURITY" | "OTHER" | null;
    priority: number;
    status: "PENDING" | "IN_REVIEW" | "ADDRESSED" | "CLOSED";
    created_at: string;
    updated_at?: string;
    attachments?: string[] | null;
    assigned_senator_id?: string | null;
    response?: string | null;
    addressed_at?: string | null;
}

export interface FieldVisit {
    id: string;
    senator_id: string;
    province: string;
    department?: string | null;
    commune?: string | null;
    specific_location?: string | null;
    visit_date: string;
    duration_hours?: number | null;
    purpose: string;
    observations?: string | null;
    recommendations?: string | null;
    suggestions?: string | null;
    participants?: string[] | null;
    photos?: string[] | null;
    documents?: string[] | null;
    follow_up_required: boolean;
    follow_up_notes?: string | null;
    created_at?: string;
    updated_at?: string;
}

export interface SenatorProfile {
    id: string;
    profile_id: string;
    province: string;
    department?: string | null;
    commune?: string | null;
    canton?: string | null;
    political_group?: string | null;
    mandate_start?: string | null;
    mandate_end?: string | null;
    electoral_college?: string[] | null;
    local_office_address?: string | null;
    local_phone?: string | null;
    laws_examined: number;
    amendments_proposed: number;
    field_visits: number;
    created_at?: string;
    updated_at?: string;
}

export interface SenateStats {
    grievancesCount: number;
    pendingGrievances: number;
    inReviewGrievances: number;
    addressedGrievances: number;
    fieldVisitsCount: number;
    primaryProvince: string;
    grievancesByProvince: Record<string, number>;
    grievancesByCategory: Record<string, number>;
}

export const senateService = {
    /**
     * Récupère la liste des provinces du Gabon
     */
    async getProvinces(): Promise<Province[]> {
        const { data, error } = await supabase
            .from('gabon_provinces')
            .select('*')
            .order('name');

        if (error) throw error;
        return data || [];
    },

    /**
     * Récupère le profil sénateur de l'utilisateur connecté
     */
    async getSenatorProfile(): Promise<SenatorProfile | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('senator_profiles')
            .select('*')
            .eq('profile_id', user.id)
            .maybeSingle();

        if (error) throw error;
        return data as SenatorProfile | null;
    },

    /**
     * Crée ou met à jour le profil sénateur
     */
    async upsertSenatorProfile(profile: Partial<SenatorProfile>): Promise<SenatorProfile> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not authenticated");

        // Check if profile exists
        const { data: existing } = await supabase
            .from('senator_profiles')
            .select('id')
            .eq('profile_id', user.id)
            .maybeSingle();

        if (existing) {
            // Update
            const { data, error } = await supabase
                .from('senator_profiles')
                .update(profile)
                .eq('profile_id', user.id)
                .select()
                .single();
            if (error) throw error;
            return data as SenatorProfile;
        } else {
            // Insert
            const { data, error } = await supabase
                .from('senator_profiles')
                .insert({
                    ...profile,
                    profile_id: user.id,
                    province: profile.province || 'Estuaire'
                })
                .select()
                .single();
            if (error) throw error;
            return data as SenatorProfile;
        }
    },

    /**
     * Récupère les doléances locales, avec filtres optionnels
     */
    async getLocalGrievances(filters?: {
        province?: string;
        status?: string;
        category?: string;
        priority?: number;
    }): Promise<LocalGrievance[]> {
        let query = supabase
            .from('local_grievances')
            .select('*')
            .order('priority', { ascending: false })
            .order('created_at', { ascending: false });

        if (filters?.province) {
            query = query.eq('province', filters.province);
        }
        if (filters?.status) {
            query = query.eq('status', filters.status);
        }
        if (filters?.category) {
            query = query.eq('category', filters.category);
        }
        if (filters?.priority !== undefined) {
            query = query.eq('priority', filters.priority);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []) as LocalGrievance[];
    },

    /**
     * Récupère une doléance par ID
     */
    async getGrievanceById(id: string): Promise<LocalGrievance | null> {
        const { data, error } = await supabase
            .from('local_grievances')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) throw error;
        return data as LocalGrievance | null;
    },

    /**
     * Crée une nouvelle doléance
     */
    async createGrievance(grievance: Omit<LocalGrievance, 'id' | 'created_at' | 'updated_at' | 'status'>): Promise<LocalGrievance> {
        const { data, error } = await supabase
            .from('local_grievances')
            .insert({
                ...grievance,
                status: 'PENDING',
                priority: grievance.priority || 0
            })
            .select()
            .single();

        if (error) throw error;
        return data as LocalGrievance;
    },

    /**
     * Met à jour une doléance (statut, réponse, etc.)
     */
    async updateGrievance(id: string, updates: Partial<LocalGrievance>): Promise<LocalGrievance> {
        const { data, error } = await supabase
            .from('local_grievances')
            .update({
                ...updates,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as LocalGrievance;
    },

    /**
     * Assigne une doléance à un sénateur
     */
    async assignGrievance(grievanceId: string, senatorId: string): Promise<void> {
        const { error } = await supabase
            .from('local_grievances')
            .update({ 
                assigned_senator_id: senatorId,
                status: 'IN_REVIEW' 
            })
            .eq('id', grievanceId);

        if (error) throw error;
    },

    /**
     * Récupère les visites de terrain
     */
    async getFieldVisits(filters?: {
        senatorId?: string;
        province?: string;
        fromDate?: string;
        toDate?: string;
    }): Promise<FieldVisit[]> {
        let query = supabase
            .from('field_visits')
            .select('*')
            .order('visit_date', { ascending: false });

        if (filters?.senatorId) {
            query = query.eq('senator_id', filters.senatorId);
        }
        if (filters?.province) {
            query = query.eq('province', filters.province);
        }
        if (filters?.fromDate) {
            query = query.gte('visit_date', filters.fromDate);
        }
        if (filters?.toDate) {
            query = query.lte('visit_date', filters.toDate);
        }

        const { data, error } = await query;
        if (error) throw error;
        return (data || []) as FieldVisit[];
    },

    /**
     * Crée un nouveau rapport de visite terrain
     */
    async createFieldVisit(visit: Omit<FieldVisit, 'id' | 'created_at' | 'updated_at'>): Promise<FieldVisit> {
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
        return data as FieldVisit;
    },

    /**
     * Met à jour une visite de terrain
     */
    async updateFieldVisit(id: string, updates: Partial<FieldVisit>): Promise<FieldVisit> {
        const { data, error } = await supabase
            .from('field_visits')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as FieldVisit;
    },

    /**
     * Récupère les statistiques globales pour le dashboard sénateur
     */
    async getDashboardStats(province?: string): Promise<SenateStats> {
        // Comptages des doléances
        let grievancesQuery = supabase.from('local_grievances').select('*', { count: 'exact', head: true });
        let pendingQuery = supabase.from('local_grievances').select('*', { count: 'exact', head: true }).eq('status', 'PENDING');
        let inReviewQuery = supabase.from('local_grievances').select('*', { count: 'exact', head: true }).eq('status', 'IN_REVIEW');
        let addressedQuery = supabase.from('local_grievances').select('*', { count: 'exact', head: true }).eq('status', 'ADDRESSED');
        let visitsQuery = supabase.from('field_visits').select('*', { count: 'exact', head: true });

        if (province) {
            grievancesQuery = grievancesQuery.eq('province', province);
            pendingQuery = pendingQuery.eq('province', province);
            inReviewQuery = inReviewQuery.eq('province', province);
            addressedQuery = addressedQuery.eq('province', province);
            visitsQuery = visitsQuery.eq('province', province);
        }

        const [grievances, pending, inReview, addressed, visits] = await Promise.all([
            grievancesQuery,
            pendingQuery,
            inReviewQuery,
            addressedQuery,
            visitsQuery
        ]);

        // Statistiques par province
        const { data: allGrievances } = await supabase
            .from('local_grievances')
            .select('province, category');

        const grievancesByProvince: Record<string, number> = {};
        const grievancesByCategory: Record<string, number> = {};

        (allGrievances || []).forEach((g) => {
            grievancesByProvince[g.province] = (grievancesByProvince[g.province] || 0) + 1;
            if (g.category) {
                grievancesByCategory[g.category] = (grievancesByCategory[g.category] || 0) + 1;
            }
        });

        return {
            grievancesCount: grievances.count || 0,
            pendingGrievances: pending.count || 0,
            inReviewGrievances: inReview.count || 0,
            addressedGrievances: addressed.count || 0,
            fieldVisitsCount: visits.count || 0,
            primaryProvince: province || "National",
            grievancesByProvince,
            grievancesByCategory
        };
    },

    /**
     * Récupère les textes en attente au Sénat
     */
    async getSenateTextQueue(status?: string) {
        let query = supabase
            .from('senate_text_queue')
            .select(`
                *,
                legislative_texts (
                    id,
                    reference,
                    title,
                    short_title,
                    text_type,
                    urgency,
                    origin_institution,
                    current_location
                )
            `)
            .order('received_at', { ascending: false });

        if (status) {
            query = query.eq('senate_status', status);
        }

        const { data, error } = await query;
        if (error) throw error;
        return data || [];
    }
};

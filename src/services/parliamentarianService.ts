/**
 * Service pour la gestion des parlementaires (députés et sénateurs)
 */

import { supabase } from '@/integrations/supabase/client';
import { InstitutionType } from './legislativeService';

export type ParliamentaryRole =
    | 'AN_DEPUTE' | 'AN_DEPUTE_SUPPLEANT' | 'AN_PRESIDENT' | 'AN_VICE_PRESIDENT'
    | 'AN_QUESTEUR' | 'AN_SECRETAIRE' | 'AN_PRESIDENT_COMMISSION'
    | 'SN_SENATEUR' | 'SN_SENATEUR_SUPPLEANT' | 'SN_PRESIDENT' | 'SN_VICE_PRESIDENT'
    | 'SN_QUESTEUR' | 'SN_SECRETAIRE' | 'SN_PRESIDENT_COMMISSION'
    | 'PG_PRESIDENT' | 'PG_SECRETAIRE_GENERAL'
    | 'ADMIN_AN' | 'ADMIN_SN' | 'ADMIN_PG' | 'SUPER_ADMIN' | 'CITIZEN';

export interface Parliamentarian {
    id: string;
    title?: string;
    first_name: string;
    last_name: string;
    birth_date?: string;
    birth_place?: string;
    photo_url?: string;
    institution: InstitutionType;
    role: ParliamentaryRole;
    circonscription?: string;
    province?: string;
    department?: string;
    groupe_parlementaire?: string;
    parti_politique?: string;
    mandate_start?: string;
    mandate_end?: string;
    is_active: boolean;
    email_pro?: string;
    phone_pro?: string;
    office_location?: string;
    biography?: string;
    education?: any[];
    career?: any[];
    commissions?: any[];
    texts_authored: number;
    amendments_authored: number;
    questions_asked: number;
    attendance_rate?: number;
    created_at: string;
    updated_at: string;
}

export interface Commission {
    id: string;
    name: string;
    short_name?: string;
    institution: InstitutionType;
    description?: string;
    president_id?: string;
    president_name?: string;
    vice_president_name?: string;
    secretary_name?: string;
    members?: any[];
    created_at: string;
    updated_at: string;
}

// Labels pour les rôles
export const roleLabels: Record<ParliamentaryRole, string> = {
    AN_DEPUTE: 'Député',
    AN_DEPUTE_SUPPLEANT: 'Député suppléant',
    AN_PRESIDENT: 'Président de l\'Assemblée',
    AN_VICE_PRESIDENT: 'Vice-Président AN',
    AN_QUESTEUR: 'Questeur AN',
    AN_SECRETAIRE: 'Secrétaire AN',
    AN_PRESIDENT_COMMISSION: 'Président de commission',
    SN_SENATEUR: 'Sénateur',
    SN_SENATEUR_SUPPLEANT: 'Sénateur suppléant',
    SN_PRESIDENT: 'Président du Sénat',
    SN_VICE_PRESIDENT: 'Vice-Président Sénat',
    SN_QUESTEUR: 'Questeur Sénat',
    SN_SECRETAIRE: 'Secrétaire Sénat',
    SN_PRESIDENT_COMMISSION: 'Président de commission',
    PG_PRESIDENT: 'Président du Parlement',
    PG_SECRETAIRE_GENERAL: 'Secrétaire Général',
    ADMIN_AN: 'Administrateur AN',
    ADMIN_SN: 'Administrateur Sénat',
    ADMIN_PG: 'Administrateur Parlement',
    SUPER_ADMIN: 'Super Administrateur',
    CITIZEN: 'Citoyen',
};

// Labels courts pour les rôles
export const roleShortLabels: Record<ParliamentaryRole, string> = {
    AN_DEPUTE: 'Dép.',
    AN_DEPUTE_SUPPLEANT: 'Dép. Supp.',
    AN_PRESIDENT: 'Prés. AN',
    AN_VICE_PRESIDENT: 'VP AN',
    AN_QUESTEUR: 'Quest. AN',
    AN_SECRETAIRE: 'Sec. AN',
    AN_PRESIDENT_COMMISSION: 'Prés. Com.',
    SN_SENATEUR: 'Sén.',
    SN_SENATEUR_SUPPLEANT: 'Sén. Supp.',
    SN_PRESIDENT: 'Prés. SN',
    SN_VICE_PRESIDENT: 'VP SN',
    SN_QUESTEUR: 'Quest. SN',
    SN_SECRETAIRE: 'Sec. SN',
    SN_PRESIDENT_COMMISSION: 'Prés. Com.',
    PG_PRESIDENT: 'Prés. Parl.',
    PG_SECRETAIRE_GENERAL: 'SG',
    ADMIN_AN: 'Admin AN',
    ADMIN_SN: 'Admin SN',
    ADMIN_PG: 'Admin',
    SUPER_ADMIN: 'S. Admin',
    CITIZEN: 'Citoyen',
};

class ParliamentarianService {
    /**
     * Récupérer tous les parlementaires
     */
    async getParliamentarians(options?: {
        institution?: InstitutionType;
        role?: ParliamentaryRole;
        activeOnly?: boolean;
        commission?: string;
        limit?: number;
    }): Promise<Parliamentarian[]> {
        let query = supabase
            .from('parliamentarians')
            .select('*')
            .order('last_name', { ascending: true });

        if (options?.institution) {
            query = query.eq('institution', options.institution);
        }
        if (options?.role) {
            query = query.eq('role', options.role);
        }
        if (options?.activeOnly !== false) {
            query = query.eq('is_active', true);
        }
        if (options?.limit) {
            query = query.limit(options.limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching parliamentarians:', error);
            throw error;
        }

        return (data as Parliamentarian[]) || [];
    }

    /**
     * Récupérer les députés
     */
    async getDeputies(): Promise<Parliamentarian[]> {
        return this.getParliamentarians({
            institution: 'ASSEMBLY',
            activeOnly: true
        });
    }

    /**
     * Récupérer les sénateurs
     */
    async getSenators(): Promise<Parliamentarian[]> {
        return this.getParliamentarians({
            institution: 'SENATE',
            activeOnly: true
        });
    }

    /**
     * Récupérer un parlementaire par ID
     */
    async getParliamentarianById(id: string): Promise<Parliamentarian | null> {
        const { data, error } = await supabase
            .from('parliamentarians')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching parliamentarian:', error);
            return null;
        }

        return data as Parliamentarian;
    }

    /**
     * Rechercher des parlementaires
     */
    async searchParliamentarians(query: string, institution?: InstitutionType): Promise<Parliamentarian[]> {
        let dbQuery = supabase
            .from('parliamentarians')
            .select('*')
            .eq('is_active', true)
            .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,circonscription.ilike.%${query}%`);

        if (institution) {
            dbQuery = dbQuery.eq('institution', institution);
        }

        const { data, error } = await dbQuery.limit(20);

        if (error) {
            console.error('Error searching parliamentarians:', error);
            throw error;
        }

        return (data as Parliamentarian[]) || [];
    }

    /**
     * Récupérer toutes les commissions
     */
    async getCommissions(institution?: InstitutionType): Promise<Commission[]> {
        let query = supabase
            .from('permanent_commissions')
            .select('*')
            .order('name', { ascending: true });

        if (institution) {
            query = query.eq('institution', institution);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching commissions:', error);
            throw error;
        }

        return (data as Commission[]) || [];
    }

    /**
     * Récupérer une commission par ID
     */
    async getCommissionById(id: string): Promise<Commission | null> {
        const { data, error } = await supabase
            .from('permanent_commissions')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching commission:', error);
            return null;
        }

        return data as Commission;
    }

    /**
     * Obtenir le nom complet d'un parlementaire
     */
    getFullName(p: Parliamentarian): string {
        return `${p.title ? p.title + ' ' : ''}${p.first_name} ${p.last_name}`;
    }

    /**
     * Obtenir les initiales
     */
    getInitials(p: Parliamentarian): string {
        return `${p.first_name[0]}${p.last_name[0]}`.toUpperCase();
    }

    /**
     * Vérifier si c'est un président de chambre
     */
    isPresident(role: ParliamentaryRole): boolean {
        return ['AN_PRESIDENT', 'SN_PRESIDENT', 'PG_PRESIDENT'].includes(role);
    }

    /**
     * Vérifier si c'est un membre du bureau
     */
    isBureauMember(role: ParliamentaryRole): boolean {
        const bureauRoles = [
            'AN_PRESIDENT', 'AN_VICE_PRESIDENT', 'AN_QUESTEUR', 'AN_SECRETAIRE',
            'SN_PRESIDENT', 'SN_VICE_PRESIDENT', 'SN_QUESTEUR', 'SN_SECRETAIRE',
        ];
        return bureauRoles.includes(role);
    }

    /**
     * Obtenir les statistiques par institution
     */
    async getStats(institution?: InstitutionType): Promise<{
        total: number;
        byRole: Record<string, number>;
        byProvince: Record<string, number>;
        byGroupe: Record<string, number>;
    }> {
        const parliamentarians = await this.getParliamentarians({ institution, activeOnly: true });

        const byRole: Record<string, number> = {};
        const byProvince: Record<string, number> = {};
        const byGroupe: Record<string, number> = {};

        parliamentarians.forEach(p => {
            // Par rôle
            byRole[p.role] = (byRole[p.role] || 0) + 1;

            // Par province
            if (p.province) {
                byProvince[p.province] = (byProvince[p.province] || 0) + 1;
            }

            // Par groupe parlementaire
            if (p.groupe_parlementaire) {
                byGroupe[p.groupe_parlementaire] = (byGroupe[p.groupe_parlementaire] || 0) + 1;
            }
        });

        return {
            total: parliamentarians.length,
            byRole,
            byProvince,
            byGroupe,
        };
    }
}

export const parliamentarianService = new ParliamentarianService();
export default parliamentarianService;

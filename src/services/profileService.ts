// @ts-nocheck
import { supabase } from "@/integrations/supabase/client";
import { organizationService } from "./organizationService";
import { invokeWithDemoFallback } from "@/utils/demoMode";
import { auditService } from "@/services/audit-service";

// Type-safe helper for tables not yet in generated types
const db = supabase as any;

// Profile type definition
export interface Profile {
    id: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    role?: string;
    user_id?: string;
    employer?: string;
    created_at: string;
    updated_at: string;
    organization?: {
        name: string;
        settings?: any;
        metadata?: {
            city?: string;
            country?: string;
            countryCode?: string;
        };
    };
}

export interface ProfileWithRole extends Profile {
    role?: string;
    organization?: {
        name: string;
        settings: any;
        metadata?: any;
    };
}

export const profileService = {
    async getAll(): Promise<ProfileWithRole[]> {
        // 1. Récupérer les profils
        const { data: profiles, error: profileError } = await db
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (profileError) {
            console.error('Failed to fetch profiles:', profileError);
            return [];
        }

        if (!profiles || profiles.length === 0) {
            return [];
        }

        // 2. Récupérer les rôles
        const { data: roles } = await db
            .from('user_roles')
            .select('user_id, role');

        // 3. Récupérer les organisations pour le mapping
        let organizations: any[] = [];
        try {
            organizations = await organizationService.getAll();
        } catch {
            // Ignore organization errors
        }

        // 4. Combiner les données
        const roleMap = new Map((roles || []).map((r: any) => [r.user_id, r.role]));
        
        return (profiles as any[]).map(profile => {
            const role = roleMap.get(profile.id) || roleMap.get(profile.user_id);
            return {
                ...profile,
                role,
                organization: profile.employer 
                    ? organizations.find(o => o.id === profile.employer)
                    : undefined
            } as ProfileWithRole;
        });
    },

    async getById(id: string): Promise<ProfileWithRole | null> {
        const { data: profile, error } = await db
            .from('profiles')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error || !profile) {
            console.error('Failed to fetch profile:', error);
            return null;
        }

        // Récupérer le rôle
        const { data: roleData } = await db
            .from('user_roles')
            .select('role')
            .eq('user_id', id)
            .maybeSingle();

        return {
            ...profile,
            role: roleData?.role
        } as ProfileWithRole;
    },

    async getCurrentProfile(): Promise<ProfileWithRole | null> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;
        return this.getById(user.id);
    },

    async updateProfile(id: string, updates: Partial<Profile>): Promise<ProfileWithRole | null> {
        const { data, error } = await db
            .from('profiles')
            .update(updates)
            .eq('id', id)
            .select()
            .maybeSingle();

        if (error) {
            console.error('Failed to update profile:', error);
            throw error;
        }

        // Log audit
        try {
            await auditService.log({
                action: 'UPDATE_PROFILE',
                entity_type: 'profile',
                entity_id: id,
                details: { updates }
            });
        } catch {
            // Ignore audit errors
        }

        return data as ProfileWithRole | null;
    },

    async getUserRole(userId: string): Promise<string | null> {
        const { data } = await db
            .from('user_roles')
            .select('role')
            .eq('user_id', userId)
            .maybeSingle();

        return data?.role || null;
    },

    async setUserRole(userId: string, role: string): Promise<void> {
        // Check if role exists
        const existing = await this.getUserRole(userId);
        
        if (existing) {
            await db
                .from('user_roles')
                .update({ role })
                .eq('user_id', userId);
        } else {
            await db
                .from('user_roles')
                .insert({ user_id: userId, role });
        }
    },

    async deleteProfile(id: string): Promise<void> {
        const { error } = await db
            .from('profiles')
            .delete()
            .eq('id', id);

        if (error) throw error;

        // Also delete role
        await db
            .from('user_roles')
            .delete()
            .eq('user_id', id);
    }
};

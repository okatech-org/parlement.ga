import { supabase } from "@/integrations/supabase/client";

// Type-safe helper for tables not yet in generated types
const db = supabase as any;

// Types for organizations (table doesn't exist yet)
export interface Organization {
    id: string;
    name: string;
    type: string;
    created_at: string;
    updated_at: string;
}
export type OrganizationType = string;

export const organizationService = {
    async getAll(): Promise<Organization[]> {
        const { data, error } = await db
            .from('organizations')
            .select('*')
            .order('name');

        if (error) {
            console.error('Failed to fetch organizations:', error);
            return [];
        }

        return (data || []) as Organization[];
    },

    async getById(id: string): Promise<Organization | null> {
        const { data, error } = await db
            .from('organizations')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) {
            console.error('Failed to fetch organization:', error);
            return null;
        }
        return data as Organization | null;
    },

    async create(organization: Omit<Organization, 'id' | 'created_at' | 'updated_at'>): Promise<Organization> {
        const { data, error } = await db
            .from('organizations')
            .insert(organization)
            .select()
            .single();

        if (error) throw error;
        return data as Organization;
    },

    async update(id: string, updates: Partial<Organization>): Promise<Organization> {
        const { data, error } = await db
            .from('organizations')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Organization;
    },

    async delete(id: string): Promise<void> {
        const { error } = await db
            .from('organizations')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};

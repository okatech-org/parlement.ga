import { supabase } from "@/integrations/supabase/client";
import { auditService } from "@/services/audit-service";

// Type-safe helper for tables not yet in generated types
const db = supabase as any;

// Types for requests (table doesn't exist yet)
export interface Request {
    id: string;
    status: string;
    type: string;
    priority: string;
    subject?: string;
    citizen_id?: string;
    created_at: string;
    updated_at: string;
}
export type RequestStatus = string;
export type RequestType = string;
export type RequestPriority = string;

export const requestService = {
    async getAll(citizenId?: string): Promise<Request[]> {
        let query = db
            .from('requests')
            .select('*')
            .order('created_at', { ascending: false });

        if (citizenId) {
            query = query.eq('citizen_id', citizenId);
        }

        const { data, error } = await query;
        if (error) {
            console.error('Failed to fetch requests:', error);
            return [];
        }
        return (data || []) as Request[];
    },

    async getById(id: string): Promise<Request | null> {
        const { data, error } = await db
            .from('requests')
            .select('*')
            .eq('id', id)
            .maybeSingle();

        if (error) return null;
        return data as Request | null;
    },

    async create(request: Omit<Request, 'id' | 'created_at' | 'updated_at'>): Promise<Request> {
        const { data, error } = await db
            .from('requests')
            .insert(request)
            .select()
            .single();

        if (error) throw error;
        return data as Request;
    },

    async updateStatus(id: string, status: RequestStatus): Promise<Request> {
        const { data, error } = await db
            .from('requests')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Request;
    },

    async update(id: string, updates: Partial<Request>): Promise<Request> {
        const { data, error } = await db
            .from('requests')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Request;
    },

    async delete(id: string): Promise<void> {
        const { error } = await db
            .from('requests')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    async getByStatus(status: RequestStatus): Promise<Request[]> {
        const { data, error } = await db
            .from('requests')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) return [];
        return (data || []) as Request[];
    }
};

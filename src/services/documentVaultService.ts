/**
 * Document Vault Service
 * Manages secure storage and retrieval of user documents
 * NOTE: Using mock data until document_vault table is created
 */

import { supabase } from '@/integrations/supabase/client';

// Type-safe helper for tables not yet in generated types
const db = supabase as any;

// Document categories
export type DocumentCategory =
    | 'photo_identity'
    | 'passport'
    | 'birth_certificate'
    | 'residence_proof'
    | 'marriage_certificate'
    | 'family_record'
    | 'diploma'
    | 'cv'
    | 'other';

// Document source
export type DocumentSource =
    | 'upload'
    | 'camera'
    | 'google_drive'
    | 'onedrive'
    | 'dropbox'
    | 'icloud';

// Vault document type
export interface VaultDocument {
    id: string;
    user_id: string;
    name: string;
    original_name: string | null;
    category: DocumentCategory;
    file_path: string;
    file_type: string | null;
    file_size: number | null;
    thumbnail_path: string | null;
    metadata: Record<string, any>;
    is_verified: boolean;
    verification_date: string | null;
    source: DocumentSource;
    last_used_at: string | null;
    created_at: string;
    updated_at: string;
    public_url?: string;
    thumbnail_url?: string;
}

// Category labels in French
export const CATEGORY_LABELS: Record<DocumentCategory, string> = {
    photo_identity: "Photo d'identité",
    passport: "Passeport",
    birth_certificate: "Acte de naissance",
    residence_proof: "Justificatif de domicile",
    marriage_certificate: "Acte de mariage",
    family_record: "Livret de famille",
    diploma: "Diplôme",
    cv: "CV",
    other: "Autre document"
};

// Category icons (Lucide icon names)
export const CATEGORY_ICONS: Record<DocumentCategory, string> = {
    photo_identity: "User",
    passport: "CreditCard",
    birth_certificate: "Baby",
    residence_proof: "Home",
    marriage_certificate: "Heart",
    family_record: "Users",
    diploma: "GraduationCap",
    cv: "FileText",
    other: "File"
};

// Mock storage for documents (localStorage-based until table exists)
const STORAGE_KEY = 'document_vault_mock';

function getMockDocuments(): VaultDocument[] {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

function saveMockDocuments(docs: VaultDocument[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
}

/**
 * Upload a document to the vault (mock implementation)
 */
export async function uploadToVault(
    file: File,
    category: DocumentCategory,
    options?: {
        name?: string;
        source?: DocumentSource;
        metadata?: Record<string, any>;
    }
): Promise<{ data: VaultDocument | null; error: Error | null }> {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        const userId = user?.id || 'anonymous';
        
        const doc: VaultDocument = {
            id: crypto.randomUUID(),
            user_id: userId,
            name: options?.name || file.name,
            original_name: file.name,
            category,
            file_path: `mock/${userId}/${category}/${file.name}`,
            file_type: file.type,
            file_size: file.size,
            thumbnail_path: null,
            metadata: options?.metadata || {},
            is_verified: false,
            verification_date: null,
            source: options?.source || 'upload',
            last_used_at: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            public_url: URL.createObjectURL(file)
        };

        const docs = getMockDocuments();
        docs.push(doc);
        saveMockDocuments(docs);

        return { data: doc, error: null };
    } catch (error) {
        console.error('[DocumentVault] Upload error:', error);
        return { data: null, error: error as Error };
    }
}

/**
 * Get all documents in the vault
 */
export async function getVaultDocuments(
    options?: {
        category?: DocumentCategory;
        limit?: number;
        orderBy?: 'created_at' | 'last_used_at' | 'name';
    }
): Promise<{ data: VaultDocument[]; error: Error | null }> {
    try {
        let docs = getMockDocuments();
        
        if (options?.category) {
            docs = docs.filter(d => d.category === options.category);
        }
        
        const orderBy = options?.orderBy || 'created_at';
        docs.sort((a, b) => {
            const aVal = a[orderBy] || '';
            const bVal = b[orderBy] || '';
            return bVal.localeCompare(aVal);
        });
        
        if (options?.limit) {
            docs = docs.slice(0, options.limit);
        }

        return { data: docs, error: null };
    } catch (error) {
        console.error('[DocumentVault] Get documents error:', error);
        return { data: [], error: error as Error };
    }
}

/**
 * Get a single document by ID
 */
export async function getVaultDocument(id: string): Promise<{ data: VaultDocument | null; error: Error | null }> {
    try {
        const docs = getMockDocuments();
        const doc = docs.find(d => d.id === id) || null;
        return { data: doc, error: null };
    } catch (error) {
        console.error('[DocumentVault] Get document error:', error);
        return { data: null, error: error as Error };
    }
}

/**
 * Delete a document from the vault
 */
export async function deleteVaultDocument(id: string): Promise<{ error: Error | null }> {
    try {
        const docs = getMockDocuments();
        saveMockDocuments(docs.filter(d => d.id !== id));
        return { error: null };
    } catch (error) {
        console.error('[DocumentVault] Delete error:', error);
        return { error: error as Error };
    }
}

/**
 * Mark a document as recently used
 */
export async function markDocumentUsed(id: string): Promise<void> {
    const docs = getMockDocuments();
    const idx = docs.findIndex(d => d.id === id);
    if (idx !== -1) {
        docs[idx].last_used_at = new Date().toISOString();
        saveMockDocuments(docs);
    }
}

/**
 * Update a document's metadata
 */
export async function updateVaultDocument(
    id: string,
    updates: Partial<Pick<VaultDocument, 'name' | 'category' | 'metadata'>>
): Promise<{ data: VaultDocument | null; error: Error | null }> {
    try {
        const docs = getMockDocuments();
        const idx = docs.findIndex(d => d.id === id);
        
        if (idx === -1) {
            throw new Error('Document non trouvé');
        }
        
        docs[idx] = { ...docs[idx], ...updates, updated_at: new Date().toISOString() };
        saveMockDocuments(docs);
        
        return { data: docs[idx], error: null };
    } catch (error) {
        console.error('[DocumentVault] Update error:', error);
        return { data: null, error: error as Error };
    }
}

/**
 * Download document content
 */
export async function downloadVaultDocument(id: string): Promise<{ data: Blob | null; error: Error | null }> {
    console.warn('[DocumentVault] Download not available in mock mode');
    return { data: null, error: new Error('Non disponible en mode démo') };
}

/**
 * Check if a category has documents
 */
export async function hasCategoryDocuments(category: DocumentCategory): Promise<boolean> {
    const docs = getMockDocuments();
    return docs.some(d => d.category === category);
}

/**
 * Get category statistics
 */
export async function getCategoryStats(): Promise<Record<DocumentCategory, number>> {
    const docs = getMockDocuments();
    const stats: Record<DocumentCategory, number> = {
        photo_identity: 0,
        passport: 0,
        birth_certificate: 0,
        residence_proof: 0,
        marriage_certificate: 0,
        family_record: 0,
        diploma: 0,
        cv: 0,
        other: 0
    };
    
    docs.forEach(doc => {
        if (doc.category in stats) {
            stats[doc.category]++;
        }
    });
    
    return stats;
}

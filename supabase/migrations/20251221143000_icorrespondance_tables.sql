-- ============================================================
-- MIGRATION: iCorrespondance Tables for Parlement.ga
-- ============================================================
-- Tables pour la gestion des dossiers de correspondance officielle
-- avec persistance et workflow (brouillon → envoyé → archivé)
-- USAGE: Exécuter ce script dans Supabase SQL Editor
-- ============================================================

-- ============================================================
-- TABLE: icorrespondance_folders (Dossiers de correspondance)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.icorrespondance_folders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Identification
    name TEXT NOT NULL,
    reference_number TEXT,  -- Ex: "CORR-AN-2025-001"
    
    -- Destinataire
    recipient_name TEXT,
    recipient_organization TEXT,
    recipient_email TEXT,  -- Pour envoi externe
    recipient_user_id UUID REFERENCES auth.users(id),  -- Pour envoi interne iBoîte
    
    -- Contenu
    comment TEXT,
    
    -- Statut et flags
    status TEXT DEFAULT 'DRAFT' CHECK (
        status IN ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'SENT', 'ARCHIVED')
    ),
    is_urgent BOOLEAN DEFAULT false,
    is_read BOOLEAN DEFAULT true,
    is_internal BOOLEAN DEFAULT false,  -- true = iBoîte, false = email externe
    
    -- Liaison iBoîte (pour envoi interne)
    iboite_conversation_id UUID REFERENCES public.iboite_conversations(id),
    
    -- Timestamps
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_icorr_folders_user ON public.icorrespondance_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_icorr_folders_status ON public.icorrespondance_folders(status);
CREATE INDEX IF NOT EXISTS idx_icorr_folders_created ON public.icorrespondance_folders(created_at DESC);

-- ============================================================
-- TABLE: icorrespondance_documents (Documents attachés)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.icorrespondance_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_id UUID NOT NULL REFERENCES public.icorrespondance_folders(id) ON DELETE CASCADE,
    
    -- Fichier
    name TEXT NOT NULL,
    file_path TEXT,  -- Chemin Supabase Storage
    file_type TEXT DEFAULT 'pdf',  -- pdf, doc, image, other
    file_size TEXT,  -- Taille formatée ex: "2.4 MB"
    file_url TEXT,  -- URL temporaire ou blob URL
    
    -- Contenu généré
    is_generated BOOLEAN DEFAULT false,
    generator_type TEXT,  -- Type de générateur utilisé
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_icorr_docs_folder ON public.icorrespondance_documents(folder_id);

-- ============================================================
-- RLS POLICIES
-- ============================================================

ALTER TABLE public.icorrespondance_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.icorrespondance_documents ENABLE ROW LEVEL SECURITY;

-- Folders: Users can view and manage their own folders
CREATE POLICY "Users can view own icorrespondance folders"
ON public.icorrespondance_folders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create icorrespondance folders"
ON public.icorrespondance_folders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own icorrespondance folders"
ON public.icorrespondance_folders FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own icorrespondance folders"
ON public.icorrespondance_folders FOR DELETE
USING (auth.uid() = user_id);

-- Documents: Users can manage documents in their folders
CREATE POLICY "Users can view icorrespondance documents"
ON public.icorrespondance_documents FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.icorrespondance_folders f
        WHERE f.id = folder_id AND f.user_id = auth.uid()
    )
);

CREATE POLICY "Users can insert icorrespondance documents"
ON public.icorrespondance_documents FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.icorrespondance_folders f
        WHERE f.id = folder_id AND f.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete icorrespondance documents"
ON public.icorrespondance_documents FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.icorrespondance_folders f
        WHERE f.id = folder_id AND f.user_id = auth.uid()
    )
);

-- ============================================================
-- TRIGGER: Auto-update timestamps
-- ============================================================

-- Create the function if it doesn't exist
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_icorrespondance_folders_timestamp
BEFORE UPDATE ON public.icorrespondance_folders
FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ============================================================
-- FUNCTION: Generate reference number for Parliament
-- ============================================================

CREATE OR REPLACE FUNCTION public.generate_icorr_reference(institution TEXT DEFAULT 'AN')
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    year_str TEXT;
    seq_num INTEGER;
BEGIN
    year_str := to_char(now(), 'YYYY');
    
    -- Get next sequence number for this institution/year
    SELECT COALESCE(MAX(
        CASE 
            WHEN reference_number ~ ('^CORR-' || institution || '-' || year_str || '-[0-9]+$')
            THEN CAST(SPLIT_PART(reference_number, '-', 4) AS INTEGER)
            ELSE 0
        END
    ), 0) + 1 INTO seq_num
    FROM public.icorrespondance_folders
    WHERE created_at >= date_trunc('year', now());
    
    RETURN 'CORR-' || institution || '-' || year_str || '-' || LPAD(seq_num::TEXT, 4, '0');
END;
$$;

-- ============================================================
-- COMMENTS
-- ============================================================

COMMENT ON TABLE public.icorrespondance_folders IS 'Dossiers de correspondance officielle parlementaire';
COMMENT ON TABLE public.icorrespondance_documents IS 'Documents attachés aux dossiers iCorrespondance';
COMMENT ON COLUMN public.icorrespondance_folders.is_internal IS 'true = envoi via iBoîte (interne), false = envoi par email (externe)';
COMMENT ON COLUMN public.icorrespondance_folders.iboite_conversation_id IS 'Référence vers la conversation iBoîte si envoi interne';

-- ============================================================
-- STORAGE BUCKET NOTE
-- ============================================================
-- The storage bucket 'icorrespondance-documents' must be created 
-- manually in the Supabase Dashboard:
-- 1. Go to Storage > New bucket
-- 2. Name: icorrespondance-documents
-- 3. Public: OFF
-- 4. Add appropriate RLS policies
-- ============================================================

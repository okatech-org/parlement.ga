-- Migration: Architecture Bicamérale Parlement.ga
-- Description: Adaptation du schéma de données pour supporter le bicamérisme gabonais
-- (Assemblée Nationale, Sénat, Congrès)

-- ============================================================================
-- 1. TYPES ENUM POUR LES INSTITUTIONS
-- ============================================================================

-- Type d'institution parlementaire
DO $$ BEGIN
    CREATE TYPE institution_type AS ENUM ('ASSEMBLY', 'SENATE', 'PARLIAMENT', 'JOINT');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Localisation actuelle d'un texte législatif dans la navette parlementaire
DO $$ BEGIN
    CREATE TYPE legislative_location AS ENUM (
        -- Assemblée Nationale
        'AN_DEPOT',           -- Dépôt initial à l'AN
        'AN_BUREAU',          -- Bureau de l'AN
        'AN_COMMISSION',      -- Commission permanente AN
        'AN_PLENIERE',        -- Séance plénière AN
        'AN_VOTE',            -- En cours de vote AN
        'AN_ADOPTED',         -- Adopté par l'AN
        'AN_REJECTED',        -- Rejeté par l'AN
        
        -- Sénat
        'SN_DEPOT',           -- Dépôt initial au Sénat
        'SN_BUREAU',          -- Bureau du Sénat
        'SN_COMMISSION',      -- Commission permanente Sénat
        'SN_PLENIERE',        -- Séance plénière Sénat
        'SN_VOTE',            -- En cours de vote Sénat
        'SN_ADOPTED',         -- Adopté par le Sénat
        'SN_REJECTED',        -- Rejeté par le Sénat
        
        -- Navette
        'NAVETTE_AN_TO_SN',   -- Transmis de l'AN vers le Sénat
        'NAVETTE_SN_TO_AN',   -- Transmis du Sénat vers l'AN
        
        -- Commission Mixte Paritaire
        'CMP_CONVENED',       -- CMP convoquée
        'CMP_IN_PROGRESS',    -- CMP en cours
        'CMP_AGREEMENT',      -- Accord CMP
        'CMP_FAILURE',        -- Échec CMP
        
        -- Phase finale
        'FINAL_AN',           -- Lecture définitive AN
        'FINAL_SN',           -- Lecture définitive Sénat
        'ADOPTED',            -- Texte adopté (par les deux chambres)
        'PROMULGATED',        -- Loi promulguée
        'ARCHIVED'            -- Archivé
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de rôle parlementaire
DO $$ BEGIN
    CREATE TYPE parliamentary_role AS ENUM (
        -- Assemblée Nationale
        'AN_DEPUTE',
        'AN_DEPUTE_SUPPLEANT',
        'AN_PRESIDENT',
        'AN_VICE_PRESIDENT',
        'AN_QUESTEUR',
        'AN_SECRETAIRE',
        'AN_PRESIDENT_COMMISSION',
        
        -- Sénat
        'SN_SENATEUR',
        'SN_SENATEUR_SUPPLEANT',
        'SN_PRESIDENT',
        'SN_VICE_PRESIDENT',
        'SN_QUESTEUR',
        'SN_SECRETAIRE',
        'SN_PRESIDENT_COMMISSION',
        
        -- Parlement (Congrès)
        'PG_PRESIDENT',       -- Président du Parlement réuni
        'PG_SECRETAIRE_GENERAL',
        
        -- Administration
        'ADMIN_AN',
        'ADMIN_SN',
        'ADMIN_PG',
        'SUPER_ADMIN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- 2. MODIFICATION DES TABLES EXISTANTES
-- ============================================================================

-- Ajouter institution_id aux profils utilisateurs
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY',
ADD COLUMN IF NOT EXISTS parliamentary_role parliamentary_role,
ADD COLUMN IF NOT EXISTS secondary_institution institution_type,  -- Pour les membres CMP
ADD COLUMN IF NOT EXISTS cmp_member BOOLEAN DEFAULT FALSE;

-- Ajouter institution aux documents
ALTER TABLE documents 
ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY',
ADD COLUMN IF NOT EXISTS visibility institution_type[] DEFAULT ARRAY['ASSEMBLY']::institution_type[];

-- Ajouter institution aux sessions
ALTER TABLE sessions 
ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY',
ADD COLUMN IF NOT EXISTS is_joint_session BOOLEAN DEFAULT FALSE;

-- Ajouter institution aux votes
ALTER TABLE votes 
ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY';

-- ============================================================================
-- 3. TABLE DES TEXTES LEGISLATIFS (NAVETTE)
-- ============================================================================

CREATE TABLE IF NOT EXISTS legislative_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    reference VARCHAR(50) NOT NULL UNIQUE,  -- Ex: "PL-2024-001" ou "PPL-2024-015"
    title TEXT NOT NULL,
    short_title VARCHAR(255),
    
    -- Classification
    text_type VARCHAR(50) NOT NULL,  -- 'projet_loi', 'proposition_loi', 'resolution', etc.
    origin_institution institution_type NOT NULL,
    current_location legislative_location NOT NULL DEFAULT 'AN_DEPOT',
    
    -- Contenu
    content TEXT,
    expose_motifs TEXT,
    
    -- Auteurs
    author_id UUID REFERENCES profiles(id),
    co_authors UUID[],
    
    -- Commission de référence
    commission_id UUID,
    rapporteur_id UUID REFERENCES profiles(id),
    
    -- Suivi temporel
    deposited_at TIMESTAMPTZ DEFAULT NOW(),
    transmitted_at TIMESTAMPTZ,
    adopted_at TIMESTAMPTZ,
    promulgated_at TIMESTAMPTZ,
    
    -- Navette
    reading_number INTEGER DEFAULT 1,  -- 1ère, 2ème lecture, etc.
    shuttle_count INTEGER DEFAULT 0,   -- Nombre de navettes effectuées
    
    -- Versions
    version INTEGER DEFAULT 1,
    parent_version_id UUID REFERENCES legislative_texts(id),
    
    -- Métadonnées
    urgency BOOLEAN DEFAULT FALSE,
    priority_level INTEGER DEFAULT 0,
    tags TEXT[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_legislative_texts_location ON legislative_texts(current_location);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_institution ON legislative_texts(origin_institution);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_reference ON legislative_texts(reference);

-- ============================================================================
-- 4. TABLE DE L'HISTORIQUE DE LA NAVETTE
-- ============================================================================

CREATE TABLE IF NOT EXISTS legislative_shuttle_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id) ON DELETE CASCADE,
    
    from_location legislative_location NOT NULL,
    to_location legislative_location NOT NULL,
    
    -- Qui a effectué la transmission
    transmitted_by UUID REFERENCES profiles(id),
    transmission_note TEXT,
    
    -- Versions du texte
    text_version_before INTEGER,
    text_version_after INTEGER,
    
    -- Horodatage
    transmitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shuttle_history_text ON legislative_shuttle_history(legislative_text_id);

-- ============================================================================
-- 5. TABLE COMMISSION MIXTE PARITAIRE (CMP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cmp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id),
    
    -- Composition (7 députés + 7 sénateurs)
    assembly_members UUID[] NOT NULL,
    senate_members UUID[] NOT NULL,
    
    -- Présidence (alternée)
    president_id UUID REFERENCES profiles(id),
    rapporteur_an_id UUID REFERENCES profiles(id),
    rapporteur_sn_id UUID REFERENCES profiles(id),
    
    -- Statut
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, IN_PROGRESS, AGREEMENT, FAILURE
    
    -- Résultat
    agreed_text TEXT,
    failure_reason TEXT,
    
    -- Dates
    convened_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    concluded_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmp_text ON cmp_sessions(legislative_text_id);

-- ============================================================================
-- 6. RLS POLICIES - ISOLATION PAR INSTITUTION
-- ============================================================================

-- Politique pour les documents : Isolation par institution
DROP POLICY IF EXISTS "Users see documents from their institution" ON documents;
CREATE POLICY "Users see documents from their institution" ON documents
    FOR SELECT
    USING (
        institution = (SELECT institution FROM profiles WHERE id = auth.uid())
        OR 'JOINT' = ANY(visibility)
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG')
    );

-- Politique pour les textes législatifs
ALTER TABLE legislative_texts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view legislative texts" ON legislative_texts
    FOR SELECT
    USING (
        -- Tout le monde peut voir les textes en cours
        current_location NOT IN ('AN_DEPOT', 'SN_DEPOT')
        OR origin_institution = (SELECT institution FROM profiles WHERE id = auth.uid())
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG', 'ADMIN_AN', 'ADMIN_SN')
    );

CREATE POLICY "Institution admins can insert texts" ON legislative_texts
    FOR INSERT
    WITH CHECK (
        origin_institution = (SELECT institution FROM profiles WHERE id = auth.uid())
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG')
    );

CREATE POLICY "Institution admins can update texts" ON legislative_texts
    FOR UPDATE
    USING (
        origin_institution = (SELECT institution FROM profiles WHERE id = auth.uid())
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG')
        OR (
            -- Membres CMP peuvent modifier pendant la CMP
            current_location IN ('CMP_CONVENED', 'CMP_IN_PROGRESS')
            AND (SELECT cmp_member FROM profiles WHERE id = auth.uid()) = TRUE
        )
    );

-- Politique pour les CMP
ALTER TABLE cmp_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CMP members can view their sessions" ON cmp_sessions
    FOR SELECT
    USING (
        auth.uid() = ANY(assembly_members)
        OR auth.uid() = ANY(senate_members)
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG')
    );

-- ============================================================================
-- 7. FONCTIONS UTILITAIRES
-- ============================================================================

-- Fonction pour transmettre un texte à l'autre chambre
CREATE OR REPLACE FUNCTION transmit_to_other_chamber(
    p_text_id UUID,
    p_note TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_location legislative_location;
    v_new_location legislative_location;
    v_user_role parliamentary_role;
    v_user_institution institution_type;
BEGIN
    -- Récupérer la localisation actuelle
    SELECT current_location INTO v_current_location
    FROM legislative_texts WHERE id = p_text_id;
    
    -- Récupérer le rôle de l'utilisateur
    SELECT parliamentary_role, institution INTO v_user_role, v_user_institution
    FROM profiles WHERE id = auth.uid();
    
    -- Vérifier les permissions (seulement Président ou Secrétaire Général)
    IF v_user_role NOT IN ('AN_PRESIDENT', 'SN_PRESIDENT', 'PG_PRESIDENT', 'SUPER_ADMIN') THEN
        RAISE EXCEPTION 'Permission denied: only Presidents can transmit texts';
    END IF;
    
    -- Déterminer la nouvelle localisation
    CASE v_current_location
        WHEN 'AN_ADOPTED' THEN 
            v_new_location := 'NAVETTE_AN_TO_SN';
        WHEN 'SN_ADOPTED' THEN 
            v_new_location := 'NAVETTE_SN_TO_AN';
        WHEN 'NAVETTE_AN_TO_SN' THEN 
            v_new_location := 'SN_BUREAU';
        WHEN 'NAVETTE_SN_TO_AN' THEN 
            v_new_location := 'AN_BUREAU';
        ELSE
            RAISE EXCEPTION 'Cannot transmit from current location: %', v_current_location;
    END CASE;
    
    -- Enregistrer dans l'historique
    INSERT INTO legislative_shuttle_history (
        legislative_text_id, from_location, to_location, transmitted_by, transmission_note
    ) VALUES (
        p_text_id, v_current_location, v_new_location, auth.uid(), p_note
    );
    
    -- Mettre à jour le texte
    UPDATE legislative_texts
    SET 
        current_location = v_new_location,
        transmitted_at = NOW(),
        shuttle_count = shuttle_count + 1,
        updated_at = NOW()
    WHERE id = p_text_id;
    
    RETURN TRUE;
END;
$$;

-- Fonction pour convoquer une CMP
CREATE OR REPLACE FUNCTION convene_cmp(
    p_text_id UUID,
    p_assembly_members UUID[],
    p_senate_members UUID[]
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cmp_id UUID;
    v_user_role parliamentary_role;
BEGIN
    -- Vérifier les permissions
    SELECT parliamentary_role INTO v_user_role
    FROM profiles WHERE id = auth.uid();
    
    IF v_user_role NOT IN ('AN_PRESIDENT', 'SN_PRESIDENT', 'PG_PRESIDENT', 'SUPER_ADMIN') THEN
        RAISE EXCEPTION 'Permission denied: only Presidents can convene CMP';
    END IF;
    
    -- Vérifier la composition (7+7)
    IF array_length(p_assembly_members, 1) != 7 OR array_length(p_senate_members, 1) != 7 THEN
        RAISE EXCEPTION 'CMP must have exactly 7 members from each chamber';
    END IF;
    
    -- Créer la session CMP
    INSERT INTO cmp_sessions (
        legislative_text_id,
        assembly_members,
        senate_members,
        status,
        convened_at
    ) VALUES (
        p_text_id,
        p_assembly_members,
        p_senate_members,
        'PENDING',
        NOW()
    ) RETURNING id INTO v_cmp_id;
    
    -- Mettre à jour la localisation du texte
    UPDATE legislative_texts
    SET 
        current_location = 'CMP_CONVENED',
        updated_at = NOW()
    WHERE id = p_text_id;
    
    -- Marquer les membres comme membres CMP
    UPDATE profiles
    SET cmp_member = TRUE
    WHERE id = ANY(p_assembly_members) OR id = ANY(p_senate_members);
    
    RETURN v_cmp_id;
END;
$$;

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

-- Trigger pour mettre à jour le timestamp updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS legislative_texts_updated_at ON legislative_texts;
CREATE TRIGGER legislative_texts_updated_at
    BEFORE UPDATE ON legislative_texts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS cmp_sessions_updated_at ON cmp_sessions;
CREATE TRIGGER cmp_sessions_updated_at
    BEFORE UPDATE ON cmp_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 9. DONNEES INITIALES (Commissions)
-- ============================================================================

-- Table des commissions permanentes
CREATE TABLE IF NOT EXISTS permanent_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    institution institution_type NOT NULL,
    description TEXT,
    president_id UUID REFERENCES profiles(id),
    vice_president_id UUID REFERENCES profiles(id),
    secretary_id UUID REFERENCES profiles(id),
    members UUID[],
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_institution ON permanent_commissions(institution);

-- Commentaire sur l'architecture
COMMENT ON TABLE legislative_texts IS 'Table principale pour le suivi des textes législatifs dans la navette parlementaire';
COMMENT ON TABLE legislative_shuttle_history IS 'Historique des transmissions entre les chambres';
COMMENT ON TABLE cmp_sessions IS 'Sessions de la Commission Mixte Paritaire (7 députés + 7 sénateurs)';
COMMENT ON COLUMN legislative_texts.current_location IS 'Localisation actuelle du texte dans le processus législatif';
COMMENT ON FUNCTION transmit_to_other_chamber IS 'Fonction pour transmettre un texte voté à l''autre chambre';
COMMENT ON FUNCTION convene_cmp IS 'Fonction pour convoquer une Commission Mixte Paritaire avec 14 membres';

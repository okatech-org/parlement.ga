-- ===========================================================================
-- PROMPT SQL POUR LOVABLE - ARCHITECTURE BICAMERALE PARLEMENT.GA
-- ===========================================================================
-- Ce script crée l'intégralité du schéma de données pour le système
-- parlementaire gabonais bicaméral (Assemblée Nationale + Sénat + Congrès)
-- 
-- À exécuter via Lovable SQL Editor ou Supabase Dashboard
-- ===========================================================================

-- ============================================================================
-- PARTIE 1 : TYPES ENUM
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
        'PG_PRESIDENT',
        'PG_SECRETAIRE_GENERAL',
        
        -- Administration
        'ADMIN_AN',
        'ADMIN_SN',
        'ADMIN_PG',
        'SUPER_ADMIN',
        
        -- Citoyens
        'CITIZEN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de texte législatif
DO $$ BEGIN
    CREATE TYPE text_type AS ENUM (
        'PROJET_LOI',           -- Projet de loi (Gouvernement)
        'PROPOSITION_LOI',      -- Proposition de loi (Parlementaires)
        'PROJET_LOI_FINANCES',  -- Projet de loi de finances
        'PROJET_LOI_CONST',     -- Révision constitutionnelle
        'RESOLUTION',           -- Résolution
        'MOTION',               -- Motion
        'QUESTION_ORALE',       -- Question orale
        'QUESTION_ECRITE'       -- Question écrite
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- PARTIE 2 : MODIFICATION DES TABLES EXISTANTES
-- ============================================================================

-- Ajouter institution aux profils utilisateurs (si la table profiles existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'profiles') THEN
        -- Ajouter les colonnes si elles n'existent pas
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS parliamentary_role parliamentary_role DEFAULT 'CITIZEN';
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS secondary_institution institution_type;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cmp_member BOOLEAN DEFAULT FALSE;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS commission_id UUID;
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS circonscription VARCHAR(255);
        ALTER TABLE profiles ADD COLUMN IF NOT EXISTS groupe_parlementaire VARCHAR(255);
    END IF;
END $$;

-- Ajouter institution aux documents (si la table documents existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'documents') THEN
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY';
        ALTER TABLE documents ADD COLUMN IF NOT EXISTS visibility institution_type[] DEFAULT ARRAY['ASSEMBLY']::institution_type[];
    END IF;
END $$;

-- Ajouter institution aux sessions (si la table sessions existe)
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'sessions') THEN
        ALTER TABLE sessions ADD COLUMN IF NOT EXISTS institution institution_type DEFAULT 'ASSEMBLY';
        ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_joint_session BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- ============================================================================
-- PARTIE 3 : NOUVELLES TABLES PRINCIPALES
-- ============================================================================

-- Table des textes législatifs (navette parlementaire)
CREATE TABLE IF NOT EXISTS legislative_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    reference VARCHAR(50) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_title VARCHAR(255),
    
    -- Classification
    text_type text_type NOT NULL DEFAULT 'PROJET_LOI',
    origin_institution institution_type NOT NULL DEFAULT 'ASSEMBLY',
    current_location legislative_location NOT NULL DEFAULT 'AN_DEPOT',
    
    -- Contenu
    content TEXT,
    expose_motifs TEXT,
    summary TEXT,
    
    -- Auteurs
    author_id UUID REFERENCES auth.users(id),
    author_name VARCHAR(255),
    co_authors JSONB DEFAULT '[]',
    
    -- Commission de référence
    commission_id UUID,
    commission_name VARCHAR(255),
    rapporteur_id UUID REFERENCES auth.users(id),
    rapporteur_name VARCHAR(255),
    
    -- Suivi temporel
    deposited_at TIMESTAMPTZ DEFAULT NOW(),
    transmitted_at TIMESTAMPTZ,
    adopted_at TIMESTAMPTZ,
    promulgated_at TIMESTAMPTZ,
    journal_officiel_date DATE,
    journal_officiel_ref VARCHAR(100),
    
    -- Navette
    reading_number INTEGER DEFAULT 1,
    shuttle_count INTEGER DEFAULT 0,
    
    -- Versions
    version INTEGER DEFAULT 1,
    parent_version_id UUID REFERENCES legislative_texts(id),
    
    -- Métadonnées
    urgency BOOLEAN DEFAULT FALSE,
    priority_level INTEGER DEFAULT 0,
    tags TEXT[],
    keywords TEXT[],
    
    -- Statistiques
    view_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour les textes législatifs
CREATE INDEX IF NOT EXISTS idx_legislative_texts_location ON legislative_texts(current_location);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_institution ON legislative_texts(origin_institution);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_reference ON legislative_texts(reference);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_text_type ON legislative_texts(text_type);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_author ON legislative_texts(author_id);

-- Table de l'historique de la navette
CREATE TABLE IF NOT EXISTS legislative_shuttle_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id) ON DELETE CASCADE,
    
    from_location legislative_location NOT NULL,
    to_location legislative_location NOT NULL,
    
    transmitted_by UUID REFERENCES auth.users(id),
    transmitted_by_name VARCHAR(255),
    transmission_note TEXT,
    
    text_version_before INTEGER,
    text_version_after INTEGER,
    
    transmitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shuttle_history_text ON legislative_shuttle_history(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_shuttle_history_date ON legislative_shuttle_history(transmitted_at);

-- Table des sessions CMP
CREATE TABLE IF NOT EXISTS cmp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) NOT NULL UNIQUE,
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id),
    
    -- Composition (7 députés + 7 sénateurs)
    assembly_members JSONB NOT NULL DEFAULT '[]',
    senate_members JSONB NOT NULL DEFAULT '[]',
    
    -- Présidence
    president_id UUID REFERENCES auth.users(id),
    president_name VARCHAR(255),
    rapporteur_an_id UUID REFERENCES auth.users(id),
    rapporteur_an_name VARCHAR(255),
    rapporteur_sn_id UUID REFERENCES auth.users(id),
    rapporteur_sn_name VARCHAR(255),
    
    -- Statut
    status VARCHAR(50) DEFAULT 'PENDING',
    
    -- Résultat
    agreed_text TEXT,
    failure_reason TEXT,
    conclusion_vote_for INTEGER,
    conclusion_vote_against INTEGER,
    conclusion_vote_abstain INTEGER,
    
    -- Dates
    convened_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    concluded_at TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    
    -- Documents
    documents JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmp_text ON cmp_sessions(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_cmp_status ON cmp_sessions(status);

-- Table des messages CMP (négociations)
CREATE TABLE IF NOT EXISTS cmp_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cmp_session_id UUID NOT NULL REFERENCES cmp_sessions(id) ON DELETE CASCADE,
    
    author_id UUID REFERENCES auth.users(id),
    author_name VARCHAR(255) NOT NULL,
    author_institution institution_type NOT NULL,
    author_role VARCHAR(100),
    
    content TEXT NOT NULL,
    message_type VARCHAR(50) DEFAULT 'MESSAGE',
    
    reply_to_id UUID REFERENCES cmp_messages(id),
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmp_messages_session ON cmp_messages(cmp_session_id);

-- Table des commissions permanentes
CREATE TABLE IF NOT EXISTS permanent_commissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(50),
    institution institution_type NOT NULL,
    description TEXT,
    
    president_id UUID REFERENCES auth.users(id),
    president_name VARCHAR(255),
    vice_president_id UUID REFERENCES auth.users(id),
    vice_president_name VARCHAR(255),
    secretary_id UUID REFERENCES auth.users(id),
    secretary_name VARCHAR(255),
    
    members JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_institution ON permanent_commissions(institution);

-- Table des sessions parlementaires
CREATE TABLE IF NOT EXISTS parliamentary_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    session_type VARCHAR(50) NOT NULL,
    institution institution_type NOT NULL,
    is_joint_session BOOLEAN DEFAULT FALSE,
    
    description TEXT,
    agenda JSONB DEFAULT '[]',
    
    location VARCHAR(255),
    
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    
    status VARCHAR(50) DEFAULT 'SCHEDULED',
    
    president_id UUID REFERENCES auth.users(id),
    president_name VARCHAR(255),
    
    attendees JSONB DEFAULT '[]',
    documents JSONB DEFAULT '[]',
    
    live_stream_url VARCHAR(500),
    recording_url VARCHAR(500),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_institution ON parliamentary_sessions(institution);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON parliamentary_sessions(scheduled_start);
CREATE INDEX IF NOT EXISTS idx_sessions_status ON parliamentary_sessions(status);

-- Table des votes
CREATE TABLE IF NOT EXISTS parliamentary_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislative_text_id UUID REFERENCES legislative_texts(id),
    session_id UUID REFERENCES parliamentary_sessions(id),
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    vote_type VARCHAR(50) NOT NULL,
    institution institution_type NOT NULL,
    
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    votes_absent INTEGER DEFAULT 0,
    
    quorum_required INTEGER,
    quorum_reached BOOLEAN,
    
    result VARCHAR(50),
    
    voting_started_at TIMESTAMPTZ,
    voting_ended_at TIMESTAMPTZ,
    
    individual_votes JSONB DEFAULT '[]',
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_votes_text ON parliamentary_votes(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_votes_session ON parliamentary_votes(session_id);
CREATE INDEX IF NOT EXISTS idx_votes_institution ON parliamentary_votes(institution);

-- Table des amendements
CREATE TABLE IF NOT EXISTS amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id) ON DELETE CASCADE,
    
    reference VARCHAR(50) NOT NULL,
    article_number VARCHAR(50),
    
    author_id UUID REFERENCES auth.users(id),
    author_name VARCHAR(255),
    author_institution institution_type,
    
    original_text TEXT,
    proposed_text TEXT NOT NULL,
    justification TEXT,
    
    status VARCHAR(50) DEFAULT 'PENDING',
    
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    
    examined_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_amendments_text ON amendments(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_amendments_author ON amendments(author_id);
CREATE INDEX IF NOT EXISTS idx_amendments_status ON amendments(status);

-- Table des parlementaires (extension de profiles)
CREATE TABLE IF NOT EXISTS parliamentarians (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    
    -- Identité
    title VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    birth_place VARCHAR(255),
    photo_url VARCHAR(500),
    
    -- Mandat
    institution institution_type NOT NULL,
    role parliamentary_role NOT NULL,
    circonscription VARCHAR(255),
    province VARCHAR(100),
    department VARCHAR(100),
    
    -- Politique
    groupe_parlementaire VARCHAR(255),
    parti_politique VARCHAR(255),
    
    -- Mandat dates
    mandate_start DATE,
    mandate_end DATE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Contact
    email_pro VARCHAR(255),
    phone_pro VARCHAR(50),
    office_location VARCHAR(255),
    
    -- Biographie
    biography TEXT,
    education JSONB DEFAULT '[]',
    career JSONB DEFAULT '[]',
    
    -- Commissions
    commissions JSONB DEFAULT '[]',
    
    -- Statistiques
    texts_authored INTEGER DEFAULT 0,
    amendments_authored INTEGER DEFAULT 0,
    questions_asked INTEGER DEFAULT 0,
    attendance_rate DECIMAL(5,2),
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_parliamentarians_institution ON parliamentarians(institution);
CREATE INDEX IF NOT EXISTS idx_parliamentarians_role ON parliamentarians(role);
CREATE INDEX IF NOT EXISTS idx_parliamentarians_active ON parliamentarians(is_active);

-- ============================================================================
-- PARTIE 4 : ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Activer RLS sur toutes les tables
ALTER TABLE legislative_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislative_shuttle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE permanent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentary_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentary_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE amendments ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentarians ENABLE ROW LEVEL SECURITY;

-- Politiques pour legislative_texts
CREATE POLICY "Public can view adopted texts" ON legislative_texts
    FOR SELECT USING (
        current_location IN ('ADOPTED', 'PROMULGATED', 'ARCHIVED')
    );

CREATE POLICY "Authenticated can view all texts" ON legislative_texts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authors can insert texts" ON legislative_texts
    FOR INSERT TO authenticated
    WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and admins can update texts" ON legislative_texts
    FOR UPDATE TO authenticated
    USING (
        author_id = auth.uid() 
        OR EXISTS (
            SELECT 1 FROM parliamentarians 
            WHERE id = auth.uid() 
            AND role IN ('AN_PRESIDENT', 'SN_PRESIDENT', 'ADMIN_AN', 'ADMIN_SN', 'SUPER_ADMIN')
        )
    );

-- Politiques pour CMP
CREATE POLICY "Public can view concluded CMP" ON cmp_sessions
    FOR SELECT USING (status IN ('AGREEMENT', 'FAILURE'));

CREATE POLICY "CMP members can view their sessions" ON cmp_sessions
    FOR SELECT TO authenticated USING (
        assembly_members @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
        OR senate_members @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
        OR EXISTS (
            SELECT 1 FROM parliamentarians 
            WHERE id = auth.uid() 
            AND role IN ('PG_PRESIDENT', 'ADMIN_PG', 'SUPER_ADMIN')
        )
    );

-- Politiques pour messages CMP
CREATE POLICY "CMP members can view messages" ON cmp_messages
    FOR SELECT TO authenticated USING (
        EXISTS (
            SELECT 1 FROM cmp_sessions 
            WHERE id = cmp_session_id 
            AND (
                assembly_members @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
                OR senate_members @> jsonb_build_array(jsonb_build_object('id', auth.uid()::text))
            )
        )
    );

CREATE POLICY "CMP members can insert messages" ON cmp_messages
    FOR INSERT TO authenticated
    WITH CHECK (author_id = auth.uid());

-- Politiques pour sessions parlementaires
CREATE POLICY "Public can view past sessions" ON parliamentary_sessions
    FOR SELECT USING (status = 'COMPLETED');

CREATE POLICY "Authenticated can view all sessions" ON parliamentary_sessions
    FOR SELECT TO authenticated USING (true);

-- Politiques pour votes
CREATE POLICY "Public can view votes" ON parliamentary_votes
    FOR SELECT USING (true);

-- Politiques pour amendements
CREATE POLICY "Public can view amendments" ON amendments
    FOR SELECT USING (true);

CREATE POLICY "Parliamentarians can insert amendments" ON amendments
    FOR INSERT TO authenticated
    WITH CHECK (author_id = auth.uid());

-- Politiques pour parlementaires
CREATE POLICY "Public can view parliamentarians" ON parliamentarians
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can view all parliamentarians" ON parliamentarians
    FOR SELECT TO authenticated USING (true);

-- Politiques pour commissions
CREATE POLICY "Public can view commissions" ON permanent_commissions
    FOR SELECT USING (true);

-- Politiques pour historique navette
CREATE POLICY "Authenticated can view shuttle history" ON legislative_shuttle_history
    FOR SELECT TO authenticated USING (true);

-- ============================================================================
-- PARTIE 5 : FONCTIONS ET TRIGGERS
-- ============================================================================

-- Fonction de mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_legislative_texts_updated_at ON legislative_texts;
CREATE TRIGGER update_legislative_texts_updated_at
    BEFORE UPDATE ON legislative_texts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_cmp_sessions_updated_at ON cmp_sessions;
CREATE TRIGGER update_cmp_sessions_updated_at
    BEFORE UPDATE ON cmp_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_parliamentary_sessions_updated_at ON parliamentary_sessions;
CREATE TRIGGER update_parliamentary_sessions_updated_at
    BEFORE UPDATE ON parliamentary_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_amendments_updated_at ON amendments;
CREATE TRIGGER update_amendments_updated_at
    BEFORE UPDATE ON amendments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_parliamentarians_updated_at ON parliamentarians;
CREATE TRIGGER update_parliamentarians_updated_at
    BEFORE UPDATE ON parliamentarians
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour transmettre un texte à l'autre chambre
CREATE OR REPLACE FUNCTION transmit_legislative_text(
    p_text_id UUID,
    p_note TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_current_location legislative_location;
    v_new_location legislative_location;
    v_user_id UUID;
    v_user_name VARCHAR;
    v_result JSONB;
BEGIN
    v_user_id := auth.uid();
    
    -- Récupérer la localisation actuelle
    SELECT current_location INTO v_current_location
    FROM legislative_texts WHERE id = p_text_id;
    
    IF v_current_location IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Texte non trouvé');
    END IF;
    
    -- Récupérer le nom de l'utilisateur
    SELECT COALESCE(first_name || ' ' || last_name, 'Système') INTO v_user_name
    FROM parliamentarians WHERE id = v_user_id;
    
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
        WHEN 'CMP_AGREEMENT' THEN
            v_new_location := 'FINAL_AN';
        ELSE
            RETURN jsonb_build_object('success', false, 'error', 'Transmission impossible depuis cet état: ' || v_current_location::text);
    END CASE;
    
    -- Enregistrer dans l'historique
    INSERT INTO legislative_shuttle_history (
        legislative_text_id, from_location, to_location, 
        transmitted_by, transmitted_by_name, transmission_note
    ) VALUES (
        p_text_id, v_current_location, v_new_location, 
        v_user_id, v_user_name, p_note
    );
    
    -- Mettre à jour le texte
    UPDATE legislative_texts
    SET 
        current_location = v_new_location,
        transmitted_at = NOW(),
        shuttle_count = shuttle_count + 1,
        updated_at = NOW()
    WHERE id = p_text_id;
    
    RETURN jsonb_build_object(
        'success', true, 
        'from', v_current_location::text,
        'to', v_new_location::text
    );
END;
$$;

-- Fonction pour convoquer une CMP
CREATE OR REPLACE FUNCTION convene_cmp(
    p_text_id UUID,
    p_assembly_members JSONB,
    p_senate_members JSONB,
    p_deadline TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cmp_id UUID;
    v_reference VARCHAR;
    v_text_title VARCHAR;
BEGIN
    -- Vérifier la composition (7+7)
    IF jsonb_array_length(p_assembly_members) != 7 OR jsonb_array_length(p_senate_members) != 7 THEN
        RETURN jsonb_build_object('success', false, 'error', 'La CMP doit comporter exactement 7 membres de chaque chambre');
    END IF;
    
    -- Générer la référence
    SELECT 'CMP-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD((COUNT(*) + 1)::text, 3, '0')
    INTO v_reference
    FROM cmp_sessions 
    WHERE EXTRACT(YEAR FROM convened_at) = EXTRACT(YEAR FROM NOW());
    
    -- Récupérer le titre du texte
    SELECT title INTO v_text_title FROM legislative_texts WHERE id = p_text_id;
    
    -- Créer la session CMP
    INSERT INTO cmp_sessions (
        reference,
        legislative_text_id,
        assembly_members,
        senate_members,
        status,
        convened_at,
        deadline
    ) VALUES (
        v_reference,
        p_text_id,
        p_assembly_members,
        p_senate_members,
        'PENDING',
        NOW(),
        COALESCE(p_deadline, NOW() + INTERVAL '15 days')
    ) RETURNING id INTO v_cmp_id;
    
    -- Mettre à jour la localisation du texte
    UPDATE legislative_texts
    SET 
        current_location = 'CMP_CONVENED',
        updated_at = NOW()
    WHERE id = p_text_id;
    
    RETURN jsonb_build_object(
        'success', true,
        'cmp_id', v_cmp_id,
        'reference', v_reference
    );
END;
$$;

-- Fonction pour conclure une CMP
CREATE OR REPLACE FUNCTION conclude_cmp(
    p_cmp_id UUID,
    p_result VARCHAR,
    p_agreed_text TEXT DEFAULT NULL,
    p_failure_reason TEXT DEFAULT NULL,
    p_votes JSONB DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_text_id UUID;
    v_new_location legislative_location;
BEGIN
    -- Récupérer le texte associé
    SELECT legislative_text_id INTO v_text_id
    FROM cmp_sessions WHERE id = p_cmp_id;
    
    IF v_text_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'CMP non trouvée');
    END IF;
    
    -- Déterminer la nouvelle localisation
    IF p_result = 'AGREEMENT' THEN
        v_new_location := 'CMP_AGREEMENT';
    ELSE
        v_new_location := 'CMP_FAILURE';
    END IF;
    
    -- Mettre à jour la CMP
    UPDATE cmp_sessions
    SET 
        status = p_result,
        agreed_text = p_agreed_text,
        failure_reason = p_failure_reason,
        conclusion_vote_for = (p_votes->>'for')::integer,
        conclusion_vote_against = (p_votes->>'against')::integer,
        conclusion_vote_abstain = (p_votes->>'abstain')::integer,
        concluded_at = NOW(),
        updated_at = NOW()
    WHERE id = p_cmp_id;
    
    -- Mettre à jour le texte
    UPDATE legislative_texts
    SET 
        current_location = v_new_location,
        updated_at = NOW()
    WHERE id = v_text_id;
    
    RETURN jsonb_build_object('success', true, 'result', p_result);
END;
$$;

-- Fonction pour obtenir les statistiques parlementaires
CREATE OR REPLACE FUNCTION get_parliamentary_stats(p_institution institution_type DEFAULT NULL)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_texts', (
            SELECT COUNT(*) FROM legislative_texts 
            WHERE (p_institution IS NULL OR origin_institution = p_institution)
        ),
        'texts_in_progress', (
            SELECT COUNT(*) FROM legislative_texts 
            WHERE (p_institution IS NULL OR origin_institution = p_institution)
            AND current_location NOT IN ('ADOPTED', 'PROMULGATED', 'ARCHIVED', 'AN_REJECTED', 'SN_REJECTED')
        ),
        'texts_adopted', (
            SELECT COUNT(*) FROM legislative_texts 
            WHERE (p_institution IS NULL OR origin_institution = p_institution)
            AND current_location IN ('ADOPTED', 'PROMULGATED')
        ),
        'active_cmps', (
            SELECT COUNT(*) FROM cmp_sessions 
            WHERE status IN ('PENDING', 'IN_PROGRESS')
        ),
        'active_parliamentarians', (
            SELECT COUNT(*) FROM parliamentarians 
            WHERE is_active = true
            AND (p_institution IS NULL OR institution = p_institution)
        ),
        'upcoming_sessions', (
            SELECT COUNT(*) FROM parliamentary_sessions 
            WHERE scheduled_start > NOW()
            AND (p_institution IS NULL OR institution = p_institution)
        )
    ) INTO v_result;
    
    RETURN v_result;
END;
$$;

-- ============================================================================
-- PARTIE 6 : DONNÉES INITIALES
-- ============================================================================

-- Commissions permanentes de l'Assemblée Nationale
INSERT INTO permanent_commissions (name, short_name, institution, description) VALUES
('Commission des Lois Constitutionnelles, de la Législation et de l''Administration Générale', 'Lois', 'ASSEMBLY', 'Questions constitutionnelles, législation générale, administration'),
('Commission des Finances, du Budget et de la Comptabilité Publique', 'Finances', 'ASSEMBLY', 'Budget, fiscalité, comptabilité publique'),
('Commission des Affaires Économiques et du Développement Durable', 'Économie', 'ASSEMBLY', 'Économie, développement durable, environnement'),
('Commission des Affaires Sociales et Culturelles', 'Affaires Sociales', 'ASSEMBLY', 'Travail, santé, éducation, culture'),
('Commission de la Défense Nationale et de la Sécurité', 'Défense', 'ASSEMBLY', 'Défense, sécurité intérieure'),
('Commission des Affaires Étrangères et de la Coopération', 'Affaires Étrangères', 'ASSEMBLY', 'Relations internationales, coopération')
ON CONFLICT DO NOTHING;

-- Commissions permanentes du Sénat
INSERT INTO permanent_commissions (name, short_name, institution, description) VALUES
('Commission des Lois Constitutionnelles, de la Législation et de l''Administration', 'Lois', 'SENATE', 'Questions constitutionnelles, législation générale'),
('Commission des Finances et du Budget', 'Finances', 'SENATE', 'Budget, finances publiques'),
('Commission de l''Économie et du Développement', 'Économie', 'SENATE', 'Économie, développement local'),
('Commission des Affaires Sociales', 'Affaires Sociales', 'SENATE', 'Questions sociales, santé, éducation'),
('Commission de la Défense et de la Sécurité', 'Défense', 'SENATE', 'Défense, sécurité'),
('Commission des Collectivités Locales', 'Collectivités', 'SENATE', 'Collectivités territoriales, décentralisation')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- PARTIE 7 : COMMENTAIRES ET DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE legislative_texts IS 'Table principale des textes législatifs (projets de loi, propositions de loi, etc.) avec suivi de la navette parlementaire';
COMMENT ON TABLE legislative_shuttle_history IS 'Historique complet des transmissions de textes entre les deux chambres';
COMMENT ON TABLE cmp_sessions IS 'Sessions de la Commission Mixte Paritaire (7 députés + 7 sénateurs)';
COMMENT ON TABLE cmp_messages IS 'Messages de négociation au sein des CMP';
COMMENT ON TABLE permanent_commissions IS 'Commissions permanentes des deux chambres';
COMMENT ON TABLE parliamentary_sessions IS 'Sessions parlementaires (plénières, commissions, etc.)';
COMMENT ON TABLE parliamentary_votes IS 'Résultats des votes parlementaires';
COMMENT ON TABLE amendments IS 'Amendements proposés aux textes législatifs';
COMMENT ON TABLE parliamentarians IS 'Informations détaillées sur les parlementaires';

COMMENT ON FUNCTION transmit_legislative_text IS 'Transmet un texte adopté à l''autre chambre (navette parlementaire)';
COMMENT ON FUNCTION convene_cmp IS 'Convoque une Commission Mixte Paritaire avec 7 membres de chaque chambre';
COMMENT ON FUNCTION conclude_cmp IS 'Conclut une CMP avec accord ou échec';
COMMENT ON FUNCTION get_parliamentary_stats IS 'Retourne les statistiques parlementaires globales ou par institution';

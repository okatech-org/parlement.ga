-- ===========================================================================
-- ARCHITECTURE BICAMERALE PARLEMENT.GA
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
        'AN_DEPOT', 'AN_BUREAU', 'AN_COMMISSION', 'AN_PLENIERE', 'AN_VOTE', 'AN_ADOPTED', 'AN_REJECTED',
        'SN_DEPOT', 'SN_BUREAU', 'SN_COMMISSION', 'SN_PLENIERE', 'SN_VOTE', 'SN_ADOPTED', 'SN_REJECTED',
        'NAVETTE_AN_TO_SN', 'NAVETTE_SN_TO_AN',
        'CMP_CONVENED', 'CMP_IN_PROGRESS', 'CMP_AGREEMENT', 'CMP_FAILURE',
        'FINAL_AN', 'FINAL_SN', 'ADOPTED', 'PROMULGATED', 'ARCHIVED'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de rôle parlementaire
DO $$ BEGIN
    CREATE TYPE parliamentary_role AS ENUM (
        'AN_DEPUTE', 'AN_DEPUTE_SUPPLEANT', 'AN_PRESIDENT', 'AN_VICE_PRESIDENT',
        'AN_QUESTEUR', 'AN_SECRETAIRE', 'AN_PRESIDENT_COMMISSION',
        'SN_SENATEUR', 'SN_SENATEUR_SUPPLEANT', 'SN_PRESIDENT', 'SN_VICE_PRESIDENT',
        'SN_QUESTEUR', 'SN_SECRETAIRE', 'SN_PRESIDENT_COMMISSION',
        'PG_PRESIDENT', 'PG_SECRETAIRE_GENERAL',
        'ADMIN_AN', 'ADMIN_SN', 'ADMIN_PG', 'SUPER_ADMIN', 'CITIZEN'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Type de texte législatif
DO $$ BEGIN
    CREATE TYPE text_type AS ENUM (
        'PROJET_LOI', 'PROPOSITION_LOI', 'PROJET_LOI_FINANCES',
        'PROJET_LOI_CONST', 'RESOLUTION', 'MOTION', 'QUESTION_ORALE', 'QUESTION_ECRITE'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================================================
-- PARTIE 2 : TABLES PRINCIPALES
-- ============================================================================

-- Table des textes législatifs
CREATE TABLE IF NOT EXISTS legislative_texts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) NOT NULL UNIQUE,
    title TEXT NOT NULL,
    short_title VARCHAR(255),
    text_type text_type NOT NULL DEFAULT 'PROJET_LOI',
    origin_institution institution_type NOT NULL DEFAULT 'ASSEMBLY',
    current_location legislative_location NOT NULL DEFAULT 'AN_DEPOT',
    content TEXT,
    expose_motifs TEXT,
    summary TEXT,
    author_id UUID REFERENCES auth.users(id),
    author_name VARCHAR(255),
    co_authors JSONB DEFAULT '[]',
    commission_id UUID,
    commission_name VARCHAR(255),
    rapporteur_id UUID REFERENCES auth.users(id),
    rapporteur_name VARCHAR(255),
    deposited_at TIMESTAMPTZ DEFAULT NOW(),
    transmitted_at TIMESTAMPTZ,
    adopted_at TIMESTAMPTZ,
    promulgated_at TIMESTAMPTZ,
    journal_officiel_date DATE,
    journal_officiel_ref VARCHAR(100),
    reading_number INTEGER DEFAULT 1,
    shuttle_count INTEGER DEFAULT 0,
    version INTEGER DEFAULT 1,
    parent_version_id UUID REFERENCES legislative_texts(id),
    urgency BOOLEAN DEFAULT FALSE,
    priority_level INTEGER DEFAULT 0,
    tags TEXT[],
    keywords TEXT[],
    view_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_legislative_texts_location ON legislative_texts(current_location);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_institution ON legislative_texts(origin_institution);
CREATE INDEX IF NOT EXISTS idx_legislative_texts_reference ON legislative_texts(reference);

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

-- Table des sessions CMP
CREATE TABLE IF NOT EXISTS cmp_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference VARCHAR(50) NOT NULL UNIQUE,
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id),
    assembly_members JSONB NOT NULL DEFAULT '[]',
    senate_members JSONB NOT NULL DEFAULT '[]',
    president_id UUID REFERENCES auth.users(id),
    president_name VARCHAR(255),
    rapporteur_an_id UUID REFERENCES auth.users(id),
    rapporteur_an_name VARCHAR(255),
    rapporteur_sn_id UUID REFERENCES auth.users(id),
    rapporteur_sn_name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'PENDING',
    agreed_text TEXT,
    failure_reason TEXT,
    conclusion_vote_for INTEGER,
    conclusion_vote_against INTEGER,
    conclusion_vote_abstain INTEGER,
    convened_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ,
    concluded_at TIMESTAMPTZ,
    deadline TIMESTAMPTZ,
    documents JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmp_text ON cmp_sessions(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_cmp_status ON cmp_sessions(status);

-- Table des messages CMP
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
CREATE INDEX IF NOT EXISTS idx_votes_institution ON parliamentary_votes(institution);

-- Table des parlementaires
CREATE TABLE IF NOT EXISTS parliamentarians (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    title VARCHAR(50),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE,
    birth_place VARCHAR(255),
    photo_url VARCHAR(500),
    institution institution_type NOT NULL,
    role parliamentary_role NOT NULL,
    circonscription VARCHAR(255),
    province VARCHAR(100),
    department VARCHAR(100),
    groupe_parlementaire VARCHAR(255),
    parti_politique VARCHAR(255),
    mandate_start DATE,
    mandate_end DATE,
    is_active BOOLEAN DEFAULT TRUE,
    email_pro VARCHAR(255),
    phone_pro VARCHAR(50),
    office_location VARCHAR(255),
    biography TEXT,
    education JSONB DEFAULT '[]',
    career JSONB DEFAULT '[]',
    commissions JSONB DEFAULT '[]',
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
-- PARTIE 3 : ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE legislative_texts ENABLE ROW LEVEL SECURITY;
ALTER TABLE legislative_shuttle_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmp_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cmp_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE permanent_commissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentary_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentary_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE parliamentarians ENABLE ROW LEVEL SECURITY;

-- Politiques pour legislative_texts
CREATE POLICY "Public can view adopted texts" ON legislative_texts
    FOR SELECT USING (current_location IN ('ADOPTED', 'PROMULGATED', 'ARCHIVED'));

CREATE POLICY "Authenticated can view all texts" ON legislative_texts
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authors can insert texts" ON legislative_texts
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors and admins can update texts" ON legislative_texts
    FOR UPDATE TO authenticated USING (author_id = auth.uid());

-- Politiques pour CMP
CREATE POLICY "Authenticated can view CMP" ON cmp_sessions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage CMP" ON cmp_sessions
    FOR ALL TO authenticated USING (true);

-- Politiques pour messages CMP
CREATE POLICY "CMP members can view messages" ON cmp_messages
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "CMP members can insert messages" ON cmp_messages
    FOR INSERT TO authenticated WITH CHECK (author_id = auth.uid());

-- Politiques pour sessions parlementaires
CREATE POLICY "Public can view sessions" ON parliamentary_sessions
    FOR SELECT USING (true);

CREATE POLICY "Authenticated can manage sessions" ON parliamentary_sessions
    FOR ALL TO authenticated USING (true);

-- Politiques pour votes
CREATE POLICY "Public can view votes" ON parliamentary_votes
    FOR SELECT USING (true);

-- Politiques pour commissions
CREATE POLICY "Public can view commissions" ON permanent_commissions
    FOR SELECT USING (true);

-- Politiques pour parlementaires
CREATE POLICY "Public can view active parliamentarians" ON parliamentarians
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can view all parliamentarians" ON parliamentarians
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Admins can manage parliamentarians" ON parliamentarians
    FOR ALL TO authenticated USING (true);

-- Politiques pour historique navette
CREATE POLICY "Authenticated can view shuttle history" ON legislative_shuttle_history
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "System can insert shuttle history" ON legislative_shuttle_history
    FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================================
-- PARTIE 4 : FONCTIONS
-- ============================================================================

-- Fonction pour transmettre un texte
CREATE OR REPLACE FUNCTION transmit_legislative_text(p_text_id UUID, p_note TEXT DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_current_location legislative_location;
    v_new_location legislative_location;
    v_user_id UUID;
    v_user_name VARCHAR;
BEGIN
    v_user_id := auth.uid();
    SELECT current_location INTO v_current_location FROM legislative_texts WHERE id = p_text_id;
    
    IF v_current_location IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Texte non trouvé');
    END IF;
    
    SELECT COALESCE(first_name || ' ' || last_name, 'Système') INTO v_user_name
    FROM parliamentarians WHERE id = v_user_id;
    
    CASE v_current_location
        WHEN 'AN_ADOPTED' THEN v_new_location := 'NAVETTE_AN_TO_SN';
        WHEN 'SN_ADOPTED' THEN v_new_location := 'NAVETTE_SN_TO_AN';
        WHEN 'NAVETTE_AN_TO_SN' THEN v_new_location := 'SN_BUREAU';
        WHEN 'NAVETTE_SN_TO_AN' THEN v_new_location := 'AN_BUREAU';
        WHEN 'CMP_AGREEMENT' THEN v_new_location := 'FINAL_AN';
        ELSE RETURN jsonb_build_object('success', false, 'error', 'Transmission impossible');
    END CASE;
    
    INSERT INTO legislative_shuttle_history (legislative_text_id, from_location, to_location, transmitted_by, transmitted_by_name, transmission_note)
    VALUES (p_text_id, v_current_location, v_new_location, v_user_id, v_user_name, p_note);
    
    UPDATE legislative_texts SET current_location = v_new_location, transmitted_at = NOW(), shuttle_count = shuttle_count + 1, updated_at = NOW()
    WHERE id = p_text_id;
    
    RETURN jsonb_build_object('success', true, 'from', v_current_location::text, 'to', v_new_location::text);
END;
$$;

-- Fonction pour convoquer une CMP
CREATE OR REPLACE FUNCTION convene_cmp(p_text_id UUID, p_assembly_members JSONB, p_senate_members JSONB, p_deadline TIMESTAMPTZ DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_cmp_id UUID;
    v_reference VARCHAR;
BEGIN
    IF jsonb_array_length(p_assembly_members) != 7 OR jsonb_array_length(p_senate_members) != 7 THEN
        RETURN jsonb_build_object('success', false, 'error', 'La CMP doit comporter 7 membres de chaque chambre');
    END IF;
    
    SELECT 'CMP-' || EXTRACT(YEAR FROM NOW())::text || '-' || LPAD((COUNT(*) + 1)::text, 3, '0')
    INTO v_reference FROM cmp_sessions WHERE EXTRACT(YEAR FROM convened_at) = EXTRACT(YEAR FROM NOW());
    
    INSERT INTO cmp_sessions (reference, legislative_text_id, assembly_members, senate_members, status, convened_at, deadline)
    VALUES (v_reference, p_text_id, p_assembly_members, p_senate_members, 'PENDING', NOW(), COALESCE(p_deadline, NOW() + INTERVAL '15 days'))
    RETURNING id INTO v_cmp_id;
    
    UPDATE legislative_texts SET current_location = 'CMP_CONVENED', updated_at = NOW() WHERE id = p_text_id;
    
    RETURN jsonb_build_object('success', true, 'cmp_id', v_cmp_id, 'reference', v_reference);
END;
$$;

-- Fonction pour conclure une CMP
CREATE OR REPLACE FUNCTION conclude_cmp(p_cmp_id UUID, p_result VARCHAR, p_agreed_text TEXT DEFAULT NULL, p_failure_reason TEXT DEFAULT NULL, p_votes JSONB DEFAULT NULL)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_text_id UUID;
    v_new_location legislative_location;
BEGIN
    SELECT legislative_text_id INTO v_text_id FROM cmp_sessions WHERE id = p_cmp_id;
    
    IF v_text_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'CMP non trouvée');
    END IF;
    
    IF p_result = 'AGREEMENT' THEN v_new_location := 'CMP_AGREEMENT';
    ELSE v_new_location := 'CMP_FAILURE';
    END IF;
    
    UPDATE cmp_sessions SET status = p_result, agreed_text = p_agreed_text, failure_reason = p_failure_reason,
        conclusion_vote_for = (p_votes->>'for')::integer, conclusion_vote_against = (p_votes->>'against')::integer,
        conclusion_vote_abstain = (p_votes->>'abstain')::integer, concluded_at = NOW(), updated_at = NOW()
    WHERE id = p_cmp_id;
    
    UPDATE legislative_texts SET current_location = v_new_location, updated_at = NOW() WHERE id = v_text_id;
    
    RETURN jsonb_build_object('success', true, 'result', p_result);
END;
$$;

-- ============================================================================
-- PARTIE 5 : DONNÉES INITIALES
-- ============================================================================

INSERT INTO permanent_commissions (name, short_name, institution, description) VALUES
('Commission des Lois', 'Lois', 'ASSEMBLY', 'Questions constitutionnelles et législation'),
('Commission des Finances', 'Finances', 'ASSEMBLY', 'Budget et fiscalité'),
('Commission de l''Économie', 'Économie', 'ASSEMBLY', 'Économie et développement'),
('Commission des Affaires Sociales', 'Affaires Sociales', 'ASSEMBLY', 'Travail, santé, éducation'),
('Commission de la Défense', 'Défense', 'ASSEMBLY', 'Défense et sécurité'),
('Commission des Affaires Étrangères', 'Affaires Étrangères', 'ASSEMBLY', 'Relations internationales'),
('Commission des Lois', 'Lois', 'SENATE', 'Questions constitutionnelles'),
('Commission des Finances', 'Finances', 'SENATE', 'Budget et finances'),
('Commission de l''Économie', 'Économie', 'SENATE', 'Économie et développement'),
('Commission des Affaires Sociales', 'Affaires Sociales', 'SENATE', 'Questions sociales'),
('Commission de la Défense', 'Défense', 'SENATE', 'Défense et sécurité'),
('Commission des Collectivités', 'Collectivités', 'SENATE', 'Collectivités territoriales')
ON CONFLICT DO NOTHING;
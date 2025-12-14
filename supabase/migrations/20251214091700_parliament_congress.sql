-- Migration: Parlement / Congrès - Sessions Conjointes et CMP
-- Description: Structures pour la convergence bicamérale (Congrès, CMP, Archives)

-- ============================================================================
-- 1. TABLE DES SESSIONS CONJOINTES (CONGRÈS)
-- ============================================================================

CREATE TABLE IF NOT EXISTS joint_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Identification
    reference VARCHAR(50) NOT NULL UNIQUE,  -- Ex: "CONG-2024-001"
    title TEXT NOT NULL,  -- Ex: "Révision Constitutionnelle - Article 47"
    session_type VARCHAR(50) NOT NULL,  -- 'CONSTITUTIONAL_REVISION', 'PRESIDENTIAL_ADDRESS', 'SPECIAL'
    
    -- Planification
    scheduled_date DATE NOT NULL,
    scheduled_time TIME,
    location VARCHAR(255) DEFAULT 'Palais du Parlement - Hémicycle Unifié',
    
    -- Ordre du jour
    agenda JSONB,  -- Liste des points à l'ordre du jour
    
    -- Quorum et présences
    quorum_required INTEGER DEFAULT 0,  -- Calculé: (Députés + Sénateurs) * 0.5
    quorum_reached BOOLEAN DEFAULT FALSE,
    deputies_present INTEGER DEFAULT 0,
    senators_present INTEGER DEFAULT 0,
    
    -- Majorité requise pour adoption
    majority_type VARCHAR(50) DEFAULT 'THREE_FIFTHS',  -- 'SIMPLE', 'ABSOLUTE', 'THREE_FIFTHS', 'TWO_THIRDS'
    
    -- Statut
    status VARCHAR(50) DEFAULT 'SCHEDULED',  -- SCHEDULED, IN_PROGRESS, CONCLUDED, CANCELLED
    
    -- Résultat du vote (si applicable)
    vote_result JSONB,  -- { for: N, against: N, abstain: N, adopted: bool }
    
    -- Horodatage
    convened_by UUID REFERENCES profiles(id),  -- Président de l'AN convoque
    opened_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_joint_sessions_date ON joint_sessions(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_joint_sessions_status ON joint_sessions(status);

-- ============================================================================
-- 2. TABLE DES ÉMARGEMENTS AU CONGRÈS
-- ============================================================================

CREATE TABLE IF NOT EXISTS congress_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    joint_session_id UUID NOT NULL REFERENCES joint_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Origine de l'élu
    origin_chamber VARCHAR(20) NOT NULL,  -- 'ASSEMBLY' ou 'SENATE'
    
    -- Émargement
    checked_in_at TIMESTAMPTZ DEFAULT NOW(),
    check_in_method VARCHAR(50),  -- 'MANUAL', 'BIOMETRIC', 'QR_CODE', 'GEOLOCATION'
    
    -- Géolocalisation (optionnel, pour vérification au Palais)
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    
    UNIQUE(joint_session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_congress_attendance_session ON congress_attendance(joint_session_id);

-- ============================================================================
-- 3. TABLE DES COMMISSIONS MIXTES PARITAIRES (CMP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cmp_committees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Loi concernée
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id),
    
    -- Identification
    reference VARCHAR(50) NOT NULL UNIQUE,  -- Ex: "CMP-2024-003"
    title TEXT NOT NULL,  -- Héritée du titre de la loi
    
    -- Statut de la négociation
    status VARCHAR(50) DEFAULT 'CONVENED',  -- CONVENED, NEGOTIATION, AGREEMENT, FAILURE, CLOSED
    
    -- Textes de travail
    assembly_text TEXT,  -- Version votée par l'AN
    senate_text TEXT,    -- Version votée par le Sénat
    compromise_text TEXT,  -- Texte de compromis en rédaction
    
    -- Dates clés
    convened_at TIMESTAMPTZ DEFAULT NOW(),
    first_meeting_at TIMESTAMPTZ,
    deadline TIMESTAMPTZ,  -- Généralement 8 jours après convocation
    concluded_at TIMESTAMPTZ,
    
    -- Résultat
    agreement_reached BOOLEAN,
    failure_reason TEXT,
    
    -- Métadonnées
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmp_committees_text ON cmp_committees(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_cmp_committees_status ON cmp_committees(status);

-- ============================================================================
-- 4. TABLE DES MEMBRES DE CMP
-- ============================================================================

CREATE TABLE IF NOT EXISTS cmp_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cmp_committee_id UUID NOT NULL REFERENCES cmp_committees(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Origine
    origin_chamber VARCHAR(20) NOT NULL,  -- 'ASSEMBLY' ou 'SENATE'
    
    -- Rôle dans la CMP
    role VARCHAR(50) NOT NULL DEFAULT 'TITULAR',  -- 'TITULAR', 'SUBSTITUTE', 'RAPPORTEUR_AN', 'RAPPORTEUR_SN', 'PRESIDENT'
    
    -- Participation
    active BOOLEAN DEFAULT TRUE,
    replaced_by UUID REFERENCES profiles(id),  -- Si remplacé par un suppléant
    
    -- Vote interne CMP
    last_vote JSONB,  -- Dernier vote sur un article
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(cmp_committee_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_cmp_members_committee ON cmp_members(cmp_committee_id);
CREATE INDEX IF NOT EXISTS idx_cmp_members_user ON cmp_members(user_id);

-- ============================================================================
-- 5. TABLE DES VOTES ARTICLE PAR ARTICLE (CMP)
-- ============================================================================

CREATE TABLE IF NOT EXISTS cmp_article_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cmp_committee_id UUID NOT NULL REFERENCES cmp_committees(id) ON DELETE CASCADE,
    article_number INTEGER NOT NULL,  -- Numéro de l'article voté
    
    -- Texte de l'article
    article_content TEXT NOT NULL,
    
    -- Résultat du vote
    votes_for INTEGER DEFAULT 0,
    votes_against INTEGER DEFAULT 0,
    votes_abstain INTEGER DEFAULT 0,
    
    -- Statut
    status VARCHAR(50) DEFAULT 'PENDING',  -- PENDING, ADOPTED, REJECTED, RESERVED
    
    voted_at TIMESTAMPTZ,
    
    UNIQUE(cmp_committee_id, article_number)
);

-- ============================================================================
-- 6. TABLE DU CHAT SÉCURISÉ CMP
-- ============================================================================

CREATE TABLE IF NOT EXISTS cmp_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cmp_committee_id UUID NOT NULL REFERENCES cmp_committees(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    
    -- Contenu
    message TEXT NOT NULL,
    
    -- Métadonnées
    is_system_message BOOLEAN DEFAULT FALSE,  -- Pour les notifs automatiques
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_cmp_chat_committee ON cmp_chat_messages(cmp_committee_id);
CREATE INDEX IF NOT EXISTS idx_cmp_chat_time ON cmp_chat_messages(created_at);

-- ============================================================================
-- 7. TABLE DES ARCHIVES NATIONALES
-- ============================================================================

CREATE TABLE IF NOT EXISTS national_archives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Classification
    document_type VARCHAR(50) NOT NULL,  -- 'LAW', 'DECREE', 'RESOLUTION', 'CONSTITUTION', 'TREATY'
    reference VARCHAR(100) NOT NULL UNIQUE,  -- Numéro officiel (ex: "Loi n°2024-015")
    
    -- Contenu
    title TEXT NOT NULL,
    short_title VARCHAR(255),
    content TEXT,  -- Texte intégral
    
    -- Dates officielles
    adopted_at DATE,
    promulgated_at DATE,
    published_at DATE,  -- Date de publication au JO
    effective_at DATE,  -- Date d'entrée en vigueur
    
    -- Origine
    origin_chamber VARCHAR(20),  -- 'ASSEMBLY', 'SENATE', 'JOINT'
    legislative_text_id UUID REFERENCES legislative_texts(id),
    
    -- Classification thématique
    domains TEXT[],  -- Ex: ['FINANCES', 'DÉCENTRALISATION', 'ENVIRONNEMENT']
    legislature INTEGER,  -- XIVème législature = 14
    
    -- Fichiers
    pdf_url TEXT,
    official_journal_number VARCHAR(50),  -- Numéro du JO
    
    -- Recherche full-text
    search_vector TSVECTOR,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_archives_type ON national_archives(document_type);
CREATE INDEX IF NOT EXISTS idx_archives_reference ON national_archives(reference);
CREATE INDEX IF NOT EXISTS idx_archives_search ON national_archives USING GIN(search_vector);

-- Trigger pour générer le vecteur de recherche
CREATE OR REPLACE FUNCTION update_archive_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('french', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('french', COALESCE(NEW.short_title, '')), 'B') ||
        setweight(to_tsvector('french', COALESCE(NEW.content, '')), 'C') ||
        setweight(to_tsvector('french', COALESCE(array_to_string(NEW.domains, ' '), '')), 'D');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS archives_search_vector_update ON national_archives;
CREATE TRIGGER archives_search_vector_update
    BEFORE INSERT OR UPDATE ON national_archives
    FOR EACH ROW
    EXECUTE FUNCTION update_archive_search_vector();

-- ============================================================================
-- 8. RLS POLICIES
-- ============================================================================

-- Sessions conjointes : Lecture publique
ALTER TABLE joint_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view joint sessions" ON joint_sessions
    FOR SELECT USING (TRUE);

CREATE POLICY "Only presidents can manage joint sessions" ON joint_sessions
    FOR ALL USING (
        (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) 
        IN ('AN_PRESIDENT', 'SN_PRESIDENT', 'PG_PRESIDENT', 'SUPER_ADMIN')
    );

-- Émargements : Chaque élu voit les siens
ALTER TABLE congress_attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can see and create their own attendance" ON congress_attendance
    FOR ALL USING (user_id = auth.uid() OR 
        (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG')
    );

-- CMP : Seuls les membres peuvent voir
ALTER TABLE cmp_committees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CMP members can view their committees" ON cmp_committees
    FOR SELECT USING (
        id IN (SELECT cmp_committee_id FROM cmp_members WHERE user_id = auth.uid())
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG', 'AN_PRESIDENT', 'SN_PRESIDENT')
    );

-- Membres CMP
ALTER TABLE cmp_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CMP members can view membership" ON cmp_members
    FOR SELECT USING (
        cmp_committee_id IN (SELECT cmp_committee_id FROM cmp_members WHERE user_id = auth.uid())
        OR (SELECT parliamentary_role FROM profiles WHERE id = auth.uid()) IN ('SUPER_ADMIN', 'ADMIN_PG')
    );

-- Chat CMP : Strictement privé
ALTER TABLE cmp_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "CMP members can access chat" ON cmp_chat_messages
    FOR ALL USING (
        cmp_committee_id IN (SELECT cmp_committee_id FROM cmp_members WHERE user_id = auth.uid())
    );

-- Archives : Lecture publique
ALTER TABLE national_archives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view national archives" ON national_archives
    FOR SELECT USING (TRUE);

-- ============================================================================
-- 9. FONCTION : Émarger au Congrès
-- ============================================================================

CREATE OR REPLACE FUNCTION congress_check_in(
    p_session_id UUID,
    p_latitude DECIMAL DEFAULT NULL,
    p_longitude DECIMAL DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_institution institution_type;
    v_origin_chamber VARCHAR(20);
BEGIN
    v_user_id := auth.uid();
    
    -- Récupérer la chambre d'origine
    SELECT institution INTO v_institution FROM profiles WHERE id = v_user_id;
    
    IF v_institution = 'ASSEMBLY' THEN
        v_origin_chamber := 'ASSEMBLY';
    ELSIF v_institution = 'SENATE' THEN
        v_origin_chamber := 'SENATE';
    ELSE
        RAISE EXCEPTION 'Only deputies and senators can attend Congress';
    END IF;
    
    -- Insérer l'émargement
    INSERT INTO congress_attendance (
        joint_session_id, user_id, origin_chamber, 
        check_in_method, latitude, longitude
    ) VALUES (
        p_session_id, v_user_id, v_origin_chamber,
        CASE WHEN p_latitude IS NOT NULL THEN 'GEOLOCATION' ELSE 'MANUAL' END,
        p_latitude, p_longitude
    )
    ON CONFLICT (joint_session_id, user_id) DO UPDATE
    SET checked_in_at = NOW();
    
    -- Mettre à jour les compteurs de la session
    UPDATE joint_sessions
    SET 
        deputies_present = (
            SELECT COUNT(*) FROM congress_attendance 
            WHERE joint_session_id = p_session_id AND origin_chamber = 'ASSEMBLY'
        ),
        senators_present = (
            SELECT COUNT(*) FROM congress_attendance 
            WHERE joint_session_id = p_session_id AND origin_chamber = 'SENATE'
        )
    WHERE id = p_session_id;
    
    -- Vérifier le quorum
    UPDATE joint_sessions
    SET quorum_reached = (deputies_present + senators_present) >= quorum_required
    WHERE id = p_session_id;
    
    RETURN TRUE;
END;
$$;

-- ============================================================================
-- 10. TRIGGERS
-- ============================================================================

DROP TRIGGER IF EXISTS joint_sessions_updated_at ON joint_sessions;
CREATE TRIGGER joint_sessions_updated_at
    BEFORE UPDATE ON joint_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS cmp_committees_updated_at ON cmp_committees;
CREATE TRIGGER cmp_committees_updated_at
    BEFORE UPDATE ON cmp_committees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 11. COMMENTAIRES
-- ============================================================================

COMMENT ON TABLE joint_sessions IS 'Sessions du Congrès (Assemblée + Sénat réunis)';
COMMENT ON TABLE cmp_committees IS 'Commissions Mixtes Paritaires (7+7 membres)';
COMMENT ON TABLE cmp_members IS 'Membres des CMP (Titulaires et Suppléants)';
COMMENT ON TABLE national_archives IS 'Journal Officiel numérique - Textes promulgués';
COMMENT ON FUNCTION congress_check_in IS 'Fonction d''émargement au Congrès avec géolocalisation optionnelle';

-- Migration: Profils Sénateurs et Collectivités Locales
-- Description: Extension du schéma pour les fonctionnalités spécifiques au Sénat

-- ============================================================================
-- 1. TABLE DES PROFILS SÉNATEURS
-- ============================================================================

CREATE TABLE IF NOT EXISTS senator_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    
    -- Circonscription locale
    province VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    commune VARCHAR(100),
    canton VARCHAR(100),
    
    -- Groupe parlementaire sénatorial
    political_group VARCHAR(100),
    
    -- Mandat
    mandate_start DATE,
    mandate_end DATE,
    electoral_college TEXT[],
    
    -- Contact local
    local_office_address TEXT,
    local_phone VARCHAR(50),
    
    -- Statistiques
    laws_examined INTEGER DEFAULT 0,
    amendments_proposed INTEGER DEFAULT 0,
    field_visits INTEGER DEFAULT 0,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_senator_profiles_province ON senator_profiles(province);
CREATE INDEX IF NOT EXISTS idx_senator_profiles_profile ON senator_profiles(profile_id);

-- ============================================================================
-- 2. TABLE DES DOLÉANCES LOCALES
-- ============================================================================

CREATE TABLE IF NOT EXISTS local_grievances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    source_type VARCHAR(50) NOT NULL,
    source_name VARCHAR(255),
    source_contact TEXT,
    
    province VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    commune VARCHAR(100),
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100),
    
    priority INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'PENDING',
    
    assigned_senator_id UUID REFERENCES profiles(id),
    response TEXT,
    addressed_at TIMESTAMPTZ,
    
    attachments UUID[],
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_grievances_province ON local_grievances(province);
CREATE INDEX IF NOT EXISTS idx_grievances_senator ON local_grievances(assigned_senator_id);
CREATE INDEX IF NOT EXISTS idx_grievances_status ON local_grievances(status);

-- ============================================================================
-- 3. TABLE DES VISITES DE TERRAIN
-- ============================================================================

CREATE TABLE IF NOT EXISTS field_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    senator_id UUID NOT NULL REFERENCES profiles(id),
    
    province VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    commune VARCHAR(100),
    specific_location TEXT,
    
    visit_date DATE NOT NULL,
    duration_hours INTEGER,
    purpose TEXT NOT NULL,
    
    observations TEXT,
    recommendations TEXT,
    suggestions TEXT,
    
    participants TEXT[],
    
    photos UUID[],
    documents UUID[],
    
    follow_up_required BOOLEAN DEFAULT FALSE,
    follow_up_notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_field_visits_senator ON field_visits(senator_id);
CREATE INDEX IF NOT EXISTS idx_field_visits_province ON field_visits(province);
CREATE INDEX IF NOT EXISTS idx_field_visits_date ON field_visits(visit_date);

-- ============================================================================
-- 4. TABLE DES TEXTES EN NAVETTE (Vue Sénat)
-- ============================================================================

CREATE TABLE IF NOT EXISTS senate_text_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    legislative_text_id UUID NOT NULL REFERENCES legislative_texts(id) ON DELETE CASCADE,
    
    received_at TIMESTAMPTZ DEFAULT NOW(),
    review_deadline TIMESTAMPTZ,
    
    assigned_commission_id UUID REFERENCES permanent_commissions(id),
    rapporteur_id UUID REFERENCES profiles(id),
    
    commission_opinion TEXT,
    commission_vote_result VARCHAR(50),
    
    is_collectivity_related BOOLEAN DEFAULT FALSE,
    
    senate_status VARCHAR(50) DEFAULT 'PENDING',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_senate_queue_text ON senate_text_queue(legislative_text_id);
CREATE INDEX IF NOT EXISTS idx_senate_queue_status ON senate_text_queue(senate_status);
CREATE INDEX IF NOT EXISTS idx_senate_queue_collectivity ON senate_text_queue(is_collectivity_related);

-- ============================================================================
-- 5. RLS POLICIES POUR LE SÉNAT
-- ============================================================================

ALTER TABLE senator_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view senator profiles" ON senator_profiles
    FOR SELECT USING (true);

CREATE POLICY "Senators can update their own profile" ON senator_profiles
    FOR UPDATE USING (profile_id = auth.uid());

CREATE POLICY "Senators can insert their own profile" ON senator_profiles
    FOR INSERT WITH CHECK (profile_id = auth.uid());

ALTER TABLE local_grievances ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view grievances" ON local_grievances
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert grievances" ON local_grievances
    FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Assigned senators can update grievances" ON local_grievances
    FOR UPDATE USING (assigned_senator_id = auth.uid());

ALTER TABLE field_visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Senators can manage their own visits" ON field_visits
    FOR ALL USING (senator_id = auth.uid());

CREATE POLICY "Public can view field visits" ON field_visits
    FOR SELECT USING (true);

ALTER TABLE senate_text_queue ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view senate queue" ON senate_text_queue
    FOR SELECT USING (true);

CREATE POLICY "Admins can manage senate queue" ON senate_text_queue
    FOR ALL USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- 6. FONCTION: Recevoir un texte de l'AN
-- ============================================================================

CREATE OR REPLACE FUNCTION senate_receive_text(
    p_text_id UUID
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_queue_id UUID;
    v_text_location legislative_location;
    v_is_collectivity BOOLEAN;
BEGIN
    SELECT current_location INTO v_text_location
    FROM legislative_texts WHERE id = p_text_id;
    
    IF v_text_location NOT IN ('NAVETTE_AN_TO_SN', 'AN_ADOPTED') THEN
        RAISE EXCEPTION 'Text is not in the correct state to be received by Senate';
    END IF;
    
    SELECT 
        title ILIKE '%décentralisation%' 
        OR title ILIKE '%collectivité%' 
        OR title ILIKE '%commune%'
        OR title ILIKE '%municipal%'
        OR title ILIKE '%territorial%'
    INTO v_is_collectivity
    FROM legislative_texts WHERE id = p_text_id;
    
    INSERT INTO senate_text_queue (
        legislative_text_id,
        review_deadline,
        is_collectivity_related,
        senate_status
    ) VALUES (
        p_text_id,
        NOW() + INTERVAL '20 days',
        v_is_collectivity,
        'PENDING'
    ) RETURNING id INTO v_queue_id;
    
    UPDATE legislative_texts
    SET 
        current_location = 'SN_BUREAU',
        updated_at = NOW()
    WHERE id = p_text_id;
    
    RETURN v_queue_id;
END;
$$;

-- ============================================================================
-- 7. PROVINCES DU GABON
-- ============================================================================

CREATE TABLE IF NOT EXISTS gabon_provinces (
    id SERIAL PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    capital VARCHAR(100),
    population INTEGER,
    surface_area INTEGER
);

INSERT INTO gabon_provinces (code, name, capital, population, surface_area) VALUES
    ('EST', 'Estuaire', 'Libreville', 1000000, 21300),
    ('HOG', 'Haut-Ogooué', 'Franceville', 250000, 36547),
    ('MOG', 'Moyen-Ogooué', 'Lambaréné', 70000, 18535),
    ('NGO', 'Ngounié', 'Mouila', 100000, 37750),
    ('NYA', 'Nyanga', 'Tchibanga', 50000, 21285),
    ('OGI', 'Ogooué-Ivindo', 'Makokou', 65000, 46075),
    ('OGL', 'Ogooué-Lolo', 'Koulamoutou', 65000, 25380),
    ('OGM', 'Ogooué-Maritime', 'Port-Gentil', 155000, 22890),
    ('WNT', 'Woleu-Ntem', 'Oyem', 155000, 38465)
ON CONFLICT (code) DO NOTHING;

-- ============================================================================
-- 8. TRIGGERS
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS senator_profiles_updated_at ON senator_profiles;
CREATE TRIGGER senator_profiles_updated_at
    BEFORE UPDATE ON senator_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS local_grievances_updated_at ON local_grievances;
CREATE TRIGGER local_grievances_updated_at
    BEFORE UPDATE ON local_grievances
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS field_visits_updated_at ON field_visits;
CREATE TRIGGER field_visits_updated_at
    BEFORE UPDATE ON field_visits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================================================
-- 9. COMMENTAIRES
-- ============================================================================

COMMENT ON TABLE senator_profiles IS 'Informations spécifiques aux sénateurs (province, groupe politique, etc.)';
COMMENT ON TABLE local_grievances IS 'Doléances remontées des collectivités locales vers les sénateurs';
COMMENT ON TABLE field_visits IS 'Rapports de visites de terrain des sénateurs';
COMMENT ON TABLE senate_text_queue IS 'File d''attente des textes reçus par le Sénat pour examen';
COMMENT ON TABLE gabon_provinces IS 'Référentiel des 9 provinces du Gabon';
COMMENT ON FUNCTION senate_receive_text IS 'Fonction pour enregistrer la réception d''un texte de l''AN';
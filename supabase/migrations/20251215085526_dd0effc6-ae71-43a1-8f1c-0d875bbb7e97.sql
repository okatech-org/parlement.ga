-- ============================================================================
-- MIGRATION: PRÉPARATION TABLE PARLIAMENTARIANS + INSERTION ÉLUS
-- ============================================================================

-- 1. Supprimer la contrainte FK qui lie parliamentarians.id à auth.users
ALTER TABLE parliamentarians DROP CONSTRAINT IF EXISTS parliamentarians_id_fkey;

-- 2. Modifier la colonne id pour avoir une valeur par défaut
ALTER TABLE parliamentarians ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Ajout colonnes pour lier titulaire/suppléant
ALTER TABLE parliamentarians ADD COLUMN IF NOT EXISTS titular_id UUID;
ALTER TABLE parliamentarians ADD COLUMN IF NOT EXISTS substitute_active BOOLEAN DEFAULT FALSE;

-- 4. Créer index
CREATE INDEX IF NOT EXISTS idx_parliamentarians_titular ON parliamentarians(titular_id) WHERE titular_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_parliamentarians_email ON parliamentarians(email_pro);

-- 5. Fonction helper pour générer les emails
CREATE OR REPLACE FUNCTION generate_parl_email(p_name TEXT, p_institution TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE v_clean_name TEXT;
BEGIN
    v_clean_name := lower(p_name);
    v_clean_name := replace(replace(replace(v_clean_name, ' ', '.'), 'é', 'e'), 'è', 'e');
    v_clean_name := replace(replace(replace(v_clean_name, 'ê', 'e'), 'à', 'a'), 'â', 'a');
    v_clean_name := replace(replace(replace(v_clean_name, 'î', 'i'), 'ô', 'o'), 'û', 'u');
    v_clean_name := replace(replace(replace(v_clean_name, 'ç', 'c'), '''', ''), '-', '.');
    RETURN v_clean_name || '@' || p_institution || '.parlement.ga';
END; $$;

-- 6. Vue utilitaire pour les statistiques
CREATE OR REPLACE VIEW v_parliamentarians_stats AS
SELECT 
    institution,
    COUNT(*) FILTER (WHERE role NOT IN ('AN_DEPUTE_SUPPLEANT', 'SN_SENATEUR_SUPPLEANT')) AS titulaires,
    COUNT(*) FILTER (WHERE role IN ('AN_DEPUTE_SUPPLEANT', 'SN_SENATEUR_SUPPLEANT')) AS suppleants,
    COUNT(DISTINCT parti_politique) AS partis
FROM parliamentarians
WHERE is_active = true
GROUP BY institution;
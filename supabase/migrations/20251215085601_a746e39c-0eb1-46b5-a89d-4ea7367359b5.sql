-- Corriger la vue pour utiliser SECURITY INVOKER (par défaut, plus sécurisé)
DROP VIEW IF EXISTS v_parliamentarians_stats;

CREATE VIEW v_parliamentarians_stats 
WITH (security_invoker = true) AS
SELECT 
    institution,
    COUNT(*) FILTER (WHERE role NOT IN ('AN_DEPUTE_SUPPLEANT', 'SN_SENATEUR_SUPPLEANT')) AS titulaires,
    COUNT(*) FILTER (WHERE role IN ('AN_DEPUTE_SUPPLEANT', 'SN_SENATEUR_SUPPLEANT')) AS suppleants,
    COUNT(DISTINCT parti_politique) AS partis
FROM parliamentarians
WHERE is_active = true
GROUP BY institution;
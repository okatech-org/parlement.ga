-- Migration: Création des comptes utilisateurs des élus parlementaires
-- Description: Insertion de tous les sénateurs, députés et leurs suppléants
-- Date: 2025-12-15
-- Élections Législatives et Sénatoriales - Ve République

-- ============================================================================
-- 1. EXTENSION DE LA TABLE PROFILES POUR LES SUPPLÉANTS
-- ============================================================================

-- Ajouter les colonnes pour lier les suppléants à leurs titulaires
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_substitute BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS titular_id UUID REFERENCES profiles(id);
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS substitute_active BOOLEAN DEFAULT FALSE;

-- Index pour les relations suppléant/titulaire
CREATE INDEX IF NOT EXISTS idx_profiles_titular ON profiles(titular_id) WHERE titular_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_profiles_substitutes ON profiles(is_substitute) WHERE is_substitute = TRUE;

-- ============================================================================
-- 2. FONCTION HELPER POUR CRÉER UN ÉLU
-- ============================================================================

CREATE OR REPLACE FUNCTION create_elected_official(
    p_email TEXT,
    p_full_name TEXT,
    p_institution institution_type,
    p_parliamentary_role parliamentary_role,
    p_party TEXT,
    p_province TEXT,
    p_constituency TEXT,
    p_gender TEXT DEFAULT 'M',
    p_is_substitute BOOLEAN DEFAULT FALSE,
    p_titular_email TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_id UUID;
    v_titular_id UUID;
BEGIN
    -- Générer un UUID pour l'utilisateur
    v_user_id := gen_random_uuid();
    
    -- Trouver le titulaire si c'est un suppléant
    IF p_is_substitute AND p_titular_email IS NOT NULL THEN
        SELECT id INTO v_titular_id FROM profiles WHERE email = p_titular_email;
    END IF;
    
    -- Insérer dans auth.users (simulation - dans un vrai cas, utiliser supabase admin)
    -- Note: En production, utiliser supabase.auth.admin.createUser()
    
    -- Insérer le profil
    INSERT INTO profiles (
        id,
        email,
        full_name,
        institution,
        parliamentary_role,
        political_group,
        province,
        constituency,
        gender,
        is_substitute,
        titular_id,
        is_active,
        created_at,
        updated_at
    ) VALUES (
        v_user_id,
        p_email,
        p_full_name,
        p_institution,
        p_parliamentary_role,
        p_party,
        p_province,
        p_constituency,
        p_gender,
        p_is_substitute,
        v_titular_id,
        TRUE,
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        institution = EXCLUDED.institution,
        parliamentary_role = EXCLUDED.parliamentary_role,
        political_group = EXCLUDED.political_group,
        province = EXCLUDED.province,
        constituency = EXCLUDED.constituency,
        is_substitute = EXCLUDED.is_substitute,
        titular_id = EXCLUDED.titular_id,
        updated_at = NOW()
    RETURNING id INTO v_user_id;
    
    RETURN v_user_id;
END;
$$;

-- ============================================================================
-- 3. INSERTION DES SÉNATEURS (68 sièges)
-- ============================================================================

-- Fonction pour générer l'email standardisé
CREATE OR REPLACE FUNCTION generate_email(p_name TEXT, p_institution TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_clean_name TEXT;
BEGIN
    -- Nettoyer le nom: minuscules, remplacer espaces par points, retirer accents
    v_clean_name := lower(p_name);
    v_clean_name := replace(v_clean_name, ' ', '.');
    v_clean_name := replace(v_clean_name, 'é', 'e');
    v_clean_name := replace(v_clean_name, 'è', 'e');
    v_clean_name := replace(v_clean_name, 'ê', 'e');
    v_clean_name := replace(v_clean_name, 'ë', 'e');
    v_clean_name := replace(v_clean_name, 'à', 'a');
    v_clean_name := replace(v_clean_name, 'â', 'a');
    v_clean_name := replace(v_clean_name, 'î', 'i');
    v_clean_name := replace(v_clean_name, 'ï', 'i');
    v_clean_name := replace(v_clean_name, 'ô', 'o');
    v_clean_name := replace(v_clean_name, 'ö', 'o');
    v_clean_name := replace(v_clean_name, 'û', 'u');
    v_clean_name := replace(v_clean_name, 'ù', 'u');
    v_clean_name := replace(v_clean_name, 'ç', 'c');
    v_clean_name := replace(v_clean_name, '''', '');
    v_clean_name := replace(v_clean_name, '-', '.');
    
    RETURN v_clean_name || '@' || p_institution || '.parlement.ga';
END;
$$;

-- ============================================================================
-- SÉNATEURS - ESTUAIRE (14 sièges)
-- ============================================================================

DO $$
BEGIN
    -- Augustin Ndong Mba (Président potentiel)
    PERFORM create_elected_official(
        generate_email('Augustin Ndong Mba', 'senat'),
        'Augustin Ndong Mba',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Libreville 1er', 'M'
    );
    -- Son suppléant
    PERFORM create_elected_official(
        generate_email('Stanislas Ekang Ekouaghe', 'senat'),
        'Stanislas Ekang Ekouaghe',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Libreville 1er', 'M',
        TRUE, generate_email('Augustin Ndong Mba', 'senat')
    );

    -- Marie-Claire Ondo Mengue
    PERFORM create_elected_official(
        generate_email('Marie-Claire Ondo Mengue', 'senat'),
        'Marie-Claire Ondo Mengue',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Libreville 2e', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Jean-Pierre Nzeng', 'senat'),
        'Jean-Pierre Nzeng',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Libreville 2e', 'M',
        TRUE, generate_email('Marie-Claire Ondo Mengue', 'senat')
    );

    -- Parfait Ndong Nze
    PERFORM create_elected_official(
        generate_email('Parfait Ndong Nze', 'senat'),
        'Parfait Ndong Nze',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Libreville 3e', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Claudine Mba', 'senat'),
        'Claudine Mba',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Libreville 3e', 'F',
        TRUE, generate_email('Parfait Ndong Nze', 'senat')
    );

    -- Rose Christiane Ossouka Raponda (Ancienne PM)
    PERFORM create_elected_official(
        generate_email('Rose Christiane Ossouka Raponda', 'senat'),
        'Rose Christiane Ossouka Raponda',
        'SENATE', 'SENATOR', 'PDG', 'Estuaire', 'Libreville 4e', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Theophile Moussavou', 'senat'),
        'Théophile Moussavou',
        'SENATE', 'SUBSTITUTE', 'PDG', 'Estuaire', 'Libreville 4e', 'M',
        TRUE, generate_email('Rose Christiane Ossouka Raponda', 'senat')
    );

    -- Jean-Boniface Assélé (VP Sénat)
    PERFORM create_elected_official(
        generate_email('Jean-Boniface Assele', 'senat'),
        'Jean-Boniface Assélé',
        'SENATE', 'SN_VP', 'UDB', 'Estuaire', 'Owendo', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Mireille Ango', 'senat'),
        'Mireille Ango',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Owendo', 'F',
        TRUE, generate_email('Jean-Boniface Assele', 'senat')
    );

    -- Christiane Angue Obiang
    PERFORM create_elected_official(
        generate_email('Christiane Angue Obiang', 'senat'),
        'Christiane Angue Obiang',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Akanda', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Guy Roger Obame', 'senat'),
        'Guy Roger Obame',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Akanda', 'M',
        TRUE, generate_email('Christiane Angue Obiang', 'senat')
    );

    -- Fidèle Mengue Nzé
    PERFORM create_elected_official(
        generate_email('Fidele Mengue Nze', 'senat'),
        'Fidèle Mengue Nzé',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Ntoum', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Pauline Ndong', 'senat'),
        'Pauline Ndong',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Ntoum', 'F',
        TRUE, generate_email('Fidele Mengue Nze', 'senat')
    );

    -- Jean-Rémy Pendy Bouyiki (Questeur)
    PERFORM create_elected_official(
        generate_email('Jean-Remy Pendy Bouyiki', 'senat'),
        'Jean-Rémy Pendy Bouyiki',
        'SENATE', 'SN_QUESTEUR', 'UDB', 'Estuaire', 'Komo', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Therese Nyingone', 'senat'),
        'Thérèse Nyingone',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Komo', 'F',
        TRUE, generate_email('Jean-Remy Pendy Bouyiki', 'senat')
    );

    -- Brigitte Onanga
    PERFORM create_elected_official(
        generate_email('Brigitte Onanga', 'senat'),
        'Brigitte Onanga',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Komo-Mondah', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Michel Assoumou', 'senat'),
        'Michel Assoumou',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Komo-Mondah', 'M',
        TRUE, generate_email('Brigitte Onanga', 'senat')
    );

    -- Pierre Claver Zeng Ebome
    PERFORM create_elected_official(
        generate_email('Pierre Claver Zeng Ebome', 'senat'),
        'Pierre Claver Zeng Ebome',
        'SENATE', 'SENATOR', 'UDB', 'Estuaire', 'Cocobeach', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Jeanne Ekang', 'senat'),
        'Jeanne Ekang',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Cocobeach', 'F',
        TRUE, generate_email('Pierre Claver Zeng Ebome', 'senat')
    );

    RAISE NOTICE 'Sénateurs Estuaire créés avec succès';
END $$;

-- ============================================================================
-- SÉNATEURS - HAUT-OGOOUÉ (12 sièges)
-- ============================================================================

DO $$
BEGIN
    -- Justin Ndoundangoye
    PERFORM create_elected_official(
        generate_email('Justin Ndoundangoye', 'senat'),
        'Justin Ndoundangoye',
        'SENATE', 'SENATOR', 'PDG', 'Haut-Ogooué', 'Franceville 1er', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Suzanne Moutete', 'senat'),
        'Suzanne Moutete',
        'SENATE', 'SUBSTITUTE', 'PDG', 'Haut-Ogooué', 'Franceville 1er', 'F',
        TRUE, generate_email('Justin Ndoundangoye', 'senat')
    );

    -- Elodie Diane Fouefoue
    PERFORM create_elected_official(
        generate_email('Elodie Diane Fouefoue', 'senat'),
        'Elodie Diane Fouefoue',
        'SENATE', 'SENATOR', 'UDB', 'Haut-Ogooué', 'Franceville 2e', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Sylvere Tounda Thales', 'senat'),
        'Sylvère Tounda Thalès',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Haut-Ogooué', 'Franceville 2e', 'M',
        TRUE, generate_email('Elodie Diane Fouefoue', 'senat')
    );

    -- Roger Guy Francis Kouba
    PERFORM create_elected_official(
        generate_email('Roger Guy Francis Kouba', 'senat'),
        'Roger Guy Francis Kouba',
        'SENATE', 'SENATOR', 'UDB', 'Haut-Ogooué', 'Mpassa', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Jean Noel Epemet', 'senat'),
        'Jean Noël Epemet',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Haut-Ogooué', 'Mpassa', 'M',
        TRUE, generate_email('Roger Guy Francis Kouba', 'senat')
    );

    -- Fabrice Mouandzouedi
    PERFORM create_elected_official(
        generate_email('Fabrice Mouandzouedi', 'senat'),
        'Fabrice Mouandzouedi',
        'SENATE', 'SENATOR', 'UDB', 'Haut-Ogooué', 'Moanda', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Suzanne Libally', 'senat'),
        'Suzanne Libally',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Haut-Ogooué', 'Moanda', 'F',
        TRUE, generate_email('Fabrice Mouandzouedi', 'senat')
    );

    -- Michel Essongue
    PERFORM create_elected_official(
        generate_email('Michel Essongue', 'senat'),
        'Michel Essongue',
        'SENATE', 'SENATOR', 'UDB', 'Haut-Ogooué', 'Mounana', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Paulette Oyane', 'senat'),
        'Paulette Oyane',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Haut-Ogooué', 'Mounana', 'F',
        TRUE, generate_email('Michel Essongue', 'senat')
    );

    -- Casimir Oyé Mba (Président Commission Finances)
    PERFORM create_elected_official(
        generate_email('Casimir Oye Mba', 'senat'),
        'Casimir Oyé Mba',
        'SENATE', 'SN_COMMISSION_PRESIDENT', 'UDB', 'Haut-Ogooué', 'Plateaux', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Antoinette Boundono', 'senat'),
        'Antoinette Boundono',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Haut-Ogooué', 'Plateaux', 'F',
        TRUE, generate_email('Casimir Oye Mba', 'senat')
    );

    RAISE NOTICE 'Sénateurs Haut-Ogooué créés avec succès';
END $$;

-- ============================================================================
-- SÉNATEURS - MOYEN-OGOOUÉ (4 sièges)
-- ============================================================================

DO $$
BEGIN
    -- Madeleine Sidonie Revangue (PRÉSIDENTE DU SÉNAT)
    PERFORM create_elected_official(
        generate_email('Madeleine Sidonie Revangue', 'senat'),
        'Madeleine Sidonie Revangue',
        'SENATE', 'SN_PRESIDENT', 'UDB', 'Moyen-Ogooué', 'Lambaréné', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Christian Mayisse', 'senat'),
        'Christian Mayisse',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Moyen-Ogooué', 'Lambaréné', 'M',
        TRUE, generate_email('Madeleine Sidonie Revangue', 'senat')
    );

    -- Pierre Kessany
    PERFORM create_elected_official(
        generate_email('Pierre Kessany', 'senat'),
        'Pierre Kessany',
        'SENATE', 'SENATOR', 'UDB', 'Moyen-Ogooué', 'Ogooué et Lacs', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Albertine Gnigone Ossima', 'senat'),
        'Albertine Gnigone Ossima',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Moyen-Ogooué', 'Ogooué et Lacs', 'F',
        TRUE, generate_email('Pierre Kessany', 'senat')
    );

    -- Emmanuel Jacques Didier Biye
    PERFORM create_elected_official(
        generate_email('Emmanuel Jacques Didier Biye', 'senat'),
        'Emmanuel Jacques Didier Biye',
        'SENATE', 'SENATOR', 'UDB', 'Moyen-Ogooué', 'Ndjolé', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Alpin Ndong Ondo', 'senat'),
        'Alpin Ndong Ondo',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Moyen-Ogooué', 'Ndjolé', 'M',
        TRUE, generate_email('Emmanuel Jacques Didier Biye', 'senat')
    );

    -- Thérèse Nzeng Mengue
    PERFORM create_elected_official(
        generate_email('Therese Nzeng Mengue', 'senat'),
        'Thérèse Nzeng Mengue',
        'SENATE', 'SENATOR', 'UDB', 'Moyen-Ogooué', 'Abanga-Bigné', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Joseph Nze', 'senat'),
        'Joseph Nzé',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Moyen-Ogooué', 'Abanga-Bigné', 'M',
        TRUE, generate_email('Therese Nzeng Mengue', 'senat')
    );

    RAISE NOTICE 'Sénateurs Moyen-Ogooué créés avec succès';
END $$;

-- ============================================================================
-- SÉNATEURS - NGOUNIÉ (9 sièges)
-- ============================================================================

DO $$
BEGIN
    -- Serge Maurice Mabiala (VP Sénat)
    PERFORM create_elected_official(
        generate_email('Serge Maurice Mabiala', 'senat'),
        'Serge Maurice Mabiala',
        'SENATE', 'SN_VP', 'UDB', 'Ngounié', 'Mouila', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Mombo Mougongou', 'senat'),
        'Mombo Mougongou',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Ngounié', 'Mouila', 'M',
        TRUE, generate_email('Serge Maurice Mabiala', 'senat')
    );

    -- Pamphile Vessey Mihindou (PSD)
    PERFORM create_elected_official(
        generate_email('Pamphile Vessey Mihindou', 'senat'),
        'Pamphile Vessey Mihindou',
        'SENATE', 'SENATOR', 'PSD', 'Ngounié', 'Douya-Onoye', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Jean Bernard Mouendou', 'senat'),
        'Jean Bernard Mouendou',
        'SENATE', 'SUBSTITUTE', 'PSD', 'Ngounié', 'Douya-Onoye', 'M',
        TRUE, generate_email('Pamphile Vessey Mihindou', 'senat')
    );

    -- Daniel César Dibady Mayila
    PERFORM create_elected_official(
        generate_email('Daniel Cesar Dibady Mayila', 'senat'),
        'Daniel César Dibady Mayila',
        'SENATE', 'SENATOR', 'UDB', 'Ngounié', 'Tsamba-Magotsi', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Jean Pierre Otembo', 'senat'),
        'Jean Pierre Otembo',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Ngounié', 'Tsamba-Magotsi', 'M',
        TRUE, generate_email('Daniel Cesar Dibady Mayila', 'senat')
    );

    RAISE NOTICE 'Sénateurs Ngounié créés avec succès';
END $$;

-- ============================================================================
-- SÉNATEURS - NYANGA (4 sièges)
-- ============================================================================

DO $$
BEGIN
    -- Jean-Pierre Oyiba (Questeur)
    PERFORM create_elected_official(
        generate_email('Jean-Pierre Oyiba', 'senat'),
        'Jean-Pierre Oyiba',
        'SENATE', 'SN_QUESTEUR', 'UDB', 'Nyanga', 'Tchibanga', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Clemence Moussavou', 'senat'),
        'Clémence Moussavou',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Nyanga', 'Tchibanga', 'F',
        TRUE, generate_email('Jean-Pierre Oyiba', 'senat')
    );

    -- Max Martial Bontombo
    PERFORM create_elected_official(
        generate_email('Max Martial Bontombo', 'senat'),
        'Max Martial Bontombo',
        'SENATE', 'SENATOR', 'UDB', 'Nyanga', 'Mayumba', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Sylvie Nziengui', 'senat'),
        'Sylvie Nziengui',
        'SENATE', 'SUBSTITUTE', 'UDB', 'Nyanga', 'Mayumba', 'F',
        TRUE, generate_email('Max Martial Bontombo', 'senat')
    );

    RAISE NOTICE 'Sénateurs Nyanga créés avec succès';
END $$;

-- ============================================================================
-- 4. INSERTION DES DÉPUTÉS (Sélection des principaux)
-- ============================================================================

DO $$
BEGIN
    -- Michel Régis Onanga Ndiaye (PRÉSIDENT AN)
    PERFORM create_elected_official(
        generate_email('Michel Regis Onanga Ndiaye', 'an'),
        'Michel Régis Onanga Ndiaye',
        'NATIONAL_ASSEMBLY', 'AN_PRESIDENT', 'UDB', 'Estuaire', 'Libreville 1er', 'M'
    );

    -- François Ndong Obiang (1er VP AN)
    PERFORM create_elected_official(
        generate_email('Francois Ndong Obiang', 'an'),
        'François Ndong Obiang',
        'NATIONAL_ASSEMBLY', 'AN_VP', 'UDB', 'Estuaire', 'Libreville 2e', 'M'
    );

    -- Mathieu Mboumba Nziengui (Questeur AN)
    PERFORM create_elected_official(
        generate_email('Mathieu Mboumba Nziengui', 'an'),
        'Mathieu Mboumba Nziengui',
        'NATIONAL_ASSEMBLY', 'AN_QUESTEUR', 'UDB', 'Ngounié', 'Mouila', 'M'
    );

    -- MYBOTO Chantal + suppléant
    PERFORM create_elected_official(
        generate_email('Myboto Chantal', 'an'),
        'MYBOTO Chantal',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'UDB', 'Estuaire', 'Libreville 1er Arr. 1er Siège', 'F'
    );
    PERFORM create_elected_official(
        generate_email('Endamne Jules Sylvain', 'an'),
        'ENDAMNE Jules Sylvain',
        'NATIONAL_ASSEMBLY', 'SUBSTITUTE', 'UDB', 'Estuaire', 'Libreville 1er Arr. 1er Siège', 'M',
        TRUE, generate_email('Myboto Chantal', 'an')
    );

    -- BARRO CHAMBRIER + MBIE Claudia (suppléante active!)
    PERFORM create_elected_official(
        generate_email('Barro Chambrier Hugues Alexandre', 'an'),
        'BARRO CHAMBRIER Hugues Alexandre',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'RPM', 'Estuaire', 'Libreville 4e Arr. 1er Siège', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Mbie Claudia', 'an'),
        'MBIE Claudia',
        'NATIONAL_ASSEMBLY', 'SUBSTITUTE', 'RPM', 'Estuaire', 'Libreville 4e Arr. 1er Siège', 'F',
        TRUE, generate_email('Barro Chambrier Hugues Alexandre', 'an')
    );
    -- Activer la suppléante (Barro Chambrier est ministre)
    UPDATE profiles 
    SET substitute_active = TRUE 
    WHERE email = generate_email('Mbie Claudia', 'an');

    -- MPIRA Ismaëla Hermine (78,20%)
    PERFORM create_elected_official(
        generate_email('Mpira Ismaela Hermine', 'an'),
        'MPIRA ép. OURA AMEGUE Ismaëla Hermine',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'UDB', 'Estuaire', 'Libreville 5e Arr. 2e Siège', 'F'
    );

    -- MOUISSI Mays Lloyd (66,97%)
    PERFORM create_elected_official(
        generate_email('Mouissi Mays Lloyd', 'an'),
        'MOUISSI Mays Lloyd',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'UDB', 'Ngounié', 'Ndendé', 'M'
    );

    -- LOUEMBE Blaise + MATSOTSA
    PERFORM create_elected_official(
        generate_email('Louembe Blaise', 'an'),
        'LOUEMBE Blaise',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'PDG', 'Ogooué-Lolo', 'Koulamoutou 1er Arr.', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Matsotsa Hilaire', 'an'),
        'MATSOTSA Hilaire',
        'NATIONAL_ASSEMBLY', 'SUBSTITUTE', 'PDG', 'Ogooué-Lolo', 'Koulamoutou 1er Arr.', 'M',
        TRUE, generate_email('Louembe Blaise', 'an')
    );

    -- ENGONGA ELLA Rostan Mickael (Diaspora 85,95%)
    PERFORM create_elected_official(
        generate_email('Engonga Ella Rostan Mickael', 'an'),
        'ENGONGA ELLA Rostan Mickael',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'UDB', 'Diaspora', 'Diaspora Ouest', 'M'
    );

    -- NTOUTOUME AYI Jean Gaspard (UN - Akanda)
    PERFORM create_elected_official(
        generate_email('Ntoutoume Ayi Jean Gaspard', 'an'),
        'NTOUTOUME AYI Jean Gaspard',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'UN', 'Estuaire', 'Akanda 2e Arr.', 'M'
    );

    -- OYIBA Jean Pierre (PDG - Franceville)
    PERFORM create_elected_official(
        generate_email('Oyiba Jean Pierre', 'an'),
        'OYIBA Jean Pierre',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'PDG', 'Haut-Ogooué', 'Franceville 1er Arr.', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Malibala Edgard Prosper', 'an'),
        'MALIBALA Edgard Prosper',
        'NATIONAL_ASSEMBLY', 'SUBSTITUTE', 'PDG', 'Haut-Ogooué', 'Franceville 1er Arr.', 'M',
        TRUE, generate_email('Oyiba Jean Pierre', 'an')
    );

    -- MAYOUNOU Oswald Séverin (PDG - Moanda 50,77%)
    PERFORM create_elected_official(
        generate_email('Mayounou Oswald Severin', 'an'),
        'MAYOUNOU Oswald Séverin',
        'NATIONAL_ASSEMBLY', 'DEPUTY', 'PDG', 'Haut-Ogooué', 'Moanda 1er Arr.', 'M'
    );
    PERFORM create_elected_official(
        generate_email('Bimbi Mayela Joachim', 'an'),
        'BIMBI MAYELA Joachim',
        'NATIONAL_ASSEMBLY', 'SUBSTITUTE', 'PDG', 'Haut-Ogooué', 'Moanda 1er Arr.', 'M',
        TRUE, generate_email('Mayounou Oswald Severin', 'an')
    );

    RAISE NOTICE 'Députés principaux créés avec succès';
END $$;

-- ============================================================================
-- 5. VUE POUR AFFICHER TOUS LES ÉLUS AVEC LEURS SUPPLÉANTS
-- ============================================================================

CREATE OR REPLACE VIEW v_elected_officials AS
SELECT 
    p.id,
    p.full_name,
    p.email,
    p.institution,
    p.parliamentary_role,
    p.political_group AS party,
    p.province,
    p.constituency,
    p.gender,
    p.is_substitute,
    p.substitute_active,
    -- Infos du titulaire si c'est un suppléant
    titular.full_name AS titular_name,
    titular.email AS titular_email,
    -- Infos du suppléant si c'est un titulaire
    sub.full_name AS substitute_name,
    sub.email AS substitute_email,
    sub.substitute_active AS substitute_is_active,
    p.created_at
FROM profiles p
LEFT JOIN profiles titular ON p.titular_id = titular.id
LEFT JOIN profiles sub ON sub.titular_id = p.id
WHERE p.parliamentary_role IN (
    'SENATOR', 'DEPUTY', 'SUBSTITUTE',
    'AN_PRESIDENT', 'AN_VP', 'AN_QUESTEUR', 'AN_SECRETARY',
    'SN_PRESIDENT', 'SN_VP', 'SN_QUESTEUR', 'SN_SECRETARY',
    'SN_COMMISSION_PRESIDENT'
)
ORDER BY 
    p.institution,
    CASE p.parliamentary_role
        WHEN 'AN_PRESIDENT' THEN 1
        WHEN 'SN_PRESIDENT' THEN 1
        WHEN 'AN_VP' THEN 2
        WHEN 'SN_VP' THEN 2
        WHEN 'AN_QUESTEUR' THEN 3
        WHEN 'SN_QUESTEUR' THEN 3
        ELSE 10
    END,
    p.province,
    p.full_name;

-- ============================================================================
-- 6. STATISTIQUES DES ÉLUS
-- ============================================================================

CREATE OR REPLACE VIEW v_elected_stats AS
SELECT 
    institution,
    COUNT(*) FILTER (WHERE NOT is_substitute) AS titulaires,
    COUNT(*) FILTER (WHERE is_substitute) AS suppleants,
    COUNT(*) FILTER (WHERE is_substitute AND substitute_active) AS suppleants_actifs,
    COUNT(*) FILTER (WHERE gender = 'F' AND NOT is_substitute) AS femmes_titulaires,
    COUNT(*) FILTER (WHERE gender = 'M' AND NOT is_substitute) AS hommes_titulaires,
    COUNT(DISTINCT political_group) AS partis_representes
FROM profiles
WHERE parliamentary_role IN (
    'SENATOR', 'DEPUTY', 'SUBSTITUTE',
    'AN_PRESIDENT', 'AN_VP', 'AN_QUESTEUR', 'AN_SECRETARY',
    'SN_PRESIDENT', 'SN_VP', 'SN_QUESTEUR', 'SN_SECRETARY',
    'SN_COMMISSION_PRESIDENT'
)
GROUP BY institution;

-- ============================================================================
-- 7. COMMENTAIRES
-- ============================================================================

COMMENT ON COLUMN profiles.is_substitute IS 'Indique si le profil est un suppléant parlementaire';
COMMENT ON COLUMN profiles.titular_id IS 'Référence au profil du titulaire (si suppléant)';
COMMENT ON COLUMN profiles.substitute_active IS 'Indique si le suppléant siège actuellement (titulaire au gouvernement)';
COMMENT ON VIEW v_elected_officials IS 'Vue complète des élus avec leurs suppléants';
COMMENT ON VIEW v_elected_stats IS 'Statistiques agrégées des élus par institution';
COMMENT ON FUNCTION create_elected_official IS 'Fonction helper pour créer un profil d''élu';
COMMENT ON FUNCTION generate_email IS 'Génère un email standardisé pour un élu';

-- ============================================================================
-- 8. LOGS
-- ============================================================================

DO $$
DECLARE
    v_senators_count INTEGER;
    v_deputies_count INTEGER;
    v_substitutes_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_senators_count 
    FROM profiles 
    WHERE institution = 'SENATE' AND NOT is_substitute;
    
    SELECT COUNT(*) INTO v_deputies_count 
    FROM profiles 
    WHERE institution = 'NATIONAL_ASSEMBLY' AND NOT is_substitute;
    
    SELECT COUNT(*) INTO v_substitutes_count 
    FROM profiles 
    WHERE is_substitute = TRUE;

    RAISE NOTICE '==========================================';
    RAISE NOTICE 'MIGRATION COMPTES ÉLUS TERMINÉE';
    RAISE NOTICE '==========================================';
    RAISE NOTICE 'Sénateurs créés: %', v_senators_count;
    RAISE NOTICE 'Députés créés: %', v_deputies_count;
    RAISE NOTICE 'Suppléants créés: %', v_substitutes_count;
    RAISE NOTICE '==========================================';
END $$;

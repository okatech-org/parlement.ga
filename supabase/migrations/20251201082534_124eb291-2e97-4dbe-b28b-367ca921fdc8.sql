-- Créer la table des doléances citoyennes
CREATE TABLE public.doleances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titre TEXT NOT NULL,
  description TEXT NOT NULL,
  categorie TEXT NOT NULL CHECK (categorie IN ('infrastructure', 'sante', 'education', 'securite', 'environnement', 'economie')),
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (statut IN ('en_attente', 'en_cours', 'resolu', 'rejete')),
  priorite TEXT NOT NULL DEFAULT 'moyenne' CHECK (priorite IN ('basse', 'moyenne', 'haute', 'urgente')),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  region TEXT NOT NULL,
  ville TEXT,
  citoyen_id UUID,
  depute_id UUID,
  date_creation TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  date_resolution TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.doleances ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique des doléances
CREATE POLICY "Les doléances sont visibles par tous"
ON public.doleances
FOR SELECT
USING (true);

-- Politique pour permettre la création de doléances
CREATE POLICY "Les citoyens peuvent créer des doléances"
ON public.doleances
FOR INSERT
WITH CHECK (true);

-- Politique pour permettre la mise à jour des doléances
CREATE POLICY "Les députés peuvent mettre à jour les doléances"
ON public.doleances
FOR UPDATE
USING (true);

-- Créer un index pour les recherches géographiques
CREATE INDEX idx_doleances_location ON public.doleances(latitude, longitude);
CREATE INDEX idx_doleances_region ON public.doleances(region);
CREATE INDEX idx_doleances_categorie ON public.doleances(categorie);
CREATE INDEX idx_doleances_statut ON public.doleances(statut);

-- Créer une fonction pour mettre à jour le timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Créer un trigger pour mettre à jour automatiquement updated_at
CREATE TRIGGER update_doleances_updated_at
BEFORE UPDATE ON public.doleances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insérer des données de test pour le Gabon
INSERT INTO public.doleances (titre, description, categorie, statut, priorite, latitude, longitude, region, ville) VALUES
('Réfection de la route N1', 'La route nationale N1 est en très mauvais état, nécessite une réfection urgente', 'infrastructure', 'en_attente', 'haute', 0.4162, 9.4544, 'Estuaire', 'Libreville'),
('Manque de personnel au centre de santé', 'Le centre de santé manque cruellement de personnel médical', 'sante', 'en_cours', 'urgente', 0.3924, 9.4536, 'Estuaire', 'Libreville'),
('Construction d''une école primaire', 'Besoin d''une nouvelle école primaire pour accueillir les enfants du quartier', 'education', 'en_attente', 'haute', -0.7137, 8.7578, 'Ogooué-Maritime', 'Port-Gentil'),
('Éclairage public insuffisant', 'Plusieurs quartiers manquent d''éclairage public, problème de sécurité', 'securite', 'en_attente', 'moyenne', 0.4193, 9.4673, 'Estuaire', 'Libreville'),
('Gestion des déchets', 'Problème de collecte des déchets dans le quartier', 'environnement', 'en_cours', 'moyenne', -0.7089, 8.7849, 'Ogooué-Maritime', 'Port-Gentil'),
('Soutien aux petites entreprises', 'Demande de microcrédit pour développer l''activité économique locale', 'economie', 'resolu', 'basse', -1.4666, 13.2833, 'Haut-Ogooué', 'Franceville'),
('Réparation du pont', 'Le pont principal de la ville nécessite des réparations urgentes', 'infrastructure', 'en_attente', 'urgente', -1.4706, 13.2902, 'Haut-Ogooué', 'Franceville'),
('Centre de vaccination', 'Installation d''un centre de vaccination dans la région', 'sante', 'en_attente', 'haute', 1.8853, 10.7516, 'Woleu-Ntem', 'Oyem');

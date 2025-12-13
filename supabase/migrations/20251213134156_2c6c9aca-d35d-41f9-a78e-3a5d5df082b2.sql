-- Table des amendements parlementaires
CREATE TABLE public.amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_id UUID NOT NULL,
    project_law_id TEXT NOT NULL,
    article_number INTEGER NOT NULL,
    amendment_type TEXT NOT NULL CHECK (amendment_type IN ('modification', 'ajout', 'suppression')),
    original_text TEXT,
    proposed_text TEXT NOT NULL,
    justification TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'en_attente' CHECK (status IN ('en_attente', 'en_examen', 'adopte', 'rejete', 'retire')),
    cosignatories UUID[] DEFAULT '{}',
    commission TEXT,
    vote_pour INTEGER DEFAULT 0,
    vote_contre INTEGER DEFAULT 0,
    vote_abstention INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.amendments ENABLE ROW LEVEL SECURITY;

-- Policies: Tous les parlementaires peuvent voir les amendements
CREATE POLICY "Les parlementaires peuvent voir les amendements"
ON public.amendments
FOR SELECT
USING (true);

-- Les auteurs peuvent créer leurs amendements
CREATE POLICY "Les auteurs peuvent créer des amendements"
ON public.amendments
FOR INSERT
WITH CHECK (auth.uid() = author_id);

-- Les auteurs peuvent modifier leurs amendements en attente
CREATE POLICY "Les auteurs peuvent modifier leurs amendements en attente"
ON public.amendments
FOR UPDATE
USING (auth.uid() = author_id AND status = 'en_attente');

-- Les auteurs peuvent retirer leurs amendements en attente
CREATE POLICY "Les auteurs peuvent retirer leurs amendements"
ON public.amendments
FOR DELETE
USING (auth.uid() = author_id AND status = 'en_attente');

-- Trigger for updated_at
CREATE TRIGGER update_amendments_updated_at
BEFORE UPDATE ON public.amendments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Index pour les recherches fréquentes
CREATE INDEX idx_amendments_author ON public.amendments(author_id);
CREATE INDEX idx_amendments_status ON public.amendments(status);
CREATE INDEX idx_amendments_project_law ON public.amendments(project_law_id);
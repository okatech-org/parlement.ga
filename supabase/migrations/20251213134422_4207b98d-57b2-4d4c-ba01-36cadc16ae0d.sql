-- Enable realtime on amendments table
ALTER PUBLICATION supabase_realtime ADD TABLE public.amendments;

-- Table des co-signatures
CREATE TABLE public.amendment_cosignatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amendment_id UUID NOT NULL REFERENCES public.amendments(id) ON DELETE CASCADE,
    deputy_id UUID NOT NULL,
    signed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(amendment_id, deputy_id)
);

-- Enable RLS
ALTER TABLE public.amendment_cosignatures ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Les parlementaires peuvent voir les co-signatures"
ON public.amendment_cosignatures
FOR SELECT
USING (true);

CREATE POLICY "Les députés peuvent co-signer"
ON public.amendment_cosignatures
FOR INSERT
WITH CHECK (auth.uid() = deputy_id);

CREATE POLICY "Les députés peuvent retirer leur co-signature"
ON public.amendment_cosignatures
FOR DELETE
USING (auth.uid() = deputy_id);

-- Index for performance
CREATE INDEX idx_cosignatures_amendment ON public.amendment_cosignatures(amendment_id);
CREATE INDEX idx_cosignatures_deputy ON public.amendment_cosignatures(deputy_id);

-- Enable realtime on cosignatures
ALTER PUBLICATION supabase_realtime ADD TABLE public.amendment_cosignatures;
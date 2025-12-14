-- Fix security issues

-- 1. Enable RLS on gabon_provinces
ALTER TABLE gabon_provinces ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view provinces" ON gabon_provinces
    FOR SELECT USING (true);

-- 2. Fix function search_path for update_updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- 3. Fix search_path for existing functions that were flagged
CREATE OR REPLACE FUNCTION public.transmit_legislative_text(p_text_id uuid, p_note text DEFAULT NULL::text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

CREATE OR REPLACE FUNCTION public.convene_cmp(p_text_id uuid, p_assembly_members jsonb, p_senate_members jsonb, p_deadline timestamp with time zone DEFAULT NULL::timestamp with time zone)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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

CREATE OR REPLACE FUNCTION public.conclude_cmp(p_cmp_id uuid, p_result character varying, p_agreed_text text DEFAULT NULL::text, p_failure_reason text DEFAULT NULL::text, p_votes jsonb DEFAULT NULL::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
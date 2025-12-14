// ===========================================================================
// EDGE FUNCTION: legislative-shuttle
// Gestion de la navette parlementaire entre AN et Sénat
// ===========================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TransmitRequest {
    textId: string
    note?: string
}

interface ShuttleHistoryRequest {
    textId: string
    limit?: number
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        const url = new URL(req.url)
        const action = url.searchParams.get('action')

        // Action: Transmettre un texte à l'autre chambre
        if (action === 'transmit' && req.method === 'POST') {
            const { textId, note }: TransmitRequest = await req.json()

            if (!textId) {
                return new Response(
                    JSON.stringify({ success: false, error: 'textId requis' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // Vérifier que l'utilisateur a le droit de transmettre
            const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

            if (authError || !user) {
                return new Response(
                    JSON.stringify({ success: false, error: 'Non autorisé' }),
                    { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // Vérifier le rôle de l'utilisateur
            const { data: parliamentarian } = await supabaseClient
                .from('parliamentarians')
                .select('role')
                .eq('id', user.id)
                .single()

            const allowedRoles = ['AN_PRESIDENT', 'SN_PRESIDENT', 'PG_PRESIDENT', 'SUPER_ADMIN']

            if (!parliamentarian || !allowedRoles.includes(parliamentarian.role)) {
                return new Response(
                    JSON.stringify({ success: false, error: 'Seuls les Présidents peuvent transmettre les textes' }),
                    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // Appeler la fonction de transmission
            const { data, error } = await supabaseClient.rpc('transmit_legislative_text', {
                p_text_id: textId,
                p_note: note || null
            })

            if (error) {
                return new Response(
                    JSON.stringify({ success: false, error: error.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify(data),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Action: Obtenir l'historique de la navette
        if (action === 'history' && req.method === 'GET') {
            const textId = url.searchParams.get('textId')
            const limit = parseInt(url.searchParams.get('limit') || '50')

            if (!textId) {
                return new Response(
                    JSON.stringify({ success: false, error: 'textId requis' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const { data, error } = await supabaseClient
                .from('legislative_shuttle_history')
                .select('*')
                .eq('legislative_text_id', textId)
                .order('transmitted_at', { ascending: false })
                .limit(limit)

            if (error) {
                return new Response(
                    JSON.stringify({ success: false, error: error.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify({ success: true, history: data }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Action: Obtenir les statistiques de la navette
        if (action === 'stats' && req.method === 'GET') {
            const { data: stats, error } = await supabaseClient
                .from('legislative_texts')
                .select('current_location, origin_institution')

            if (error) {
                return new Response(
                    JSON.stringify({ success: false, error: error.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // Calculer les statistiques
            const summary = {
                total: stats?.length || 0,
                atAN: stats?.filter(t => t.current_location.startsWith('AN_')).length || 0,
                atSN: stats?.filter(t => t.current_location.startsWith('SN_')).length || 0,
                inNavette: stats?.filter(t => t.current_location.startsWith('NAVETTE_')).length || 0,
                inCMP: stats?.filter(t => t.current_location.startsWith('CMP_')).length || 0,
                adopted: stats?.filter(t => ['ADOPTED', 'PROMULGATED'].includes(t.current_location)).length || 0,
            }

            return new Response(
                JSON.stringify({ success: true, stats: summary }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ success: false, error: 'Action non reconnue' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

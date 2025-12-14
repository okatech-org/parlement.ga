// ===========================================================================
// EDGE FUNCTION: cmp-management
// Gestion des Commissions Mixtes Paritaires
// ===========================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ConveneCMPRequest {
    textId: string
    assemblyMembers: { id: string; name: string; role?: string }[]
    senateMembers: { id: string; name: string; role?: string }[]
    deadline?: string
}

interface ConcludeCMPRequest {
    cmpId: string
    result: 'AGREEMENT' | 'FAILURE'
    agreedText?: string
    failureReason?: string
    votes?: { for: number; against: number; abstain: number }
}

interface SendMessageRequest {
    cmpId: string
    content: string
    messageType?: string
    replyToId?: string
}

serve(async (req) => {
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

        // Vérifier l'authentification
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            return new Response(
                JSON.stringify({ success: false, error: 'Non autorisé' }),
                { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Action: Convoquer une CMP
        if (action === 'convene' && req.method === 'POST') {
            const body: ConveneCMPRequest = await req.json()

            // Vérifier la composition
            if (body.assemblyMembers.length !== 7 || body.senateMembers.length !== 7) {
                return new Response(
                    JSON.stringify({ success: false, error: 'La CMP doit compter exactement 7 membres de chaque chambre' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const { data, error } = await supabaseClient.rpc('convene_cmp', {
                p_text_id: body.textId,
                p_assembly_members: body.assemblyMembers,
                p_senate_members: body.senateMembers,
                p_deadline: body.deadline || null
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

        // Action: Conclure une CMP
        if (action === 'conclude' && req.method === 'POST') {
            const body: ConcludeCMPRequest = await req.json()

            const { data, error } = await supabaseClient.rpc('conclude_cmp', {
                p_cmp_id: body.cmpId,
                p_result: body.result,
                p_agreed_text: body.agreedText || null,
                p_failure_reason: body.failureReason || null,
                p_votes: body.votes || null
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

        // Action: Envoyer un message dans la CMP
        if (action === 'message' && req.method === 'POST') {
            const body: SendMessageRequest = await req.json()

            // Récupérer les infos de l'utilisateur
            const { data: parliamentarian } = await supabaseClient
                .from('parliamentarians')
                .select('first_name, last_name, institution, role')
                .eq('id', user.id)
                .single()

            if (!parliamentarian) {
                return new Response(
                    JSON.stringify({ success: false, error: 'Utilisateur non trouvé dans les parlementaires' }),
                    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // Vérifier que l'utilisateur est membre de cette CMP
            const { data: cmpSession } = await supabaseClient
                .from('cmp_sessions')
                .select('assembly_members, senate_members')
                .eq('id', body.cmpId)
                .single()

            if (!cmpSession) {
                return new Response(
                    JSON.stringify({ success: false, error: 'CMP non trouvée' }),
                    { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const allMembers = [
                ...cmpSession.assembly_members,
                ...cmpSession.senate_members
            ]
            const isMember = allMembers.some((m: any) => m.id === user.id)

            if (!isMember) {
                return new Response(
                    JSON.stringify({ success: false, error: 'Vous n\'êtes pas membre de cette CMP' }),
                    { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            // Insérer le message
            const { data, error } = await supabaseClient
                .from('cmp_messages')
                .insert({
                    cmp_session_id: body.cmpId,
                    author_id: user.id,
                    author_name: `${parliamentarian.first_name} ${parliamentarian.last_name}`,
                    author_institution: parliamentarian.institution,
                    author_role: parliamentarian.role,
                    content: body.content,
                    message_type: body.messageType || 'MESSAGE',
                    reply_to_id: body.replyToId || null
                })
                .select()
                .single()

            if (error) {
                return new Response(
                    JSON.stringify({ success: false, error: error.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify({ success: true, message: data }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Action: Lister les CMP
        if (action === 'list' && req.method === 'GET') {
            const status = url.searchParams.get('status')

            let query = supabaseClient
                .from('cmp_sessions')
                .select(`
          *,
          legislative_texts (
            id, reference, title, current_location
          )
        `)
                .order('convened_at', { ascending: false })

            if (status) {
                query = query.eq('status', status)
            }

            const { data, error } = await query

            if (error) {
                return new Response(
                    JSON.stringify({ success: false, error: error.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify({ success: true, cmps: data }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        // Action: Obtenir les messages d'une CMP
        if (action === 'messages' && req.method === 'GET') {
            const cmpId = url.searchParams.get('cmpId')
            const limit = parseInt(url.searchParams.get('limit') || '100')

            if (!cmpId) {
                return new Response(
                    JSON.stringify({ success: false, error: 'cmpId requis' }),
                    { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            const { data, error } = await supabaseClient
                .from('cmp_messages')
                .select('*')
                .eq('cmp_session_id', cmpId)
                .order('created_at', { ascending: true })
                .limit(limit)

            if (error) {
                return new Response(
                    JSON.stringify({ success: false, error: error.message }),
                    { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
                )
            }

            return new Response(
                JSON.stringify({ success: true, messages: data }),
                { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            )
        }

        return new Response(
            JSON.stringify({ success: false, error: 'Action non reconnue' }),
            { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

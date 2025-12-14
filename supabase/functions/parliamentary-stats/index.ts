// ===========================================================================
// EDGE FUNCTION: parliamentary-stats
// Statistiques parlementaires globales et par institution
// ===========================================================================

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const url = new URL(req.url)
        const institution = url.searchParams.get('institution')
        const period = url.searchParams.get('period') || 'year' // year, month, week

        // Calculer les dates de la période
        const now = new Date()
        let startDate: Date

        switch (period) {
            case 'week':
                startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                break
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1)
                break
            case 'year':
            default:
                startDate = new Date(now.getFullYear(), 0, 1)
        }

        // Statistiques des textes législatifs
        const { data: textsStats, error: textsError } = await supabaseClient
            .from('legislative_texts')
            .select('id, text_type, current_location, origin_institution, created_at')
            .gte('created_at', startDate.toISOString())

        if (textsError) throw textsError

        // Filtrer par institution si spécifié
        const filteredTexts = institution
            ? textsStats?.filter(t => t.origin_institution === institution)
            : textsStats

        // Statistiques des parlementaires
        const { data: parliamentarians, error: parlError } = await supabaseClient
            .from('parliamentarians')
            .select('id, institution, role, is_active')
            .eq('is_active', true)

        if (parlError) throw parlError

        const filteredParl = institution
            ? parliamentarians?.filter(p => p.institution === institution)
            : parliamentarians

        // Statistiques des votes
        const { data: votes, error: votesError } = await supabaseClient
            .from('parliamentary_votes')
            .select('id, institution, result, created_at')
            .gte('created_at', startDate.toISOString())

        if (votesError) throw votesError

        const filteredVotes = institution
            ? votes?.filter(v => v.institution === institution)
            : votes

        // Statistiques des CMP
        const { data: cmps, error: cmpsError } = await supabaseClient
            .from('cmp_sessions')
            .select('id, status, convened_at')
            .gte('convened_at', startDate.toISOString())

        if (cmpsError) throw cmpsError

        // Statistiques des sessions
        const { data: sessions, error: sessionsError } = await supabaseClient
            .from('parliamentary_sessions')
            .select('id, institution, status, session_type')
            .gte('scheduled_start', startDate.toISOString())

        if (sessionsError) throw sessionsError

        const filteredSessions = institution
            ? sessions?.filter(s => s.institution === institution)
            : sessions

        // Calculer les résumés
        const stats = {
            period: {
                name: period,
                start: startDate.toISOString(),
                end: now.toISOString()
            },
            institution: institution || 'ALL',
            texts: {
                total: filteredTexts?.length || 0,
                byType: {
                    projetsLoi: filteredTexts?.filter(t => t.text_type === 'PROJET_LOI').length || 0,
                    propositionsLoi: filteredTexts?.filter(t => t.text_type === 'PROPOSITION_LOI').length || 0,
                    loisFinances: filteredTexts?.filter(t => t.text_type === 'PROJET_LOI_FINANCES').length || 0,
                    resolutions: filteredTexts?.filter(t => t.text_type === 'RESOLUTION').length || 0,
                },
                byStatus: {
                    enCours: filteredTexts?.filter(t =>
                        !['ADOPTED', 'PROMULGATED', 'ARCHIVED', 'AN_REJECTED', 'SN_REJECTED'].includes(t.current_location)
                    ).length || 0,
                    adoptes: filteredTexts?.filter(t =>
                        ['ADOPTED', 'PROMULGATED'].includes(t.current_location)
                    ).length || 0,
                    rejetes: filteredTexts?.filter(t =>
                        ['AN_REJECTED', 'SN_REJECTED', 'CMP_FAILURE'].includes(t.current_location)
                    ).length || 0,
                },
                byLocation: {
                    AN: filteredTexts?.filter(t => t.current_location.startsWith('AN_')).length || 0,
                    SN: filteredTexts?.filter(t => t.current_location.startsWith('SN_')).length || 0,
                    navette: filteredTexts?.filter(t => t.current_location.startsWith('NAVETTE_')).length || 0,
                    CMP: filteredTexts?.filter(t => t.current_location.startsWith('CMP_')).length || 0,
                }
            },
            parliamentarians: {
                total: filteredParl?.length || 0,
                byRole: {
                    deputes: parliamentarians?.filter(p => p.role === 'AN_DEPUTE').length || 0,
                    senateurs: parliamentarians?.filter(p => p.role === 'SN_SENATEUR').length || 0,
                    presidents: parliamentarians?.filter(p =>
                        ['AN_PRESIDENT', 'SN_PRESIDENT', 'PG_PRESIDENT'].includes(p.role)
                    ).length || 0,
                }
            },
            votes: {
                total: filteredVotes?.length || 0,
                adoptes: filteredVotes?.filter(v => v.result === 'ADOPTED').length || 0,
                rejetes: filteredVotes?.filter(v => v.result === 'REJECTED').length || 0,
            },
            cmps: {
                total: cmps?.length || 0,
                enCours: cmps?.filter(c => ['PENDING', 'IN_PROGRESS'].includes(c.status)).length || 0,
                accords: cmps?.filter(c => c.status === 'AGREEMENT').length || 0,
                echecs: cmps?.filter(c => c.status === 'FAILURE').length || 0,
            },
            sessions: {
                total: filteredSessions?.length || 0,
                plenieres: filteredSessions?.filter(s => s.session_type === 'PLENIERE').length || 0,
                commissions: filteredSessions?.filter(s => s.session_type === 'COMMISSION').length || 0,
                aVenir: filteredSessions?.filter(s => s.status === 'SCHEDULED').length || 0,
            }
        }

        return new Response(
            JSON.stringify({ success: true, stats }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        return new Response(
            JSON.stringify({ success: false, error: errorMessage }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})

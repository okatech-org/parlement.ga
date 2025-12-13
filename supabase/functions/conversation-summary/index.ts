import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!messages || messages.length === 0) {
      return new Response(JSON.stringify({ 
        summary: 'Aucun message à résumer.',
        keyPoints: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Format conversation for summarization
    const conversationText = messages.map((m: any) => 
      `${m.role === 'user' ? 'Utilisateur' : 'iAsted'}: ${m.content}`
    ).join('\n\n');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `Tu es un assistant spécialisé dans la synthèse de conversations. 
Ton rôle est de produire un résumé concis et structuré d'une conversation.

Tu dois retourner un JSON valide avec:
- "summary": un résumé global de la conversation en 2-3 phrases
- "keyPoints": une liste de 3-5 points clés extraits de la conversation
- "topics": les sujets principaux abordés
- "actionItems": les actions ou décisions mentionnées (si applicable)
- "sentiment": le ton général de la conversation (positif, neutre, négatif)

Réponds UNIQUEMENT avec le JSON, sans markdown ni texte supplémentaire.`
          },
          {
            role: 'user',
            content: `Analyse et résume cette conversation:\n\n${conversationText}`
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requêtes atteinte, réessayez plus tard.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits insuffisants.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const errorText = await response.text();
      console.error('AI gateway error:', response.status, errorText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON response
    let parsedSummary;
    try {
      // Clean up potential markdown wrapping
      const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedSummary = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Failed to parse summary JSON:', parseError);
      parsedSummary = {
        summary: content,
        keyPoints: [],
        topics: [],
        actionItems: [],
        sentiment: 'neutre'
      };
    }

    return new Response(JSON.stringify(parsedSummary), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in conversation-summary:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

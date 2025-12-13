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
    const { query, messages } = await req.json();

    if (!query || !messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ results: [], error: 'Missing query or messages' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Use AI to find semantically similar messages
    const systemPrompt = `Tu es un assistant de recherche sémantique. L'utilisateur recherche dans l'historique de ses conversations.
    
Analyse la requête de recherche et les messages fournis. Retourne les indices des messages les plus pertinents par rapport à la requête.

IMPORTANT: Réponds UNIQUEMENT avec un JSON valide au format:
{"relevant_indices": [0, 2, 5], "relevance_scores": [0.95, 0.82, 0.71]}

Les indices correspondent aux positions dans le tableau de messages (0-indexé).
Retourne maximum 10 résultats, triés par pertinence décroissante.
Si aucun message n'est pertinent, retourne {"relevant_indices": [], "relevance_scores": []}`;

    const userPrompt = `Requête de recherche: "${query}"

Messages à analyser:
${messages.map((m: any, i: number) => `[${i}] ${m.role}: ${m.content.substring(0, 300)}${m.content.length > 300 ? '...' : ''}`).join('\n')}

Trouve les messages les plus pertinents pour cette recherche.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded, please try again later." }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required, please add funds." }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '{"relevant_indices": [], "relevance_scores": []}';

    // Parse the AI response
    let parsedResult;
    try {
      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResult = JSON.parse(jsonMatch[0]);
      } else {
        parsedResult = { relevant_indices: [], relevance_scores: [] };
      }
    } catch (e) {
      console.error('Failed to parse AI response:', content);
      parsedResult = { relevant_indices: [], relevance_scores: [] };
    }

    // Build results with the original messages
    const results = parsedResult.relevant_indices.map((idx: number, i: number) => ({
      index: idx,
      message: messages[idx],
      score: parsedResult.relevance_scores[i] || 0
    })).filter((r: any) => r.message);

    console.log(`Semantic search for "${query}" found ${results.length} results`);

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    console.error('Semantic search error:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error', results: [] }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

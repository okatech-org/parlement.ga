import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
    
    if (!OPENROUTER_API_KEY) {
      console.error('OPENROUTER_API_KEY is not set');
      throw new Error('OPENROUTER_API_KEY is not configured');
    }

    // Parse request body for voice and instructions
    let voice = 'alloy';
    let instructions = 'Tu es iAsted, l\'assistant intelligent du Parlement gabonais. Tu parles français et tu es professionnel, courtois et efficace.';
    
    try {
      const body = await req.json();
      if (body.voice) voice = body.voice;
      if (body.instructions) instructions = body.instructions;
    } catch {
      // Use defaults if no body
    }

    console.log('🔑 Requesting ephemeral token from OpenAI via OpenRouter...');
    console.log('Voice:', voice);

    // Request ephemeral token from OpenAI Realtime API
    // OpenRouter provides access to OpenAI models including realtime
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-realtime-preview-2024-12-17",
        voice: voice,
        instructions: instructions
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      
      // If OpenRouter key doesn't work for realtime, try alternative approach
      if (response.status === 401 || response.status === 403) {
        throw new Error('La clé API OpenRouter ne permet pas l\'accès à l\'API Realtime OpenAI. Une clé OpenAI directe est nécessaire.');
      }
      
      throw new Error(`Erreur API OpenAI: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Session created successfully");

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error("Error in get-realtime-token:", errorMessage);
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        hint: 'Pour utiliser la voix en temps réel, une clé API OpenAI directe est nécessaire.'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

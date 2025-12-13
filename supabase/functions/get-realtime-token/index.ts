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
    // Check for direct OpenAI API key first
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    
    if (!OPENAI_API_KEY) {
      console.log('OPENAI_API_KEY not set, returning fallback mode');
      // Return a response indicating to use TTS fallback
      return new Response(JSON.stringify({ 
        fallback: true,
        message: 'OpenAI Realtime API requires a direct OpenAI API key. Using TTS fallback mode.',
        hint: 'Add OPENAI_API_KEY secret for real-time voice capabilities.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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

    console.log('🔑 Requesting ephemeral token from OpenAI Realtime API...');
    console.log('Voice:', voice);

    // Request ephemeral token from OpenAI Realtime API
    const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
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
      
      // Return fallback mode on error
      return new Response(JSON.stringify({ 
        fallback: true,
        message: `OpenAI API error: ${response.status}`,
        hint: 'Using TTS fallback mode due to API error.'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
        fallback: true,
        message: errorMessage,
        hint: 'Using TTS fallback mode due to error.'
      }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
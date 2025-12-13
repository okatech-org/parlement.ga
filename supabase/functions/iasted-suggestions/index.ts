import { corsHeaders } from '../_shared/cors.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      throw new Error('LOVABLE_API_KEY non configurée');
    }

    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);

    // Fetch user's recent conversation history
    const { data: sessions, error: sessionsError } = await supabase
      .from('conversation_sessions')
      .select('id, title, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
    }

    // Fetch recent messages from these sessions
    let conversationContext = '';
    if (sessions && sessions.length > 0) {
      const sessionIds = sessions.map(s => s.id);
      
      const { data: messages, error: messagesError } = await supabase
        .from('conversation_messages')
        .select('content, role, session_id')
        .in('session_id', sessionIds)
        .order('created_at', { ascending: false })
        .limit(20);

      if (!messagesError && messages) {
        conversationContext = messages
          .filter(m => m.role === 'user')
          .map(m => m.content)
          .join('\n');
      }
    }

    console.log('Generating suggestions based on conversation history');

    // Use tool calling to get structured suggestions
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
            content: `Tu es iAsted, l'assistant IA de l'Assemblée Nationale du Gabon. 
Analyse l'historique des conversations de l'utilisateur et génère des suggestions personnalisées.
Les suggestions doivent être pertinentes par rapport aux sujets abordés précédemment.
Si l'historique est vide, propose des suggestions générales sur les services parlementaires.`
          },
          {
            role: 'user',
            content: conversationContext 
              ? `Voici l'historique des questions de l'utilisateur:\n${conversationContext}\n\nGénère 4 suggestions pertinentes.`
              : `L'utilisateur n'a pas encore de conversations. Génère 4 suggestions générales pour découvrir les services de l'Assemblée Nationale.`
          }
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'generate_suggestions',
              description: 'Génère des suggestions de questions pour l\'utilisateur',
              parameters: {
                type: 'object',
                properties: {
                  suggestions: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        text: { 
                          type: 'string',
                          description: 'Le texte de la suggestion (question courte)'
                        },
                        category: { 
                          type: 'string', 
                          enum: ['legislation', 'demarches', 'informations', 'assistance'],
                          description: 'Catégorie de la suggestion'
                        },
                        icon: {
                          type: 'string',
                          enum: ['FileText', 'HelpCircle', 'Building', 'Users'],
                          description: 'Icône associée'
                        }
                      },
                      required: ['text', 'category', 'icon']
                    },
                    minItems: 4,
                    maxItems: 4
                  }
                },
                required: ['suggestions']
              }
            }
          }
        ],
        tool_choice: { type: 'function', function: { name: 'generate_suggestions' } }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Limite de requêtes atteinte' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Crédits insuffisants' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      throw new Error('Erreur du service IA');
    }

    const data = await response.json();
    console.log('AI response:', JSON.stringify(data));

    // Extract suggestions from tool call
    let suggestions = [];
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (toolCall?.function?.arguments) {
      try {
        const args = JSON.parse(toolCall.function.arguments);
        suggestions = args.suggestions || [];
      } catch (e) {
        console.error('Error parsing tool arguments:', e);
      }
    }

    // Fallback suggestions if AI fails
    if (suggestions.length === 0) {
      suggestions = [
        { text: 'Comment suivre un projet de loi ?', category: 'legislation', icon: 'FileText' },
        { text: 'Quelles démarches pour contacter un député ?', category: 'demarches', icon: 'Users' },
        { text: 'Informations sur les commissions parlementaires', category: 'informations', icon: 'Building' },
        { text: 'Aide pour mes démarches administratives', category: 'assistance', icon: 'HelpCircle' },
      ];
    }

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('iasted-suggestions error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erreur inconnue' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

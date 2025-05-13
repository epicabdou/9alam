// supabase/functions/ai-copywriting/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'
import { ChatCompletionRequestMessage } from 'https://esm.sh/openai@4.24.1'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
const openaiApiKey = Deno.env.get('OPENAI_API_KEY') ?? ''
const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY') ?? ''
const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY') ?? ''

interface RequestBody {
    prompt: string;
    contentType: string;
    projectId?: string;
    aiProvider?: 'openai' | 'anthropic' | 'deepseek';
    temperature?: number;
    additionalInstructions?: string;
}

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Create a Supabase client with the Auth context of the logged-in user
        const supabaseClient = createClient(
            supabaseUrl,
            supabaseAnonKey,
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! },
                },
            }
        )

        // Get the current user's ID
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            return new Response(
                JSON.stringify({ error: 'Unauthorized' }),
                {
                    status: 401,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            )
        }

        // Parse request body
        const { prompt, contentType, projectId, aiProvider = 'openai', temperature = 0.7, additionalInstructions = '' } = await req.json() as RequestBody

        if (!prompt || !contentType) {
            return new Response(
                JSON.stringify({ error: 'Prompt and content type are required' }),
                {
                    status: 400,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                }
            )
        }

        // Prepare the prompt with content type context
        let fullPrompt = `You are a professional copywriter specializing in ${contentType}. 
Create compelling, engaging, and effective copy based on the following prompt:

${prompt}`;

        if (additionalInstructions) {
            fullPrompt += `\n\nAdditional instructions: ${additionalInstructions}`;
        }

        let generatedContent: string;

        // Call AI API based on the provider
        if (aiProvider === 'openai') {
            // Call OpenAI API
            const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${openaiApiKey}`,
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional copywriter that creates compelling, engaging, and effective copy.'
                        },
                        {
                            role: 'user',
                            content: fullPrompt
                        }
                    ],
                    temperature: temperature,
                }),
            });

            const openaiData = await openaiResponse.json();
            generatedContent = openaiData.choices[0].message.content;
        } else if (aiProvider === 'deepseek') {
            // Call DeepSeek API
            const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${deepseekApiKey}`,
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional copywriter that creates compelling, engaging, and effective copy.'
                        },
                        {
                            role: 'user',
                            content: fullPrompt
                        }
                    ],
                    temperature: temperature,
                }),
            });

            const deepseekData = await deepseekResponse.json();
            generatedContent = deepseekData.choices[0].message.content;
        } else {
            // Call Anthropic API
            const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': anthropicApiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-opus-20240229',
                    messages: [
                        {
                            role: 'user',
                            content: fullPrompt
                        }
                    ],
                    temperature: temperature,
                    max_tokens: 4000,
                }),
            });

            const anthropicData = await anthropicResponse.json();
            generatedContent = anthropicData.content[0].text;
        }

        // Store the generated content in the database if projectId is provided
        if (projectId) {
            const { data: contentPiece, error: contentError } = await supabaseClient
                .from('content_pieces')
                .insert({
                    project_id: projectId,
                    user_id: user.id,
                    title: prompt.substring(0, 50) + '...',
                    content_type: contentType,
                    prompt: prompt,
                    generated_content: generatedContent,
                })
                .select()
                .single();

            if (contentError) {
                console.error('Error storing content:', contentError);
            } else if (contentPiece) {
                // Store the initial version
                await supabaseClient
                    .from('content_versions')
                    .insert({
                        content_id: contentPiece.id,
                        version_number: 1,
                        content: generatedContent,
                    });
            }
        }

        // Return the generated content
        return new Response(
            JSON.stringify({
                content: generatedContent,
            }),
            {
                status: 200,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        )
    } catch (error) {
        console.error('Error processing request:', error);

        return new Response(
            JSON.stringify({ error: 'Internal Server Error', details: error.message }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            }
        )
    }
})
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  message: string;
  emotion?: string;
  engagement_score?: number;
  history?: Message[];
  api_key?: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body: ChatRequest = await req.json();
    const { message, emotion = "neutral", engagement_score = 75, history = [], api_key } = body;

    const openaiKey = api_key || Deno.env.get("GROQ_API_KEY");

    if (!openaiKey) {
      return new Response(
        JSON.stringify({ error: "No Groq API key configured. Please add your key in Settings." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    let systemPrompt = `You are AdaptIQ, a patient and adaptive AI tutor. You teach using the Socratic method — guide students to discover answers through thoughtful questions rather than just giving them the answer. Keep responses clear, engaging, and educational.

Current student emotion: ${emotion}
Current engagement score: ${engagement_score}%`;

    if (emotion === "frustrated") {
      systemPrompt += `\n\nThe student is frustrated. Break down your answer into clearly numbered steps. Use very simple language. Start your response with "No worries, let's break this down step by step:"`;
    } else if (emotion === "bored") {
      systemPrompt += `\n\nThe student seems disengaged. Start with a surprising fact or clever analogy to hook their interest. Keep the response under 100 words and end with an interesting question.`;
    }

    if (engagement_score < 40) {
      systemPrompt += `\n\nEngagement is critically low. Ask a direct, specific question at the end of your response to re-engage the student.`;
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.slice(-6),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openaiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Groq API error");
    }

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I couldn't generate a response. Please try again.";

    return new Response(
      JSON.stringify({ reply, usage: data.usage }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { brandIdea, industry } = await req.json();

    if (!brandIdea || typeof brandIdea !== "string" || brandIdea.length > 200) {
      return new Response(JSON.stringify({ error: "Invalid brand idea" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are BrandForge, an expert AI branding strategist. Given a brand idea/keywords and optionally an industry, generate a complete brand identity. You MUST respond by calling the generate_brand_identity tool.`;

    const userPrompt = `Brand idea: "${brandIdea}"${industry ? `\nIndustry: "${industry}"` : ""}\n\nGenerate a complete brand identity with creative, memorable names and compelling copy.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "generate_brand_identity",
              description: "Generate a complete brand identity package",
              parameters: {
                type: "object",
                properties: {
                  brandNames: {
                    type: "array",
                    items: { type: "string" },
                    description: "5 unique brand name suggestions",
                  },
                  tagline: { type: "string", description: "A catchy tagline" },
                  missionStatement: { type: "string", description: "A compelling mission statement (2-3 sentences)" },
                  brandVoice: { type: "string", description: "Description of the brand voice and tone (2-3 sentences)" },
                  colorSuggestions: {
                    type: "array",
                    items: { type: "string" },
                    description: "5 hex color codes for a brand palette",
                  },
                  elevatorPitch: { type: "string", description: "A 3-4 sentence elevator pitch" },
                },
                required: ["brandNames", "tagline", "missionStatement", "brandVoice", "colorSuggestions", "elevatorPitch"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "generate_brand_identity" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      throw new Error("AI generation failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

    if (!toolCall?.function?.arguments) {
      throw new Error("Invalid AI response");
    }

    const brandIdentity = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(brandIdentity), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-brand error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// @ts-nocheck - This is a Deno Edge Function
/// <reference types="https://deno.land/x/types/index.d.ts" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { goalText } = await req.json();
    
    if (!goalText || typeof goalText !== 'string' || goalText.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Goal text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    const systemPrompt = `You are Kairon, an expert project manager and strategic planner AI. Your primary function is to deconstruct a user's high-level goal into a complete, actionable, and logical project plan.

Your task is to analyze the goal and generate a detailed project plan. The output MUST be a single, valid JSON object.

The JSON object must conform to the following schema:
{
  "projectName": "A concise and inspiring name for the project, derived from the user's goal.",
  "projectSummary": "A one-paragraph summary of the project's objective and the planned approach.",
  "tasks": [
    {
      "id": 1,
      "title": "A short, clear title for the task.",
      "description": "A detailed, actionable description of what needs to be done to complete this task.",
      "category": "A relevant category like 'Research', 'Design', 'Development', 'Marketing', 'Legal', etc.",
      "estimated_duration_hours": <integer>,
      "dependencies": [<integer array of task IDs that must be completed before this one can start. Use an empty array [] if there are no dependencies.>]
    }
  ]
}

CRITICAL INSTRUCTIONS:
1. Logical Sequencing: Ensure the dependencies are logical. A task cannot depend on a task that comes after it. The first tasks should have no dependencies.
2. Completeness: The breakdown must be comprehensive. Think about all the steps required to achieve the goal, from initial research to final launch or review.
3. Actionable Tasks: Each task title and description must be clear and actionable. Avoid vague descriptions.
4. Realistic Durations: The estimated_duration_hours must be a reasonable estimate for a single person or small team.
5. ID Integrity: Task ids must be sequential integers starting from 1.`;

    // Using OpenAI-compatible API endpoint
    const API_ENDPOINT = Deno.env.get("AI_API_ENDPOINT") || "https://ai.gateway.lovable.dev/v1/chat/completions";
    
    const response = await fetch(API_ENDPOINT, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `The user's goal is: "${goalText}"\n\nGenerate the complete JSON plan for this goal.` }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your AI workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON from the AI response
    let planData;
    try {
      // Try to extract JSON if it's wrapped in markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : content;
      planData = JSON.parse(jsonText.trim());
    } catch (parseError) {
      console.error("Failed to parse AI response as JSON:", content);
      return new Response(
        JSON.stringify({ error: "Failed to generate valid plan. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate the plan structure
    if (!planData.projectName || !planData.projectSummary || !Array.isArray(planData.tasks)) {
      return new Response(
        JSON.stringify({ error: "Invalid plan structure generated" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(planData),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in generate-plan:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

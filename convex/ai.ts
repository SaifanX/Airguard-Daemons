import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

"use node";

// This action is used if you want to run the AI call on the backend
// instead of the frontend.
export const askCaptain = action({
  args: {
    userMessage: v.string(),
    riskLevel: v.number(),
    violations: v.array(v.string()),
    flightDetails: v.object({
      model: v.string(),
      altitude: v.number(),
    }),
    weather: v.optional(v.object({
      condition: v.string(),
      windSpeed: v.number(),
    })),
    zoneContext: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing on server");

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const weatherContext = args.weather
      ? `- Weather: ${args.weather.condition}, Wind: ${args.weather.windSpeed} km/h`
      : "- Weather telemetry not synced";

    const systemPrompt = `
      You are 'Guard-1', a helpful AI flight safety assistant for AirGuard (a project by Team Daemons, winner of 2nd place at TechnoFest 2026, Stonehill School).
      Your goal is to help drone pilots fly safely by providing concise, actionable advice based on the provided mission context.

      MISSION CONTEXT:
      - Current Risk Assessment: ${args.riskLevel}%
      - Safety Violations Found: ${args.violations.length > 0 ? args.violations.join(", ") : "None Detected"}
      - Drone Config: ${args.flightDetails.model} (Operating Height: ${args.flightDetails.altitude}m)
      - ${weatherContext}
      - Airspace Status: ${args.zoneContext}

      PERSONALITY:
      - Professional, encouraging, and clear.
      - Use aviation terminology where appropriate but keep it accessible.
      - If risk is high (>60%), be more urgent and professional.
      - Always reference safety first.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: args.userMessage,
        config: { systemInstruction: systemPrompt }
      });
      return response.text;
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("API key not valid")) {
        return "SECURITY ERROR: The tactical API key is invalid. Please contact system admin.";
      }
      return "Radio silence. Connection error.";
    }
  },
});

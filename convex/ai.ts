"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

// This action is used if you want to run the AI call on the backend
// instead of the frontend.
export const askCaptain = action({
  args: {
    userMessage: v.string(),
    riskLevel: v.number(),
    violations: v.array(v.string()),
    droneModel: v.string(),
    weatherContext: v.optional(v.string()),
    zoneContext: v.optional(v.string()),
    flightStats: v.optional(v.any()),
    telemetry: v.optional(v.any())
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing on server");

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const systemPrompt = `
      You are Captain Arjun, a retired Indian Air Force pilot and strict drone safety instructor.
      Risk Level: ${args.riskLevel}%.
      Violations: ${args.violations.length > 0 ? args.violations.join(", ") : "None Detected"}.
      Drone: ${args.droneModel}.
      ${args.weatherContext || "- Weather telemetry not synced"}
      Airspace Status: ${args.zoneContext || "Primary airspace is clear of active restrictions."}
      Be strict, professional, and concise.
    `;

    try {
      const response = await ai.models.generateContent({
        model,
        contents: args.userMessage,
        config: { systemInstruction: systemPrompt }
      });
      return response.text;
    } catch (e) {
      console.error(e);
      return "Radio silence. Connection error.";
    }
  },
});

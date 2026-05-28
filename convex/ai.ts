"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

export const askCaptain = action({
  args: {
    userMessage: v.string(),
    riskLevel: v.number(),
    violations: v.array(v.string()),
    droneModel: v.string(),
    altitude: v.number(),
    weatherContext: v.string(),
    zoneContext: v.string(),
  },
  handler: async (_ctx, args) => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing on server");

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const systemPrompt = `
    You are 'Guard-1', a helpful AI flight safety assistant for AirGuard (a project by Team Daemons, winner of 2nd place at TechnoFest 2026, Stonehill School).
    Your goal is to help drone pilots fly safely by providing concise, actionable advice based on the provided mission context.

    MISSION CONTEXT:
    - Current Risk Assessment: ${args.riskLevel}%
    - Safety Violations Found: ${args.violations.length > 0 ? args.violations.join(", ") : "None Detected"}
    - Drone Config: ${args.droneModel} (Operating Height: ${args.altitude}m)
    - ${args.weatherContext}
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
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        }
      });
      return response.text;
    } catch (e: any) {
      console.error("Gemini API Error:", e);
      if (e.message?.includes("API key not valid")) {
        return "SECURITY ERROR: The tactical API key is invalid. Please contact system admin.";
      }
      return "Relay Error: Could not connect to the AI Tactical Core. Check logs.";
    }
  },
});

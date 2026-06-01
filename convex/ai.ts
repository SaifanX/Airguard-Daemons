"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

export const askCaptain = action({
  args: {
    userMessage: v.string(),
    systemInstruction: v.string()
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing on server");

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    try {
      const response = await ai.models.generateContent({
        model,
        contents: args.userMessage,
        config: { systemInstruction: args.systemInstruction, temperature: 0.7 }
      });
      return response.text || "Communication relay weak. Please rephrase your request, Pilot.";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.message?.includes("API key not valid")) {
        return "SECURITY ERROR: The tactical API key is invalid. Please contact system admin.";
      }
      return "Relay Error: Could not connect to the AI Tactical Core. Check logs.";
    }
  },
});

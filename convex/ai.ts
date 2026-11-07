import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";

const CANDIDATE_MODELS = [
  "gemini-2.5-flash",
  "gemini-flash-latest",
  "gemini-2.5-flash-lite",
  "gemini-3.8-flash"
];

export const askCaptain = action({
  args: {
    userMessage: v.string(),
    riskLevel: v.number(),
    violations: v.array(v.string()),
    droneModel: v.string(),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("API Key missing on server");

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `
      You are Captain Arjun, a retired Indian Air Force pilot and strict drone safety instructor for AirGuard.
      Risk Level: ${args.riskLevel}%.
      Violations: ${args.violations.join(", ")}.
      Drone: ${args.droneModel}.
      Be strict, professional, and concise according to India Drone Rules 2021.
    `;

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents: args.userMessage,
          config: { systemInstruction: systemPrompt }
        });
        if (response && response.text) {
          return response.text;
        }
      } catch (e: any) {
        console.warn(`Convex AI model ${model} failed, attempting next model`, e);
      }
    }

    return "Captain Arjun: Radio connection established in low-bandwidth contingency mode. Flight risk assessment active. Ensure all pre-flight checks are verified before arming props.";
  },
});

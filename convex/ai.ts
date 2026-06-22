"use node";

import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";
import { RESTRICTED_ZONES } from "./data/zones";
import { ZoneType } from "./types";
import { lineString, polygon, booleanIntersects } from '@turf/turf';

export const askCaptain = action({
  args: {
    userMessage: v.string(),
    riskLevel: v.number(),
    violations: v.array(v.string()),
    flightDetails: v.any(),
    weather: v.optional(v.any()),
    flightStats: v.optional(v.any()),
    telemetry: v.optional(v.any()),
    path: v.optional(v.array(v.object({ lat: v.number(), lng: v.number() }))),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("AI_COMMAND_ERROR: API_KEY is missing from environment.");
      return "Tactical link failed. System API_KEY is not configured in the environment.";
    }

    const ai = new GoogleGenAI({ apiKey });

    const weatherContext = args.weather
      ? `- Weather: ${args.weather.condition}, Wind: ${args.weather.windSpeed} km/h`
      : "- Weather telemetry not synced";

    let zoneContext = "Primary airspace is clear of active restrictions.";
    if (args.path && args.path.length >= 2) {
      try {
        const line = lineString(args.path.map(p => [p.lng, p.lat]));
        const intersected = RESTRICTED_ZONES.filter(zone => {
          if (zone.type === ZoneType.CONTROLLED) return false;
          const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
          const poly = polygon([polyCoords as any]);
          return booleanIntersects(line, poly);
        }).map(z => z.name);

        if (intersected.length > 0) zoneContext = `CRITICAL: Flight vector enters restricted zones: ${intersected.join(", ")}.`;
      } catch (e) {
        console.warn("Zone intersection check failed during AI context generation");
      }
    }

    const systemInstruction = `
      You are 'Guard-1', a helpful AI flight safety assistant for AirGuard (a project by Team Daemons, winner of 2nd place at TechnoFest 2026, Stonehill School).
      Your goal is to help drone pilots fly safely by providing concise, actionable advice based on the provided mission context.

      MISSION CONTEXT:
      - Current Risk Assessment: ${args.riskLevel}%
      - Safety Violations Found: ${args.violations.length > 0 ? args.violations.join(", ") : "None Detected"}
      - Drone Config: ${args.flightDetails.model} (Operating Height: ${args.flightDetails.altitude}m)
      - ${weatherContext}
      - Airspace Status: ${zoneContext}

      PERSONALITY:
      - Professional, encouraging, and clear.
      - Use aviation terminology where appropriate but keep it accessible.
      - If risk is high (>60%), be more urgent and professional.
      - Always reference safety first.
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: args.userMessage,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
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

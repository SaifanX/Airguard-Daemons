
import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";
import { lineString, polygon, booleanIntersects } from '@turf/turf';

// Define the zones directly in the backend to avoid dependency on frontend data files if possible,
// or import them if the environment allows. Since we're in Convex, we'll redefine the relevant parts.
const RESTRICTED_ZONES = [
  {
    name: 'Kempegowda Int. Airport (KIA) - Primary Airspace',
    coordinates: [
      { lat: 13.2150, lng: 77.6800 },
      { lat: 13.2200, lng: 77.7300 },
      { lat: 13.2000, lng: 77.7450 },
      { lat: 13.1800, lng: 77.7400 },
      { lat: 13.1750, lng: 77.6950 },
      { lat: 13.1850, lng: 77.6750 },
    ],
  },
  {
    name: 'Yelahanka Air Force Station - Training Grounds',
    coordinates: [
      { lat: 13.1550, lng: 77.5950 },
      { lat: 13.1500, lng: 77.6250 },
      { lat: 13.1300, lng: 77.6350 },
      { lat: 13.1150, lng: 77.6200 },
      { lat: 13.1200, lng: 77.5850 },
      { lat: 13.1400, lng: 77.5800 },
    ],
  },
  {
    name: 'Bangalore Central - High Security Corridor',
    coordinates: [
      { lat: 13.0100, lng: 77.5600 },
      { lat: 13.0150, lng: 77.6150 },
      { lat: 12.9850, lng: 77.6400 },
      { lat: 12.9450, lng: 77.6250 },
      { lat: 12.9400, lng: 77.5750 },
      { lat: 12.9700, lng: 77.5500 },
    ],
  },
  {
    name: 'HAL Airspace Corridor - Industrial Sector',
    coordinates: [
      { lat: 12.9650, lng: 77.6450 },
      { lat: 12.9550, lng: 77.6850 },
      { lat: 12.9400, lng: 77.6950 },
      { lat: 12.9350, lng: 77.6550 },
      { lat: 12.9500, lng: 77.6350 },
    ],
  }
];

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
    flightStats: v.optional(v.object({
      distance: v.number(),
      waypoints: v.number(),
    })),
    telemetry: v.optional(v.object({
      speed: v.number(),
      heading: v.number(),
      battery: v.number(),
      altitudeAGL: v.number(),
    })),
    path: v.optional(v.array(v.object({
      lat: v.number(),
      lng: v.number(),
    }))),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
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
        model: "gemini-1.5-flash", // Using a stable model name
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

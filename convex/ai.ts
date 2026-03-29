import { action } from "./_generated/server";
import { v } from "convex/values";
import { GoogleGenAI } from "@google/genai";
import { lineString, polygon, booleanIntersects } from '@turf/turf';

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
    path: v.optional(v.array(v.object({ lat: v.number(), lng: v.number() }))),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) throw new Error("API Key missing on server");

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-3-flash-preview";

    const weatherContext = args.weather
      ? `- Weather: ${args.weather.condition}, Wind: ${args.weather.windSpeed} km/h`
      : "- Weather telemetry not synced";

    let zoneContext = "Primary airspace is clear of active restrictions.";

    // We recreate the RESTRICTED_ZONES from data/zones.ts since we can't easily import it if it's not a node module,
    // but assuming it can be imported, let's just define it here to be safe and avoid module resolution issues
    const RESTRICTED_ZONES = [
      {
        id: 'z1', name: 'Kempegowda Int. Airport (KIA) - Primary Airspace', type: 'CRITICAL',
        coordinates: [{ lat: 13.215, lng: 77.68 }, { lat: 13.22, lng: 77.73 }, { lat: 13.2, lng: 77.745 }, { lat: 13.18, lng: 77.74 }, { lat: 13.175, lng: 77.695 }, { lat: 13.185, lng: 77.675 }]
      },
      {
        id: 'z2', name: 'Yelahanka Air Force Station - Training Grounds', type: 'RESTRICTED',
        coordinates: [{ lat: 13.155, lng: 77.595 }, { lat: 13.15, lng: 77.625 }, { lat: 13.13, lng: 77.635 }, { lat: 13.115, lng: 77.62 }, { lat: 13.12, lng: 77.585 }, { lat: 13.14, lng: 77.58 }]
      },
      {
        id: 'z3', name: 'Bangalore Central - High Security Corridor', type: 'CONTROLLED',
        coordinates: [{ lat: 13.01, lng: 77.56 }, { lat: 13.015, lng: 77.615 }, { lat: 12.985, lng: 77.64 }, { lat: 12.945, lng: 77.625 }, { lat: 12.94, lng: 77.575 }, { lat: 12.97, lng: 77.55 }]
      },
      {
        id: 'z4', name: 'HAL Airspace Corridor - Industrial Sector', type: 'CRITICAL',
        coordinates: [{ lat: 12.965, lng: 77.645 }, { lat: 12.955, lng: 77.685 }, { lat: 12.94, lng: 77.695 }, { lat: 12.935, lng: 77.655 }, { lat: 12.95, lng: 77.635 }]
      }
    ];

    if (args.path && args.path.length >= 2) {
      try {
        const line = lineString(args.path.map(p => [p.lng, p.lat]));
        const intersected = RESTRICTED_ZONES.filter(zone => {
          if (zone.type === 'CONTROLLED') return false;
          const polyCoords = [...zone.coordinates.map(c => [c.lng, c.lat]), [zone.coordinates[0].lng, zone.coordinates[0].lat]];
          const poly = polygon([polyCoords as any]);
          return booleanIntersects(line, poly);
        }).map(z => z.name);

        if (intersected.length > 0) zoneContext = `CRITICAL: Flight vector enters restricted zones: ${intersected.join(", ")}.`;
      } catch (e) {
        console.warn("Zone intersection check failed during AI context generation");
      }
    }

    const systemPrompt = `
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
